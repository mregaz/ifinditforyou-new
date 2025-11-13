import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEYS;
  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEYS environment variable");
  }
  return new Stripe(secretKey);
}

const MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_MONTHLY;
const YEARLY_PRICE_ID = process.env.STRIPE_PRICE_YEARLY;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const billingPeriod =
      body.billingPeriod === "yearly" ? "yearly" : "monthly";

    const priceId =
      billingPeriod === "yearly" ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID;

    if (!priceId) {
      return new NextResponse("Stripe price ID missing", { status: 500 });
    }

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Errore create-checkout-session:", err);
    return new NextResponse("Errore creazione sessione Stripe", { status: 500 });
  }
}
