import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!webhookSecret || !supabaseUrl || !serviceRoleKey) {
    console.error("Missing env vars", {
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
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("Invalid Stripe signature", { message: err?.message });
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // ✅ Admin client (service role) per bypass RLS lato server
  const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

  // ✅ Idempotenza: salva event_id una sola volta
  // Tabella: StripeWebhookEvent (id int8, event_id text, created_at timestamptz)
  try {
    const { error: insertErr } = await supabaseAdmin
      .from("StripeWebhookEvent")
      .insert({ event_id: event.id });

    // Se event_id già presente, non rifare nulla
    if (insertErr) {
      const msg = String(insertErr.message || "").toLowerCase();
      if (msg.includes("duplicate") || msg.includes("unique")) {
        return NextResponse.json({ received: true, duplicate: true });
      }
      // Se la tabella non ha vincolo unique su event_id, aggiungilo (consigliato),
      // ma intanto non blocchiamo: continuiamo.
      console.warn("StripeWebhookEvent insert warn:", insertErr);
    }
  } catch (e) {
    console.warn("StripeWebhookEvent insert exception:", e);
  }

  try {
    // 1) checkout.session.completed -> attiva PRO sull'utente
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // noi usiamo client_reference_id = user.id
      const userId = session.client_reference_id;

      if (!userId) {
        console.error("Missing client_reference_id", { sessionId: session.id });
        return NextResponse.json({ received: true });
      }

      const stripeCustomerId = (session.customer as string) || null;
      const stripeSubscriptionId = (session.subscription as string) || null;

      const { error } = await supabaseAdmin
        .from("User")
        .update({
          is_pro: true,
          plan: "pro",
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          stripe_status: "active",
          cancel_at_period_end: false,
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update failed (checkout.session.completed)", error);
        return new NextResponse("DB error", { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    // 2) customer.subscription.updated -> aggiorna status/cancel_at_period_end/period_end
    if (event.type === "customer.subscription.updated") {
      const sub = event.data.object as Stripe.Subscription;

      const userId =
        (sub.metadata?.user_id as string | undefined) ??
        null;

      // se non hai metadata user_id, puoi fare lookup da stripe_subscription_id
      if (!userId) {
        const { error } = await supabaseAdmin
          .from("User")
          .update({
            stripe_status: sub.status,
            cancel_at_period_end: sub.cancel_at_period_end,
            current_period_end: sub.current_period_end
              ? new Date(sub.current_period_end * 1000).toISOString()
              : null,
          })
          .eq("stripe_subscription_id", sub.id);

        if (error) console.warn("Sub update by sub.id failed:", error);
        return NextResponse.json({ received: true });
      }

      const { error } = await supabaseAdmin
        .from("User")
        .update({
          stripe_status: sub.status,
          cancel_at_period_end: sub.cancel_at_period_end,
          current_period_end: sub.current_period_end
            ? new Date(sub.current_period_end * 1000).toISOString()
            : null,
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update failed (customer.subscription.updated)", error);
        return new NextResponse("DB error", { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    // 3) customer.subscription.deleted -> disattiva PRO
    if (event.type === "customer.subscription.deleted") {
      const sub = event.data.object as Stripe.Subscription;

      const userId =
        (sub.metadata?.user_id as string | undefined) ??
        null;

      if (!userId) {
        // fallback: trova user per subscription_id
        const { error } = await supabaseAdmin
          .from("User")
          .update({
            is_pro: false,
            plan: "free",
            stripe_status: "canceled",
            cancel_at_period_end: false,
            current_period_end: null,
          })
          .eq("stripe_subscription_id", sub.id);

        if (error) console.warn("Sub delete update by sub.id failed:", error);
        return NextResponse.json({ received: true });
      }

      const { error } = await supabaseAdmin
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
        console.error("Supabase update failed (customer.subscription.deleted)", error);
        return new NextResponse("DB error", { status: 500 });
      }

      return NextResponse.json({ received: true });
    }

    // Event non gestiti: OK
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook handler error", err);
    return new NextResponse("Webhook error", { status: 500 });
  }
}
