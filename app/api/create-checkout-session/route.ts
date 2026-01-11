import Stripe from "stripe";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("CHECKOUT BODY:", body);

    const { billingPeriod, lang } = body;

    if (!billingPeriod) {
      return NextResponse.json(
        { error: "Missing billingPeriod" },
        { status: 400 }
      );
    }

    const priceId =
      billingPeriod === "yearly"
        ? process.env.STRIPE_PRICE_ID_YEARLY
        : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID env var" },
        { status: 500 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/${lang}/account?checkout=success`,
      cancel_url: `${baseUrl}/${lang}/pro?checkout=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("STRIPE CHECKOUT ERROR:", err);

    return NextResponse.json(
      {
        error: err?.message ?? "Stripe error",
        type: err?.type,
        code: err?.code,
      },
      { status: 500 }
    );
  }
}
