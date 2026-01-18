import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function env(name: string): string | undefined {
  return process.env[name];
}

function getStripe() {
  const sk = env("STRIPE_SECRET_KEY");
  if (!sk) throw new Error("Missing STRIPE_SECRET_KEY (sk_...)");
  // Non forzo apiVersion: evita errori di typings
  return new Stripe(sk);
}

function getSupabaseAdmin() {
  const url = env("SUPABASE_URL") || env("NEXT_PUBLIC_SUPABASE_URL");
  const service = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url) throw new Error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  if (!service) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return { supabase: createClient(url, service), url, service };
}

async function insertWebhookEvent(supabase: ReturnType<typeof createClient>, eventId: string) {
  // tabella: StripeWebhookEvent (case sensitive se creata con quotes)
  // se dovesse fallire per nome tabella, lo vedrai nei log e lo sistemiamo subito.
  return await supabase.from("StripeWebhookEvent").insert({ event_id: eventId });
}

async function isDuplicateEvent(supabase: ReturnType<typeof createClient>, eventId: string) {
  const { data, error } = await supabase
    .from("StripeWebhookEvent")
    .select("event_id")
    .eq("event_id", eventId)
    .maybeSingle();

  if (error) {
    console.error("StripeWebhookEvent select error:", error);
    // non blocco: ma segnalo
  }
  return !!data;
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();
    const whsec = env("STRIPE_WEBHOOK_SECRET");
    if (!whsec) throw new Error("Missing STRIPE_WEBHOOK_SECRET (whsec_...)");

    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);

    const { supabase, url, service } = getSupabaseAdmin();

    // LOG DIAGNOSTICI (non stampano segreti)
    console.log("WEBHOOK received:", event.type, event.id);
    console.log("Stripe SK prefix:", env("STRIPE_SECRET_KEY")?.slice(0, 7)); // sk_test / sk_live
    console.log("Supabase host:", url.split("/")[2]);
    console.log("Supabase service prefix:", service.slice(0, 9)); // deve essere sb_secret

    // DEBUG INSERT: deve creare SEMPRE una riga visibile
    const debugId = `DEBUG-${Date.now()}`;
    const { error: dbgErr } = await supabase.from("StripeWebhookEvent").insert({ event_id: debugId });
    if (dbgErr) {
      console.error("DEBUG INSERT FAILED (StripeWebhookEvent):", dbgErr);
      return NextResponse.json(
        { error: "debug insert failed", details: dbgErr },
        { status: 500 }
      );
    }
    console.log("DEBUG INSERT OK:", debugId);

    // Idempotenza sul vero event.id
    const duplicate = await isDuplicateEvent(supabase, event.id);
    if (duplicate) {
      console.log("Duplicate event:", event.id);
      return NextResponse.json({ received: true, duplicate: true });
    }

    const { error: insErr } = await insertWebhookEvent(supabase, event.id);
    if (insErr) {
      console.error("StripeWebhookEvent insert error:", insErr);
      return NextResponse.json({ error: "failed to record event", details: insErr }, { status: 500 });
    }

    // Gestione evento principale
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id || session.metadata?.supabase_user_id;
      if (!userId) {
        console.error("Missing userId in session:", {
          hasClientRef: !!session.client_reference_id,
          hasMeta: !!session.metadata,
        });
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      const billing = session.metadata?.billing_period;
      const plan = billing === "yearly" ? "pro_yearly" : "pro_monthly";
      const credits = billing === "yearly" ? 1200 : 100;

      const payload = {
        user_id: userId, // uuid
        is_pro: true,
        plan,
        credits,
        stripe_customer_id: session.customer?.toString() ?? null,
        updated_at: new Date().toISOString(),
      };

      const { error: upsertErr } = await supabase
        .from("user_entitlements")
        .upsert(payload, { onConflict: "user_id" });

      if (upsertErr) {
        console.error("user_entitlements upsert error:", upsertErr, payload);
        return NextResponse.json(
          { error: "upsert failed", details: upsertErr },
          { status: 500 }
        );
      }

      console.log("user_entitlements upsert OK for:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("stripe webhook fatal error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}
