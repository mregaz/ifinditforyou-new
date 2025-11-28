// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

type BillingPeriod = "monthly" | "yearly";

export async function POST(req: Request) {
  try {
    // 1) Leggiamo il body (mensile / annuale)
    const body = await req.json().catch(() => ({}));
    const billingPeriod: BillingPeriod = body.billingPeriod ?? "monthly";

    // 2) Leggiamo la chiave segreta Stripe da ENV
    const secretKey =
      process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEYS;

    if (!secretKey) {
      // Qui il problema sono le variabili d'ambiente (chiave mancante)
      return NextResponse.json(
        {
          error:
            "Chiave Stripe non trovata (STRIPE_SECRET_KEY / STRIPE_SECRET_KEYS).",
        },
        { status: 500 }
      );
    }

    // 3) Creiamo il client Stripe
    const stripe = new Stripe(secretKey);

    // 4) Scegliamo il prezzo in base al periodo
    const priceId =
      billingPeriod === "yearly"
        ? process.env.STRIPE_PRICE_ID_YEARLY
        : process.env.STRIPE_PRICE_ID_MONTHLY;

    if (!priceId) {
      // Problema di configurazione prezzo
      return NextResponse.json(
        {
          error:
            "Configurazione prezzo Stripe mancante per il piano " +
            billingPeriod,
        },
        { status: 500 }
      );
    }

    // 5) URL dell'app (fallback localhost in dev)
// 5) URL dell'app (fallback localhost in dev)
const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// togliamo eventuali spazi e slash finali
const appUrl = rawAppUrl.trim().replace(/\/+$/, "");

// controlliamo che sia una URL valida
try {
  new URL(appUrl);
} catch {
  return NextResponse.json(
    {
      error: `Configurazione NEXT_PUBLIC_APP_URL non valida: "${rawAppUrl}"`,
    },
    { status: 500 }
  );
}

// 6) Creiamo la sessione di checkout Stripe
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
      return NextResponse.json(
        {
          error:
            "Stripe ha creato la sessione ma non ha fornito un URL di checkout.",
        },
        { status: 500 }
      );
    }

    // 7) Tutto ok → rimandiamo al frontend l'URL di Stripe
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

