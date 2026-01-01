import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing env vars");
    return new NextResponse("Server misconfigured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("❌ Invalid Stripe signature", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id;

      if (!userId) {
        console.error("❌ Missing client_reference_id");
        return NextResponse.json({ received: true });
      }

      const { error } = await supabase
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

      if (error) {
        console.error("❌ Supabase update failed", error);
        return new NextResponse("DB error", { status: 500 });
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.user_id;

      if (userId) {
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
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook handler error", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
