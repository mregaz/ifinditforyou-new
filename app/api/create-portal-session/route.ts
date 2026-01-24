import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function mustEnvAny(names: string[]): string {
  for (const n of names) {
    const v = process.env[n];
    if (v) return v;
  }
  throw new Error(`Missing one of: ${names.join(", ")}`);
}

export async function POST(req: Request) {
  try {
    const sk = mustEnv("STRIPE_SECRET_KEY");
    const whsec = mustEnv("STRIPE_WEBHOOK_SECRET");
    const supabaseUrl = mustEnvAny(["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]);
    const serviceKey = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      return NextResponse.json({ ok: false, error: "Missing stripe-signature" }, { status: 400 });
    }

    const stripe = new Stripe(sk);

    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);

    const supabase = createClient(supabaseUrl, serviceKey);

    const insertId = `${event.id}::${event.type}`;

    const { error: dbErr } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: insertId });

    if (dbErr) {
      console.error("Supabase insert failed:", dbErr);
      return NextResponse.json(
        { ok: false, where: "supabase-insert", message: dbErr.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, received: event.id, type: event.type });
  } catch (err: any) {
    console.error("Webhook fatal:", err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}
