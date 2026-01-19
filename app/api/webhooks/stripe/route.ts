import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ENV
    const sk = process.env.STRIPE_SECRET_KEY;
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!sk) throw new Error("Missing STRIPE_SECRET_KEY");
    if (!whsec) throw new Error("Missing STRIPE_WEBHOOK_SECRET");
    if (!supabaseUrl) throw new Error("Missing SUPABASE_URL");
    if (!serviceKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

    console.log("Stripe key prefix:", sk.slice(0, 7)); // sk_test / sk_live
    console.log("Supabase host:", supabaseUrl.split("/")[2]);
    console.log("Service prefix:", serviceKey.slice(0, 9)); // sb_secret

    // Stripe event (raw body + signature)
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

    const stripe = new Stripe(sk);
    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);

    console.log("WEBHOOK event:", event.type, event.id);

    // Supabase admin client (SERVICE ROLE)
    const supabase = createClient(supabaseUrl, serviceKey) as any;

    // DEBUG INSERT (una sola volta, sempre)
    const debugId = `DEBUG-${Date.now()}`;
    const { error: debugInsertError } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: debugId });

    if (debugInsertError) {
      console.error("DEBUG INSERT FAILED:", debugInsertError);
      return NextResponse.json(
        { error: "debug insert failed", details: debugInsertError },
        { status: 500 }
      );
    }

    console.log("DEBUG INSERT OK:", debugId);

    // (Opzionale) registra il vero event.id per idempotenza semplice
    const { data: already } = await supabase
      .from("StripeWebhookEvent")
      .select("event_id")
      .eq("event_id", event.id)
      .maybeSingle();

    if (!already) {
      const { error: evtErr } = await supabase
        .from("StripeWebhookEvent")
        .insert({ event_id: event.id });

      if (evtErr) {
        console.error("Event insert failed:", evtErr);
        return NextResponse.json({ error: "event insert failed", details: evtErr }, { status: 500 });
      }
    }

    // Entitlements write (solo su checkout completed)
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
    console.log("UPSERT DONE FOR USER:", userId);

    }


    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err?.message ?? err);
    // 400 così Stripe lo mostra come failed e lo vedi subito
    return NextResponse.json({ error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}
