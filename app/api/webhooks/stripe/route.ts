// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---------- Supabase admin client (bypass RLS) ----------
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseServiceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { persistSession: false },
});

// ---------- Helpers ----------
function toIsoFromUnixSeconds(sec: number | null | undefined) {
  if (!sec || typeof sec !== "number") return null;
  return new Date(sec * 1000).toISOString();
}

function isProFromStripeStatus(status: Stripe.Subscription.Status) {
  // STANDARD: PRO true solo se active o trialing
  return status === "active" || status === "trialing";
}

async function safeInsertPayment(payload: {
  userId: string;
  stripeSessionId: string;
  amount?: number | null;
  creditsGranted?: number | null;
}) {
  // Inserimento "best effort": se la tabella/colonne non matchano, non blocchiamo il webhook.
  try {
    const { error } = await supabase.from("Payment").insert({
      userId: payload.userId,
      stripeSessionId: payload.stripeSessionId,
      amount: payload.amount ?? null,
      creditsGranted: payload.creditsGranted ?? 0,
      createdAt: new Date().toISOString(),
    });
    if (error) {
      // niente log dettagliato (potrebbe includere schema info), ma utile per debug leggero
      console.warn("Payment insert skipped");
    }
  } catch {
    // ignore
  }
}

// ---------- Handler ----------
export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    // -------------------------
    // 1) Checkout completed
    // -------------------------
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      // user id: prefer client_reference_id (messo da create-checkout-session)
      const userId = session.client_reference_id ?? undefined;
      if (!userId) return NextResponse.json({ received: true });

      const customerId =
        typeof session.customer === "string" ? session.customer : null;
      const subscriptionId =
        typeof session.subscription === "string" ? session.subscription : null;

      // Se abbiamo subscriptionId, prendiamo lo stato reale + cancel_at_period_end + current_period_end
      let stripeStatus: Stripe.Subscription.Status | null = null;
      let cancelAtPeriodEnd: boolean | null = null;
      let currentPeriodEndIso: string | null = null;

      if (subscriptionId) {
        const sub = await stripe.subscriptions.retrieve(subscriptionId);

        stripeStatus = sub.status;
        cancelAtPeriodEnd = !!sub.cancel_at_period_end;

        // TS può non tipizzare current_period_end in alcune combinazioni: runtime c’è.
        const cpe = (sub as any).current_period_end as number | undefined;
        currentPeriodEndIso = toIsoFromUnixSeconds(cpe);

        // Con metadata definitivi, qui avrai anche sub.metadata.user_id.
        // Ma non lo usiamo per decidere userId (già robusto via client_reference_id).
      }

      const isPro = stripeStatus ? isProFromStripeStatus(stripeStatus) : true;

      const { error } = await supabase
        .from("User")
        .upsert(
          {
            id: userId,
            is_pro: isPro,
            plan: isPro ? "pro" : "free",
            stripe_customer_id: customerId,
            stripe_subscription_id: subscriptionId,
            stripe_status: stripeStatus ?? "active",
            cancel_at_period_end: cancelAtPeriodEnd ?? false,
            current_period_end: currentPeriodEndIso,
          },
          { onConflict: "id" }
        );

      if (!error && session.id) {
        const amount = typeof session.amount_total === "number" ? session.amount_total : null;
        await safeInsertPayment({
          userId,
          stripeSessionId: session.id,
          amount,
          creditsGranted: 0,
        });
      }

      return NextResponse.json({ received: true });
    }

    // -------------------------
    // 2) Subscription lifecycle
    // -------------------------
    if (
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      const sub = event.data.object as Stripe.Subscription;

      const status = sub.status;
      const cancelAtPeriodEnd = !!sub.cancel_at_period_end;

      const cpe = (sub as any).current_period_end as number | undefined;
      const currentPeriodEndIso = toIsoFromUnixSeconds(cpe);

      const isPro = isProFromStripeStatus(status);

      // Definitivo: user_id viene da metadata (messo in create-checkout-session)
      const userId = sub.metadata?.user_id;
      if (!userId) return NextResponse.json({ received: true });

      const { error } = await supabase
        .from("User")
        .update({
          is_pro: isPro,
          plan: isPro ? "pro" : "free",
          stripe_status: status,
          cancel_at_period_end: cancelAtPeriodEnd,
          current_period_end: currentPeriodEndIso,
          stripe_subscription_id: sub.id,
          stripe_customer_id: typeof sub.customer === "string" ? sub.customer : null,
        })
        .eq("id", userId);

      if (error) {
        // log minimale, niente dettagli
        console.warn("Supabase update failed for subscription lifecycle");
      }

      return NextResponse.json({ received: true });
    }

    // altri eventi: ack
    return NextResponse.json({ received: true });
  } catch {
    // Importante: Stripe vuole 2xx per non ritentare in loop. Qui puoi scegliere 500 se preferisci.
    return NextResponse.json({ received: true });
  }
}
