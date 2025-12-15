import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { stripe } from "@/lib/stripe";

function toIsoOrNull(unixSeconds?: number | null) {
  if (!unixSeconds || typeof unixSeconds !== "number") return null;
  return new Date(unixSeconds * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl) return new NextResponse("Missing SUPABASE_URL", { status: 500 });
  if (!serviceRoleKey) return new NextResponse("Missing SUPABASE_SERVICE_ROLE_KEY", { status: 500 });
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Stripe signature verification failed:", err?.message || err);
    return new NextResponse(`Webhook Error: ${err?.message ?? "Invalid signature"}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId =
          (typeof session.client_reference_id === "string" && session.client_reference_id) ||
          (session.metadata?.user_id ?? null);

        if (!userId) {
          console.warn("checkout.session.completed without userId (client_reference_id/metadata.user_id)");
          break;
        }

        const customerId = typeof session.customer === "string" ? session.customer : null;
        const subscriptionId = typeof session.subscription === "string" ? session.subscription : null;

        // Aggiorniamo almeno is_pro e stripe_customer_id.
        const { error } = await supabase
          .from("User")
          .update({
            is_pro: true,
            stripe_customer_id: customerId ?? undefined,
            stripe_subscription_id: subscriptionId ?? undefined,
            stripe_status: "active",
          })
          .eq("id", userId);

        if (error) console.error("Supabase update on checkout.session.completed error:", error);
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId = typeof sub.customer === "string" ? sub.customer : null;
        if (!customerId) {
          console.warn("subscription event without customer id");
          break;
        }

        // Recuperiamo l'user dalla tabella "User" tramite stripe_customer_id
        const { data: userRow, error: userErr } = await supabase
          .from("User")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (userErr || !userRow?.id) {
          console.warn("Could not resolve user for stripe_customer_id", { customerId, userErr });
          break;
        }

        const status = sub.status; // active, trialing, past_due, canceled, unpaid, incomplete...
        const isPro = status === "active" || status === "trialing";

        const currentPeriodEndIso = toIsoOrNull((sub as any).current_period_end);
        const cancelAtPeriodEnd = !!sub.cancel_at_period_end;

        const firstItem = sub.items?.data?.[0];
        const priceId = firstItem?.price?.id ?? null;

        const { error: updateErr } = await supabase
          .from("User")
          .update({
            is_pro: isPro,
            stripe_subscription_id: sub.id,
            stripe_status: status,
            stripe_current_period_end: currentPeriodEndIso,
            cancel_at_period_end: cancelAtPeriodEnd,
            stripe_price_id: priceId ?? undefined,
          })
          .eq("id", userRow.id);

        if (updateErr) console.error("Supabase update from subscription event error:", updateErr);
        break;
      }

      default:
        // ignoriamo il resto
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
    // rispondiamo 200 per evitare retry infiniti se hai un errore temporaneo lato DB
  }

  return NextResponse.json({ received: true });
}

