import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const sk = process.env.STRIPE_SECRET_KEY;
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!sk) throw new Error("Missing STRIPE_SECRET_KEY");
    if (!whsec) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    if (!supabaseUrl) throw new Error("Missing SUPABASE_URL");
    if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

    const stripe = new Stripe(sk);
    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);

    const supabase = createClient(supabaseUrl, serviceKey) as any;

    console.log("WEBHOOK:", event.type, event.id);
    console.log("Stripe prefix:", sk.slice(0, 7));
    console.log("Supabase host:", supabaseUrl.split("/")[2]);
    console.log("Service prefix:", serviceKey.slice(0, 9));

    // Debug insert: deve comparire in Supabase
    const debugId = `DEBUG-${Date.now()}`;
    const { error: dbgErr } = await supabase.from("StripeWebhookEvent").insert({ event_id: debugId });
    if (dbgErr) {
      console.error("DEBUG INSERT FAILED:", dbgErr);
      return NextResponse.json({ error: "debug insert failed", details: dbgErr }, { status: 500 });
    }
    console.log("DEBUG INSERT OK:", debugId);

    // Evento reale: registra id (idempotenza semplice)
    const { data: already } = await supabase
      .from("StripeWebhookEvent")
      .select("event_id")
      .eq("event_id", event.id)
      .maybeSingle();

    if (!already) {
      const { error: insErr } = await supabase.from("StripeWebhookEvent").insert({ event_id: event.id });
      if (insErr) {
        console.error("Event insert failed:", insErr);
        return NextResponse.json({ error: "event insert failed", details: insErr }, { status: 500 });
      }
    }

    // Scrittura entitlements (solo se checkout completed)
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.supabase_user_id;

      if (!userId) {
        console.error("Missing userId in session");
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      const billing = session.metadata?.billing_period;
      const plan = billing === "yearly" ? "pro_yearly" : "pro_monthly";
      const credits = billing === "yearly" ? 1200 : 100;

      const payload = {
        user_id: userId,
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
        console.error("Upsert failed:", upsertErr);
        return NextResponse.json({ error: "upsert failed", details: upsertErr }, { status: 500 });
      }

      console.log("Upsert OK for user:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err?.message ?? err);
    return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}
