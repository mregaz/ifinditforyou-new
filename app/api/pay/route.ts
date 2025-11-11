// app/api/pay/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function GET() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "10 crediti AI",
            },
            unit_amount: 500, // 5,00 €
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.APP_URL ?? "http://localhost:3000"}/pay/success`,
      cancel_url: `${process.env.APP_URL ?? "http://localhost:3000"}/pay/cancel`,
    });

    return NextResponse.redirect(session.url!, 303);
  } catch (error) {
    console.error("Errore Stripe:", error);
    return NextResponse.json(
      { error: "Errore nella creazione della sessione di pagamento" },
      { status: 500 }
    );
  }
}

