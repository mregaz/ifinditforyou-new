import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseServiceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

function toIsoFromUnixSeconds(sec: number | null | undefined) {
  if (!sec || typeof sec !== "number") return null;
  return new Date(sec * 1000).toISOString();
}

function isProFromStripeStatus(status: Stripe.Subscription.Status) {
  return status === "active" || status === "trialing";
}

function shouldRetrySupabaseError(err: any): boolean {
  const msg = (err?.message ?? "").toString().toLowerCase();
  const code = (err?.code ?? "").toString();

  const looksPermanent =
    msg.includes("column") ||
    msg.includes("does not exist") ||
    msg.includes("relation") ||
    msg.includes("schema cache") ||
    code === "42703" || // undefined_column
    code === "42P01";   // undefined_table

  return !looksPermanent;
}

function supabaseFailureResponse(err: any) {
  return shouldRetrySupabaseError(err)
    ? new NextResponse("Supabase transient error", { status: 500 }) // Stripe retry
    : NextResponse.json({ received: true }); // no retry
}

async function upsertUser(userId: string, patch: Record<string, any>) {
  return supabase.from("User").upsert({ id: userId, ...patch }, { onConflict: "id" });
}

async function updateUserById(userId: string, patch: Record<string, any>) {
  return supabase.from("User").update(patch).eq("id", userId);
}

async function updateUserBySubscriptionId(subscriptionId: string, patch: Record<string, any>) {
  return supabase.from("User").update(patch).eq("stripe_subscription_id", subscriptionId);
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    // A) Checkout completed -> set PRO
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id ?? null;
      if (!userId) return NextResponse.json({ received: true });

      const customerId =
        typeof session.customer === "string" ? session.customer : (session.customer as any)?.id ?? null;

      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : (session.subscription as any)?.id ?? null;

      let stripeStatus: Stripe.Subscription.Status = "active";
      let cancelAtPeriodEnd = false;
      let currentPeriodEndIso: string | null = null;

      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);
        stripeStatus = sub.status;
        cancelAtPeriodEnd = !!sub.cancel_at_period_end;

        const cpe = (sub as any).current_period_end as number | undefined;
        currentPeriodEndIso = toIsoFromUnixSeconds(cpe);
      }

      const isPro = isProFromStripeStatus(stripeStatus);

      const { error } = await upsertUser(userId, {
        is_pro: isPro,
        plan: isPro ? "pro" : "free",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_status: stripeStatus,
        cancel_at_period_end: cancelAtPeriodEnd,
        current_period_end: currentPeriodEndIso,
      });

      if (error) return supabaseFailureResponse(error);
      return NextResponse.json({ received: true });
    }

    // B) Subscription updated -> keep state consistent
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const status = sub.status;
      const cancelAtPeriodEnd = !!sub.cancel_at_period_end;

      const cpe = (sub as any).current_period_end as number | undefined;
      const currentPeriodEndIso = toIsoFromUnixSeconds(cpe);

      const isPro = isProFromStripeStatus(status);
      const userId = sub.metadata?.user_id ? String(sub.metadata.user_id) : null;

      const patch = {
        is_pro: isPro,
        plan: isPro ? "pro" : "free",
        stripe_status: status,
        cancel_at_period_end: cancelAtPeriodEnd,
        current_period_end: currentPeriodEndIso,
        stripe_subscription_id: sub.id,
        stripe_customer_id: typeof sub.customer === "string" ? sub.customer : sub.customer.id,
      };

      const { error } = userId
        ? await updateUserById(userId, patch)
        : await updateUserBySubscriptionId(sub.id, patch);

      if (error) return supabaseFailureResponse(error);
      return NextResponse.json({ received: true });
    }

    // C) Subscription deleted -> downgrade final
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const userId = sub.metadata?.user_id ? String(sub.metadata.user_id) : null;

      const patch = {
        is_pro: false,
        plan: "free",
        stripe_status: "canceled",
        cancel_at_period_end: false,
        current_period_end: null,
      };

      const { error } = userId
        ? await updateUserById(userId, patch)
        : await updateUserBySubscriptionId(sub.id, patch);

      if (error) return supabaseFailureResponse(error);
      return NextResponse.json({ received: true });
    }

    return NextResponse.json({ received: true });
  } catch {
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
