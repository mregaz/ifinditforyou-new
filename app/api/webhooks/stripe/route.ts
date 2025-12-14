// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  // 1) Leggi env SOLO qui dentro (evita crash in build)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl) {
    console.error("Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
    return new NextResponse("Server misconfigured: missing SUPABASE_URL", { status: 500 });
  }
  if (!serviceRoleKey) {
    console.error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
    return new NextResponse("Server misconfigured: missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
  }
  if (!webhookSecret) {
    console.error("Missing env: STRIPE_WEBHOOK_SECRET");
    return new NextResponse("Server misconfigured: missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  // 2) Supabase admin client (SERVICE ROLE)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // 3) Firma Stripe
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err?.message || err);
    return new NextResponse(`Webhook Error: ${err?.message ?? "Invalid signature"}`, { status: 400 });
  }

  try {
    switch (event.type) {
      // 1) UTENTE DIVENTA PRO
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ??
          session.customer_email ??
          null;

        if (!email) {
          console.error("❌ checkout.session.completed without email");
          break;
        }

        const { error } = await supabase
          .from("User")
          .update({ is_pro: true })
          .eq("email", email);

        if (error) console.error("❌ Supabase update is_pro=true error:", error);
        break;
      }

      // 2) ABBONAMENTO CANCELLATO
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const customerId = subscription.customer;
        if (!customerId) {
          console.warn("⚠️ subscription.deleted without customer id");
          break;
        }

        const customer = await stripe.customers.retrieve(customerId as string);

        const email =
          (customer as any)?.email ??
          (customer as any)?.metadata?.email ??
          null;

        if (!email) {
          console.warn("⚠️ could not resolve email for subscription.deleted");
          break;
        }

        const { error } = await supabase
          .from("User")
          .update({ is_pro: false })
          .eq("email", email);

        if (error) console.error("❌ Supabase update is_pro=false error:", error);
        break;
      }

      default:
        console.log("ℹ️ Ignored Stripe event:", event.type);
    }
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    // non falliamo il webhook per evitare retry infiniti
  }

  return NextResponse.json({ received: true });
}

