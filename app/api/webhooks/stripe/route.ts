// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT");

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Invalid signature", err.message);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("Stripe event:", event.type);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.client_reference_id;
    if (!userId) {
      console.error("❌ Missing client_reference_id");
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase
      .from("User")
      .update({
        is_pro: true,
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        stripe_status: "active",
      })
      .eq("id", userId);

    if (error) {
      console.error("❌ Supabase update error", error);
    } else {
      console.log("✅ User upgraded to PRO:", userId);
    }
  }

  return NextResponse.json({ received: true });
}
