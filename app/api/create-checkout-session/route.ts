import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BillingPeriod = "monthly" | "yearly";

export async function POST(req: Request) {
  try {
    // 1) Auth user (fondamentale per collegare Stripe ↔ Supabase User.id)
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Body
    const body = await req.json().catch(() => ({}));
    const billingPeriod = body?.billingPeriod as BillingPeriod | undefined;
    const langRaw = body?.lang ?? "it";
    const locale = String(langRaw || "it").toLowerCase();

    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json({ error: "Invalid billingPeriod" }, { status: 400 });
    }

    // 3) PriceId
    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY;
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY;
    const priceId = billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      console.error("Missing Stripe price ID", {
        billingPeriod,
        hasMonthly: !!monthlyPriceId,
        hasYearly: !!yearlyPriceId,
      });
      return NextResponse.json({ error: "Missing Stripe priceId" }, { status: 500 });
    }

    // 4) App URL + redirect URL (NO variabili non definite)
    const appUrl =
  (process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"))
    .trim()
    .replace(/\/+$/, "");
console.log("create-checkout-session env", {
  appUrl,
  vercelUrl: process.env.VERCEL_URL,
  hasNextPublicAppUrl: !!process.env.NEXT_PUBLIC_APP_URL,
  stripeKeyMode: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ? "test" : "live",
});


    // Se vuoi forzare solo lingue supportate, fallo dopo. Qui minimal.
    const successUrl = `${appUrl}/${locale}/pay/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/${locale}/pay/cancel`;
console.log("ENV CHECK create-checkout-session", {
  vercelEnv: process.env.VERCEL_ENV,
  vercelUrl: process.env.VERCEL_URL,
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  stripeKeyPrefix: process.env.STRIPE_SECRET_KEY?.slice(0, 7),
  priceMonthly: process.env.STRIPE_PRICE_ID_MONTHLY?.slice(0, 10),
});

    // 5) Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      // collegamento robusto per webhook:
      client_reference_id: user.id,
      subscription_data: {
        metadata: { user_id: user.id },
      },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
