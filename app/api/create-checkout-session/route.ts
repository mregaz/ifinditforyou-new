// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// usa la tua env con la S finale e senza apiVersion
const stripe = new Stripe(process.env.STRIPE_SECRET_KEYS as string);

const MONTHLY_PRICE_ID = process.env.STRIPE_PRICE_MONTHLY!;
const YEARLY_PRICE_ID = process.env.STRIPE_PRICE_YEARLY!;


export async function POST(req: NextRequest) {
  try {
    const { billingPeriod = "monthly" } = await req.json();
    const price =
      billingPeriod === "yearly" ? YEARLY_PRICE_ID : MONTHLY_PRICE_ID;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return new NextResponse("Errore creazione sessione Stripe", { status: 500 });
  }
}

