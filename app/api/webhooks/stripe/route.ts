import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function toIsoFromUnix(seconds?: number | null) {
  return seconds ? new Date(seconds * 1000).toISOString() : null;
}

export async function POST(req: Request) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl || !serviceRoleKey || !webhookSecret) {
    // 500 => Stripe ritenta, e tu vedi l'errore nei log Vercel
    return new NextResponse("Missing server env", { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Invalid Stripe signature", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    // checkout.session.completed
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id;
      if (!userId) return NextResponse.json({ received: true });

      const { error } = await supabase
        .from("User")
        .update({
          is_pro: true,
          plan: "pro",
          stripe_customer_id: (session.customer as string) ?? null,
          stripe_subscription_id: (session.subscription as string) ?? null,
          stripe_status: "active",
          cancel_at_period_end: false,
        })
        .eq("id", userId);

      if (error) {
        console.error("❌ Supabase update error:", error);
        return new NextResponse("DB error", { status: 500 });
      }
    }

    // customer.subscription.updated
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const userId = sub.metadata?.user_id;
      if (!userId) return NextResponse.json({ received: true });

      const status = sub.status;
      const isPro = status === "active" || status === "trialing";

      const { error } = await supabase
        .from("User")
        .update({
          is_pro: isPro,
          plan: isPro ? "pro" : "free",
          stripe_status: status,
          cancel_at_period_end: sub.cancel_at_period_end,
          current_period_end: toIsoFromUnix(sub.current_period_end),
        })
        .eq("id", userId);

      if (error) {
        console.error("❌ Supabase update error:", error);
        return new NextResponse("DB error", { status: 500 });
      }
    }

    // customer.subscription.deleted
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const userId = sub.metadata?.user_id;
      if (!userId) return NextResponse.json({ received: true });

      const { error } = await supabase
        .from("User")
        .update({
          is_pro: false,
          plan: "free",
          stripe_status: "canceled",
          cancel_at_period_end: false,
          current_period_end: null,
        })
        .eq("id", userId);

      if (error) {
        console.error("❌ Supabase update error:", error);
        return new NextResponse("DB error", { status: 500 });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
