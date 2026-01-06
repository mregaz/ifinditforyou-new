import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeCreditsAndCap(priceId: string | null) {
  const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY ?? null;
  const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY ?? null;

  // Default scelti da me
  const MONTHLY_CREDITS = 100;
  const YEARLY_CREDITS = 1200;

  const MONTHLY_CAP = 300;   // max 3 mesi
  const YEARLY_CAP = 2400;   // max 2 anni

  if (priceId && monthlyPriceId && priceId === monthlyPriceId) {
    return { credits: MONTHLY_CREDITS, cap: MONTHLY_CAP, plan: "pro" as const };
  }

  if (priceId && yearlyPriceId && priceId === yearlyPriceId) {
    return { credits: YEARLY_CREDITS, cap: YEARLY_CAP, plan: "pro" as const };
  }

  // Fallback prudente
  return { credits: MONTHLY_CREDITS, cap: MONTHLY_CAP, plan: "pro" as const };
}

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing env vars", {
      hasWebhookSecret: !!webhookSecret,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceRoleKey: !!serviceRoleKey,
      vercelEnv: process.env.VERCEL_ENV,
      vercelUrl: process.env.VERCEL_URL,
    });
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Invalid Stripe signature", { message: err?.message });
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    // =========================================================
    // A) First activation: checkout.session.completed
    // =========================================================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      const sessionId = session.id;

      if (!userId) {
        console.error("❌ Missing client_reference_id", { sessionId });
        return NextResponse.json({ received: true });
      }

      // Dedupe / log Payment by sessionId (first activation)
      const amount = typeof session.amount_total === "number" ? session.amount_total : null;

      const { error: payErr } = await supabase.from("Payment").insert({
        userId,
        stripeSessionId: sessionId,
        amount,
        creditsGranted: 0,
        source: "checkout.session.completed",
      });

      if (payErr) {
        const msg = String(payErr.message || "").toLowerCase();
        if (msg.includes("duplicate") || msg.includes("unique") || msg.includes("23505")) {
          // already processed
          return NextResponse.json({ received: true, duplicate: true });
        }
        console.error("❌ Payment insert failed", payErr);
        return new NextResponse("DB error", { status: 500 });
      }

      // Update user mapping
      const { error: userErr } = await supabase
        .from("User")
        .update({
          is_pro: true,
          plan: "pro",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          stripe_status: "active",
          cancel_at_period_end: false,
        })
        .eq("id", userId);

      if (userErr) {
        console.error("❌ User update failed (checkout.session.completed)", userErr);
        return new NextResponse("DB error", { status: 500 });
      }
    }

    // =========================================================
    // B) Renewals + credit grant: invoice.payment_succeeded
    // =========================================================
    if (event.type === "invoice.payment_succeeded") {
      const invoice = event.data.object as Stripe.Invoice;

      // Evita prorate/upgrade/downgrade: accredita solo quando è ciclo o creazione.
      // (Se vuoi essere ancora più conservativo: solo subscription_cycle)
      const billingReason = invoice.billing_reason;
      const isCycle =
        billingReason === "subscription_cycle" || billingReason === "subscription_create";

      if (!isCycle) {
        return NextResponse.json({ received: true, ignored: true, reason: billingReason });
      }

      // Deve essere veramente pagato
      if ((invoice.amount_paid ?? 0) <= 0) {
        return NextResponse.json({ received: true, ignored: true, reason: "amount_paid<=0" });
      }

      const subId = (invoice.subscription as string) || null;
      const invoiceId = invoice.id;

      if (!subId) {
        console.warn("⚠️ invoice.payment_succeeded without subscription", { invoiceId });
        return NextResponse.json({ received: true });
      }

      // Trova utente da subscription_id (robusto)
      const { data: userRow, error: findErr } = await supabase
        .from("User")
        .select("id, credits")
        .eq("stripe_subscription_id", subId)
        .maybeSingle();

      if (findErr) {
        console.error("❌ Find user failed (invoice.payment_succeeded)", findErr);
        return new NextResponse("DB error", { status: 500 });
      }

      if (!userRow?.id) {
        console.warn("⚠️ No user found for invoice", { invoiceId, subId });
        return NextResponse.json({ received: true });
      }

      // Determina priceId dalla prima line item subscription
      // (sufficiente per il tuo caso 1 piano / 1 item)
      const firstLine = invoice.lines?.data?.[0];
      const priceId =
        (firstLine?.price?.id as string | undefined) ??
        (firstLine?.plan?.id as string | undefined) ??
        null;

      const { credits: grant, cap } = computeCreditsAndCap(priceId);

      // Idempotenza: inserisci Payment con stripeInvoiceId UNIQUE
      const { error: payErr } = await supabase.from("Payment").insert({
        userId: userRow.id,
        stripeInvoiceId: invoiceId,
        stripeSessionId: null,
        amount: invoice.amount_paid ?? null,
        creditsGranted: grant,
        source: "invoice.payment_succeeded",
      });

      if (payErr) {
        const msg = String(payErr.message || "").toLowerCase();
        if (msg.includes("duplicate") || msg.includes("unique") || msg.includes("23505")) {
          return NextResponse.json({ received: true, duplicate: true });
        }
        console.error("❌ Payment insert failed (invoice)", payErr);
        return new NextResponse("DB error", { status: 500 });
      }

      // Applica rollover con cap
      const currentCredits = Number(userRow.credits ?? 0);
      const newCredits = clamp(currentCredits + grant, 0, cap);

      const { error: updErr } = await supabase
        .from("User")
        .update({
          credits: newCredits,
          is_pro: true,
          plan: "pro",
          stripe_status: "active",
        })
        .eq("id", userRow.id);

      if (updErr) {
        console.error("❌ User credits update failed", updErr);
        return new NextResponse("DB error", { status: 500 });
      }
    }

    // =========================================================
    // C) Subscription updated (UX/status)
    // =========================================================
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const { data: userRow, error: findErr } = await supabase
        .from("User")
        .select("id")
        .eq("stripe_subscription_id", sub.id)
        .maybeSingle();

      if (findErr) {
        console.error("❌ Find user failed (subscription.updated)", findErr);
        return new NextResponse("DB error", { status: 500 });
      }

      if (userRow?.id) {
        const status = sub.status;
        const currentPeriodEnd = sub.current_period_end
          ? new Date(sub.current_period_end * 1000).toISOString()
          : null;

        const isPro = status === "active" || status === "trialing";

        const { error: updErr } = await supabase
          .from("User")
          .update({
            is_pro: isPro,
            plan: isPro ? "pro" : "free",
            stripe_status: status,
            cancel_at_period_end: !!sub.cancel_at_period_end,
            current_period_end: currentPeriodEnd,
          })
          .eq("id", userRow.id);

        if (updErr) {
          console.error("❌ User update failed (subscription.updated)", updErr);
          return new NextResponse("DB error", { status: 500 });
        }
      }
    }

    // =========================================================
    // D) Subscription deleted (final downgrade)
    // =========================================================
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const { data: userRow, error: findErr } = await supabase
        .from("User")
        .select("id")
        .eq("stripe_subscription_id", sub.id)
        .maybeSingle();

      if (findErr) {
        console.error("❌ Find user failed (subscription.deleted)", findErr);
        return new NextResponse("DB error", { status: 500 });
      }

      if (userRow?.id) {
        const { error: updErr } = await supabase
          .from("User")
          .update({
            is_pro: false,
            plan: "free",
            stripe_status: "canceled",
            cancel_at_period_end: false,
            current_period_end: null,
          })
          .eq("id", userRow.id);

        if (updErr) {
          console.error("❌ User downgrade failed (subscription.deleted)", updErr);
          return new NextResponse("DB error", { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
