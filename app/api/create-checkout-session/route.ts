// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const priceMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
const priceYearly = process.env.STRIPE_PRICE_ID_YEARLY;
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY mancante nelle env");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const plan = body.plan === "yearly" ? "yearly" : "monthly";

    const priceId =
      plan === "yearly" ? priceYearly : priceMonthly;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID mancante (mensile/annuale)" },
        { status: 500 }
      );
    }

    const origin =
      appUrl || req.headers.get("origin") || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pro`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe non ha restituito una URL di checkout" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Errore create-checkout-session:", err);
    return NextResponse.json(
      {
        error:
          err?.message ??
          "Errore interno nella creazione della sessione di pagamento",
      },
      { status: 500 }
    );
  }
}


