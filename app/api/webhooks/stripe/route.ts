// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function toIsoFromUnixSeconds(sec?: number | null) {
  if (!sec) return null;
  return new Date(sec * 1000).toISOString();
}

async function updateUserById(userId: string, patch: Record<string, any>) {
  return supabase.from("User").update(patch).eq("id", userId).select("id, email, is_pro, plan, stripe_status");
}

async function updateUserBySubscriptionId(subscriptionId: string, patch: Record<string, any>) {
  return supabase
    .from("User")
    .update(patch)
    .eq("stripe_subscription_id", subscriptionId)
    .select("id, email, is_pro, plan, stripe_status");
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe signature verification failed:", err?.message ?? err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    // --- A) checkout.session.completed -> upgrade immediato ---
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      if (!userId) {
        console.error("Missing client_reference_id. Ensure create-checkout-session sets it.");
        return NextResponse.json({ received: true });
      }

      const customerId =
        typeof session.customer === "string" ? session.customer : (session.customer as any)?.id ?? null;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : (session.subscription as any)?.id ?? null;

      // Upgrade user
      const patch = {
        is_pro: true,
        plan: "pro",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_status: "active",
        cancel_at_period_end: false,
        // NB: current_period_end arriverà con customer.subscription.updated
        updatedAt: new Date().toISOString(),
      };

      const { data: updated, error: updErr } = await updateUserById(userId, patch);

      if (updErr) {
        console.error("Supabase UPDATE error (checkout.session.completed):", updErr);
      } else if (!updated || updated.length === 0) {
        // Fallback UPSERT se la riga non esiste ancora
        const { error: upsErr } = await supabase.from("User").upsert({ id: userId, ...patch }, { onConflict: "id" });
        if (upsErr) console.error("Supabase UPSERT error (checkout.session.completed):", upsErr);
      }

      // Best-effort Payment insert (non blocca webhook se schema diverso)
      try {
        const amountTotal = (session as any).amount_total ?? null; // centesimi
        const stripeSessionId = session.id;

        const { error: payErr } = await supabase.from("Payment").insert({
          userId,
          stripeSessionId,
          amount: amountTotal,
          creditsGranted: 0,
          createdAt: new Date().toISOString(),
        });

        // Ignora errori di duplicato (se hai unique su stripeSessionId)
        if (payErr && payErr.code !== "23505") {
          console.warn("Payment insert warning:", payErr);
        }
      } catch (e: any) {
        // ignoriamo per evitare di rompere
        console.warn("Payment insert skipped:", e?.message ?? e);
      }
    }

    // --- B) customer.subscription.updated -> STANDARD (status + cancel + end date) ---
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const subscriptionId = sub.id;
      const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;

      const status = sub.status; // active, trialing, past_due, canceled...
      const cancelAtPeriodEnd = !!sub.cancel_at_period_end;
      const currentPeriodEndIso = toIsoFromUnixSeconds(sub.current_period_end);

      // STANDARD: PRO true solo se active o trialing
      const isPro = status === "active" || status === "trialing";

      const patch = {
        is_pro: isPro,
        plan: isPro ? "pro" : "free",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_status: status,
        cancel_at_period_end: cancelAtPeriodEnd,
        current_period_end: currentPeriodEndIso,
        updatedAt: new Date().toISOString(),
      };

      // 1) prova con metadata.user_id (se lo imposti in create-checkout-session)
      const metaUserId = (sub.metadata && (sub.metadata as any).user_id) ? String((sub.metadata as any).user_id) : null;

      if (metaUserId) {
        const { data, error } = await updateUserById(metaUserId, patch);
        if (error) console.error("Supabase subscription.updated error (by user_id):", error);
        else if (!data || data.length === 0) console.warn("No User matched by id (subscription.updated):", metaUserId);
      } else {
        // 2) fallback by stripe_subscription_id
        const { data, error } = await updateUserBySubscriptionId(subscriptionId, patch);
        if (error) console.error("Supabase subscription.updated error (by subscription_id):", error);
        else if (!data || data.length === 0) console.warn("No User matched by stripe_subscription_id:", subscriptionId);
      }
    }

    // --- C) customer.subscription.deleted -> downgrade finale ---
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const subscriptionId = sub.id;

      const patch = {
        is_pro: false,
        plan: "free",
        stripe_status: "canceled",
        cancel_at_period_end: false,
        current_period_end: null,
        updatedAt: new Date().toISOString(),
      };

      const metaUserId = (sub.metadata && (sub.metadata as any).user_id) ? String((sub.metadata as any).user_id) : null;

      if (metaUserId) {
        const { data, error } = await updateUserById(metaUserId, patch);
        if (error) console.error("Supabase subscription.deleted error (by user_id):", error);
        else if (!data || data.length === 0) console.warn("No User matched by id (subscription.deleted):", metaUserId);
      } else {
        const { data, error } = await updateUserBySubscriptionId(subscriptionId, patch);
        if (error) console.error("Supabase subscription.deleted error (by subscription_id):", error);
        else if (!data || data.length === 0) console.warn("No User matched by stripe_subscription_id:", subscriptionId);
      }
    }
  } catch (err: any) {
    console.error("Webhook handler error:", err?.message ?? err);
  }

  // Rispondi sempre 200 a Stripe
  return NextResponse.json({ received: true });
}
