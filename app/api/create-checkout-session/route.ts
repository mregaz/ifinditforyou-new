// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type BillingPeriod = "monthly" | "yearly";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const billingPeriod: BillingPeriod = body.billingPeriod ?? "monthly";

    // Scegliamo il priceId in base al periodo
    const priceId =
      billingPeriod === "yearly"
        ? process.env.STRIPE_PRICE_ID_YEARLY
        : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      // Qui NON è colpa tua, ma della config Stripe
      console.error("Price ID mancante per", billingPeriod);
      return NextResponse.json(
        {
          error:
            "Configurazione prezzo Stripe mancante per il piano " +
            billingPeriod,
        },
        { status: 500 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/pro`,
    });

    if (!session.url) {
      console.error("Sessione Stripe creata ma senza URL", session);
      return NextResponse.json(
        {
          error:
            "Stripe ha creato la sessione ma non ha fornito un URL di checkout.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe error in create-checkout-session:", err);
    return NextResponse.json(
      {
        error:
          "Stripe error: " +
          (err?.message ??
            "Errore sconosciuto nella creazione della sessione di pagamento."),
      },
      { status: 500 }
    );
  }
}

