import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";

type BillingPeriod = "monthly" | "yearly";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let billingPeriod: BillingPeriod = body.billingPeriod ?? "monthly";

    // Normalizza: se arriva qualcosa di strano, forzo "monthly"
    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      console.warn("Valore billingPeriod non valido:", billingPeriod);
      billingPeriod = "monthly";
    }

    const priceId =
      billingPeriod === "yearly"
        ? process.env.STRIPE_PRICE_ID_YEARLY
        : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      console.error("Manca priceId per billingPeriod:", billingPeriod);
      return NextResponse.json(
        {
          error:
            "Configurazione prezzo Stripe mancante per il piano " +
            billingPeriod,
        },
        { status: 500 }
      );
    }

    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const appUrl = rawAppUrl.trim().replace(/\/+$/, "");

    try {
      new URL(appUrl);
    } catch {
      console.error("NEXT_PUBLIC_APP_URL non valida:", rawAppUrl);
      return NextResponse.json(
        {
          error: `Configurazione NEXT_PUBLIC_APP_URL non valida: "${rawAppUrl}"`,
        },
        { status: 500 }
      );
    }

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
      console.error("Sessione Stripe creata ma senza URL:", session.id);
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

