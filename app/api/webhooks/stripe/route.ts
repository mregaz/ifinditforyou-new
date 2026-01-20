import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // ===== ENV =====
    const sk = process.env.STRIPE_SECRET_KEY;
    const whsec = process.env.STRIPE_WEBHOOK_SECRET;

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!sk) return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    if (!whsec) return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
    if (!supabaseUrl) return NextResponse.json({ error: "Missing SUPABASE_URL" }, { status: 500 });
    if (!serviceKey) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });

    // ===== Stripe signature =====
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

    const stripe = new Stripe(sk);
    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);

    // ===== Supabase admin client =====
    const supabase = createClient(supabaseUrl, serviceKey) as any;

    // ===== Logs (non segreti) =====
    console.log("WEBHOOK VERSION: 2026-01-20-FORCE");
    console.log("Event:", event.type, event.id);
    console.log("Stripe prefix:", sk.slice(0, 7)); // sk_test / sk_live
    console.log("Supabase host:", supabaseUrl.split("/")[2]);
    console.log("Service prefix:", serviceKey.slice(0, 9)); // sb_secret

    // ===== FORCE INSERT (deve creare SEMPRE una nuova riga) =====
    const unique = `FORCE-${Date.now()}-${Math.random()}`;

    const { data, error } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: unique })
      .select();

    if (error) {
      console.error("FORCE INSERT ERROR:", error);
      return NextResponse.json(
        { ok: false, where: "force-insert", error },
        { status: 500 }
      );
    }

    console.log("FORCE INSERT OK:", unique);
    return NextResponse.json({ ok: true, inserted: unique, data });
  } catch (err: any) {
    console.error("WEBHOOK FATAL:", err?.message ?? err);
    // 400 così Stripe lo marca come failed e lo vedi chiaramente
    return NextResponse.json({ ok: false, error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}

