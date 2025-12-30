import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// Supabase admin client (bypassa RLS)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  console.log("🔥 WEBHOOK HIT - PROD");
  console.log("env check", {
    hasStripeWhsec: !!process.env.STRIPE_WEBHOOK_SECRET,
    hasSupabaseUrl: !!process.env.SUPABASE_URL,
    hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });

  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Invalid signature:", err?.message || err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  console.log("Stripe event:", event.type);

  // Rispondiamo sempre 200 a Stripe, ma logghiamo tutto.
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id; // deve essere auth user.id
      const sessionId = session.id;
      const mode = session.mode;
      const paymentStatus = (session as any).payment_status;
      const customerId = session.customer as string | null;
      const subscriptionId = session.subscription as string | null;
      const amountTotal = session.amount_total ?? 0;
      const currency = session.currency ?? "unknown";

      console.log("checkout.session.completed payload", {
        sessionId,
        mode,
        paymentStatus,
        userId,
        customerId,
        subscriptionId,
        amountTotal,
        currency,
      });

      if (!userId) {
        console.error("❌ Missing client_reference_id. FIX create-checkout-session!");
        return NextResponse.json({ received: true });
      }

      // 1) Provo UPDATE: dovrebbe colpire 1 riga se la riga User esiste
      const { data: updated, error: updErr } = await supabase
        .from("User")
        .update({
          is_pro: true,
          plan: "pro",
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          stripe_status: "active",
        })
        .eq("id", userId)
        .select("id, is_pro, plan, stripe_status");

      if (updErr) {
        console.error("❌ Supabase UPDATE error:", updErr);
      } else if (!updated || updated.length === 0) {
        console.warn("⚠️ UPDATE matched 0 rows. Fallback to UPSERT.", { userId });

        // 2) Fallback: UPSERT (se per qualche motivo la riga non esiste ancora)
        const { data: upserted, error: upsErr } = await supabase
          .from("User")
          .upsert(
            {
              id: userId,
              is_pro: true,
              plan: "pro",
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              stripe_status: "active",
            },
            { onConflict: "id" }
          )
          .select("id, is_pro, plan, stripe_status");

        if (upsErr) {
          console.error("❌ Supabase UPSERT error:", upsErr);
        } else {
          console.log("✅ User upserted to PRO:", upserted?.[0]);
        }
      } else {
        console.log("✅ User upgraded to PRO:", updated[0]);
      }

      // 3) (Opzionale) Inserisci Payment per audit (se tabella/colonne esistono)
      // Se ti dà errore colonne, lo lasciamo e lo sistemiamo dopo.
      const { error: payErr } = await supabase.from("Payment").insert({
        userId,
        stripeSessionId: sessionId,
        amount: amountTotal, // centesimi
        creditsGranted: 0,
        createdAt: new Date().toISOString(),
      });

      if (payErr) {
        console.warn("⚠️ Payment insert skipped/failed:", payErr?.message || payErr);
      } else {
        console.log("✅ Payment row inserted:", sessionId);
      }
    }
  } catch (e: any) {
    console.error("❌ Webhook handler unexpected error:", e?.message || e);
    // non rilanciamo: rispondiamo comunque 200 a Stripe
  }

  return NextResponse.json({ received: true });
}
