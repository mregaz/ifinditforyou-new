import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET() {
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: "Pacchetto 10 crediti iFindItForYou",
          },
          unit_amount: 500, // 5.00 €
        },
        quantity: 1,
      },
    ],
    success_url: "https://ifinditforyou.com?pay=ok",
    cancel_url: "https://ifinditforyou.com?pay=ko",
  });

  return NextResponse.redirect(session.url!, 303);
}

