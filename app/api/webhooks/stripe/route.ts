import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/* ========= ENV CHECK (fail fast) ========= */
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL");
if (!serviceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

/* ========= Supabase Admin (bypass RLS) ========= */
const supabase = createClient(supabaseUrl, serviceRoleKey);

/* ========= Helpers ========= */
function toIsoFromUnix(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

/* ========= WEBHOOK ========= */
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  /* ============================
     checkout.session.completed
     ============================ */
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id;
    if (!userId) {
      return NextResponse.json({ received: true });
    }

    await supabase
      .from("User")
      .update({
        is_pro: true,
        plan: "pro",
        stripe_customer_id: session.customer as string | null,
        stripe_subscription_id: session.subscription as string | null,
        stripe_status: "active",
        cancel_at_period_end: false,
      })
      .eq("id", userId);
  }

  /* ============================
     customer.subscription.updated
     ============================ */
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;

    const userId = sub.metadata?.user_id;
    if (!userId) {
      return NextResponse.json({ received: true });
    }

    const status = sub.status;
    const isPro = status === "active" || status === "trialing";

    await supabase
      .from("User")
      .update({
        is_pro: isPro,
        plan: isPro ? "pro" : "free",
        stripe_status: status,
        cancel_at_period_end: sub.cancel_at_period_end,
        current_period_end: toIsoFromUnix(sub.current_period_end),
      })
      .eq("id", userId);
  }

  /* ============================
     customer.subscription.deleted
     ============================ */
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;

    const userId = sub.metadata?.user_id;
    if (!userId) {
      return NextResponse.json({ received: true });
    }

    await supabase
      .from("User")
      .update({
        is_pro: false,
        plan: "free",
        stripe_status: "canceled",
        cancel_at_period_end: false,
        current_period_end: null,
      })
      .eq("id", userId);
  }

  return NextResponse.json({ received: true });
}
