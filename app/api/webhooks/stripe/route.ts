import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Buffer } from "buffer";

export const runtime = "nodejs";

function mustEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function creditsForPeriod(period: "monthly" | "yearly") {
  // Cambia questi numeri come vuoi (oppure mettili in ENV)
  const monthly = Number(process.env.CREDITS_MONTHLY ?? "100");
  const yearly = Number(process.env.CREDITS_YEARLY ?? "1200");
  return period === "yearly" ? yearly : monthly;
}

export async function POST(req: Request) {
  try {
    // ===== ENV =====
    const sk = mustEnv("STRIPE_SECRET_KEY");
    const whsec = mustEnv("STRIPE_WEBHOOK_SECRET");

    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) throw new Error("Missing SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");

    const serviceKey = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

    // ===== Stripe signature =====
    const sig = req.headers.get("stripe-signature");
    if (!sig) return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });

    const stripe = new Stripe(sk);
    const rawBody = Buffer.from(await req.arrayBuffer());
    const event = stripe.webhooks.constructEvent(rawBody, sig, whsec);

    // ===== Supabase admin client (bypass RLS) =====
    const supabase = createClient(supabaseUrl, serviceKey);

    console.log("[stripe-webhook]", event.type, event.id, "sk:", sk.slice(0, 7));

    // ===== Idempotenza: salva event.id, se già visto => 200 =====
    const exists = await supabase
      .from("StripeWebhookEvent")
      .select("id")
      .eq("event_id", event.id)
      .limit(1);

    if (exists.data && exists.data.length > 0) {
      console.log("[stripe-webhook] duplicate event, skip:", event.id);
      return NextResponse.json({ ok: true, duplicate: true });
    }

    const insEvent = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: event.id });

    if (insEvent.error) {
      // race condition: due invocazioni simultanee
      console.error("[stripe-webhook] event insert error (race tolerated):", insEvent.error);
      return NextResponse.json({ ok: true, note: "event insert raced" });
    }

    // ===== Handler principale =====
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId =
        (session.client_reference_id as string | null) ||
        (session.metadata?.supabase_user_id as string | undefined);

      if (!userId) {
        console.error("[stripe-webhook] missing userId in client_reference_id/metadata");
        return NextResponse.json({ ok: true, warning: "missing userId" });
      }

      const billingPeriod =
        (session.metadata?.billing_period as "monthly" | "yearly" | undefined) ?? "monthly";

      const stripeCustomerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

      const stripeSubscriptionId =
        typeof session.subscription === "string"
          ? session.subscription
          : session.subscription?.id ?? null;

      // Provo a ricavare il price id espandendo line_items (best effort)
      let stripePriceId: string | null = null;
      try {
        const full = await stripe.checkout.sessions.retrieve(session.id, {
          expand: ["line_items.data.price"],
        });
        const li = full.line_items?.data?.[0];
        stripePriceId = (li?.price as any)?.id ?? null;
      } catch {
        // ok, non blocca
      }

      const now = new Date().toISOString();
      const credits = creditsForPeriod(billingPeriod);

      // 1) Update User (UI/state)
      // ⚠️ Adatta updatedAt vs updated_at se serve
      const upUser = await supabase
        .from("User")
        .update({
          is_pro: true,
          plan: billingPeriod,
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubscriptionId,
          stripe_price_id: stripePriceId,
          stripe_status: "active",
          updatedAt: now, // se nel tuo schema è updated_at, cambia in updated_at
        })
        .eq("id", userId);

      if (upUser.error) {
        console.error("[stripe-webhook] update User error:", upUser.error);
      }

      // 2) Upsert entitlements (credito SET, non somma)
      // ⚠️ Adatta updated_at se la colonna è diversa
      const upEnt = await supabase
        .from("entitlements")
        .upsert(
          {
            user_id: userId,
            plan: billingPeriod,
            is_pro: true,
            credits_balance: credits, // ✅ SET
            updated_at: now,
          },
          { onConflict: "user_id" }
        );

      if (upEnt.error) {
        console.error("[stripe-webhook] upsert entitlements error:", upEnt.error);
      }

      // 3) Insert Payment (audit)
      // ⚠️ Adatta i nomi colonne se differiscono (userId vs user_id, createdAt vs created_at, ecc.)
      const amount = typeof session.amount_total === "number" ? session.amount_total : null;

      const insPay = await supabase
        .from("Payment")
        .insert({
          userId: userId,
          stripeSessionId: session.id,
          amount: amount,
          creditsGranted: credits,
          createdAt: now,
          source: "stripe_checkout",
          stripeInvoiceId: typeof session.invoice === "string" ? session.invoice : null,
        });

      if (insPay.error) {
        console.error("[stripe-webhook] insert Payment error:", insPay.error);
      }

      console.log("[stripe-webhook] OK checkout.session.completed", { userId, billingPeriod, credits });

      return NextResponse.json({ ok: true });
    }

    // Eventi non gestiti: 200 comunque
    return NextResponse.json({ ok: true, ignored: event.type });
  } catch (err: any) {
    console.error("[stripe-webhook] FATAL:", err?.message ?? err);
    return NextResponse.json({ ok: false, error: err?.message ?? "Webhook error" }, { status: 400 });
  }
}
