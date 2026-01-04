import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type BillingPeriod = "monthly" | "yearly";

function getBaseUrl() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (appUrl) return appUrl.replace(/\/+$/, "");

  // Preview/Deploy Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`.replace(/\/+$/, "");
  }

  // Local
  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    // 0) Env guard (non permettere LIVE su Preview)
    const vercelEnv = process.env.VERCEL_ENV; // "production" | "preview" | "development"
    const secretKey = process.env.STRIPE_SECRET_KEY || "";
    const secretPrefix = secretKey.slice(0, 7);

    // Log minimale (utile per debug)
    console.log("CHECKOUT_ENV", {
      vercelEnv,
      vercelUrl: process.env.VERCEL_URL,
      secretPrefix,
      monthlyPricePrefix: process.env.STRIPE_PRICE_ID_MONTHLY?.slice(0, 10),
      yearlyPricePrefix: process.env.STRIPE_PRICE_ID_YEARLY?.slice(0, 10),
    });

    if (vercelEnv === "preview" && secretPrefix === "sk_live_") {
      console.error("BLOCKED: Preview is using LIVE Stripe key (sk_live_)");
      return NextResponse.json(
        { error: "Preview misconfigured: LIVE Stripe key detected" },
        { status: 500 }
      );
    }

    // 1) Auth user (collega Stripe ↔ Supabase User.id)
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) Body (opzionale)
    const body = await req.json().catch(() => ({}));
    const billingPeriod = (body?.billingPeriod as BillingPeriod | undefined) ?? "monthly";
    const locale = String(body?.lang ?? "it").toLowerCase();

    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json({ error: "Invalid billingPeriod" }, { status: 400 });
    }

    // 3) PriceId
    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY;
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY;
    const priceId = billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      console.error("Missing Stripe priceId", {
        billingPeriod,
        hasMonthly: !!monthlyPriceId,
        hasYearly: !!yearlyPriceId,
      });
      return NextResponse.json({ error: "Missing Stripe priceId" }, { status: 500 });
    }

    // 4) Redirect URLs
    const baseUrl = getBaseUrl();
    const successUrl = `${baseUrl}/${locale}/pay/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/${locale}/pay/cancel`;

    // 5) Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      client_reference_id: user.id,
      subscription_data: { metadata: { user_id: user.id } },
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
