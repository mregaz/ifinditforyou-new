import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT");

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err?.message || err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("Stripe event type:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id; // DEVE essere auth user.id
    const customerId = session.customer as string | null;
    const subscriptionId = session.subscription as string | null;
    const stripeSessionId = session.id;

    if (!userId) {
      console.error("❌ Missing client_reference_id (userId). Controlla create-checkout-session.");
      return NextResponse.json({ received: true });
    }

    console.log("🔎 webhook userId:", userId);

    // 1) aggiorna User => PRO
    const { data: updatedUser, error: userErr } = await supabase
      .from("User")
      .update({
        is_pro: true,
        plan: "pro",
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        stripe_status: "active",
      })
      .eq("id", userId)
      .select("id, is_pro, plan, stripe_status");

    if (userErr) {
      console.error("❌ Supabase User update error:", userErr);
    } else if (!updatedUser || updatedUser.length === 0) {
      console.warn("⚠️ User update: 0 rows updated. userId not found in User table:", userId);
    } else {
      console.log("✅ User updated:", updatedUser[0]);
    }

    // 2) inserisci Payment (se vuoi tracciare pagamenti)
    // amount_total è in centesimi; qui lo salvo come int (cents)
    const amount = session.amount_total ?? 0;

    const { error: payErr } = await supabase.from("Payment").insert({
      userId,
      stripeSessionId,
      amount,
      creditsGranted: 0,
      createdAt: new Date().toISOString(),
    });

    if (payErr) {
      console.error("❌ Supabase Payment insert error:", payErr);
    } else {
      console.log("✅ Payment inserted:", stripeSessionId);
    }
  }

  return NextResponse.json({ received: true });
}
