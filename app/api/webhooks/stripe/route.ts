import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// helper: env obbligatoria
function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

export async function POST(req: Request) {
  try {
   return new Response("WEBHOOK_VERSION_DEBUG_2026-01-24", { status: 200 });

    // ===== ENV (Supabase prima, per poter debuggare) =====
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw new Error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
    const serviceKey = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

    // ===== Supabase admin client (ORA esiste) =====
    const supabase = createClient(supabaseUrl, serviceKey);

    // ===== DEBUG INSERT (prima di Stripe) =====
    const unique = `DEBUG-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const { error: dbgErr } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: unique });

    if (dbgErr) {
      console.error("DEBUG INSERT FAIL:", dbgErr);
      return NextResponse.json(
        { ok: false, where: "debug-insert", message: dbgErr.message, details: dbgErr },
        { status: 500 }
      );
    }

    // Se vuoi solo test Supabase, fermati qui:
    return NextResponse.json(
      { ok: true, inserted: unique, note: "Supabase write OK (debug mode)" },
      { status: 200 }
    );

    // ====== (STEP SUCCESSIVO) Stripe webhook vero ======
    // Quando il debug è OK, togli il return sopra e sblocca qui sotto.

    // const sk = mustEnv("STRIPE_SECRET_KEY");
    // const whsec = mustEnv("STRIPE_WEBHOOK_SECRET");
    //
    // const sig = req.headers.get("stripe-signature");
    // if (!sig) return NextResponse.json({ ok: false, error: "Missing stripe-signature" }, { status: 400 });
    //
    // const stripe = new Stripe(sk, { apiVersion: "2024-06-20" });
    // const rawBody = Buffer.from(await req.arrayBuffer());
    // const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);
    //
    // // qui: gestisci event.type e scrivi su entitlements/user_entitlements ecc.
    // return NextResponse.json({ ok: true, stripeEvent: event.id, type: event.type });
  } catch (err: any) {
    console.error("WEBHOOK ERROR:", err);
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Webhook error" },
      { status: 500 }
    );
  }
}
