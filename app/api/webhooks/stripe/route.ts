import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function getStripe() {
  const sk = process.env.STRIPE_SECRET_KEY;
  if (!sk) throw new Error("Missing STRIPE_SECRET_KEY (sk_...)");
  return new Stripe(sk);
}

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("Missing SUPABASE_URL");
  if (!service) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, service);
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe();

    const whsec = process.env.STRIPE_WEBHOOK_SECRET;
    if (!whsec) throw new Error("Missing STRIPE_WEBHOOK_SECRET (whsec_...)");

    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE url host:", url?.split("/")[2]);
console.log("SUPABASE service prefix:", service?.slice(0, 9)); // deve essere "sb_secret"

const supabase = createClient(url!, service!);

// Scrittura forzata: se questa non compare, NON stai scrivendo su Supabase (o stai fallendo)
const debugId = "DEBUG-" + Date.now().toString();

const { error: dbgErr } = await supabase
  .from("StripeWebhookEvent")
  .insert({ event_id: debugId });

if (dbgErr) {
  console.error("DEBUG INSERT FAILED:", dbgErr);
  // IMPORTANTISSIMO: non restituire 200, altrimenti Stripe dice ok ma tu non vedi nulla
  return NextResponse.json({ error: "debug insert failed", details: dbgErr }, { status: 500 });
}

console.log("DEBUG INSERT OK:", debugId);


    const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log("SUPABASE url host:", url?.split("/")[2]);
console.log("SUPABASE service prefix:", service?.slice(0, 9)); // deve essere "sb_secret"

const supabase = createClient(url!, service!);

// Scrittura forzata: se questa non compare, NON stai scrivendo su Supabase (o stai fallendo)
const debugId = "DEBUG-" + Date.now().toString();

const { error: dbgErr } = await supabase
  .from("StripeWebhookEvent")
  .insert({ event_id: debugId });

if (dbgErr) {
  console.error("DEBUG INSERT FAILED:", dbgErr);
  // IMPORTANTISSIMO: non restituire 200, altrimenti Stripe dice ok ma tu non vedi nulla
  return NextResponse.json({ error: "debug insert failed", details: dbgErr }, { status: 500 });
}

console.log("DEBUG INSERT OK:", debugId);


    const supabase = getSupabaseAdmin();

    console.log("stripe webhook:", event.type, event.id);

    // Idempotenza: registra event.id una sola volta
    const { data: already } = await supabase
      .from("StripeWebhookEvent")
      .select("event_id")
      .eq("event_id", event.id)
      .maybeSingle();

    if (already) return NextResponse.json({ received: true, duplicate: true });

    const { error: insErr } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: event.id });

    if (insErr) console.error("StripeWebhookEvent insert error:", insErr);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // user_id arriva dal tuo create-checkout-session
      const userId = session.client_reference_id || session.metadata?.supabase_user_id;
      if (!userId) {
        console.error("Missing userId in session", {
          hasClientRef: !!session.client_reference_id,
          hasMeta: !!session.metadata,
        });
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      // Mapping plan
      const billing = session.metadata?.billing_period;
      const plan = billing === "yearly" ? "pro_yearly" : "pro_monthly";

      // Credits: scegli un valore iniziale (modificabile)
      const credits = billing === "yearly" ? 1200 : 100;

      const payload = {
        user_id: userId, // uuid string
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
        console.error("Supabase upsert error:", upsertErr, payload);
        return NextResponse.json({ error: "Supabase upsert failed" }, { status: 500 });
      }

      console.log("Supabase upsert OK user_entitlements:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("stripe webhook error:", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}
