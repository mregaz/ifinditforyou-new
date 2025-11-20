// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

type BillingPeriod = "monthly" | "yearly";

function getPriceId(billingPeriod: BillingPeriod): string | null {
  if (billingPeriod === "yearly") {
    return process.env.STRIPE_PRICE_YEARLY ?? null;
  }
  return process.env.STRIPE_PRICE_MONTHLY ?? null;
}

function getBaseUrl(req: Request): string {
  // Se è settata NEXT_PUBLIC_APP_URL, la usiamo
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  // Next.js dà accesso all'URL assoluto della request
  try {
    const url = new URL(req.url);
    return url.origin;
  } catch {
    return "http://localhost:3000";
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    // Validazione: billingPeriod obbligatorio
    if (!body || (body.billingPeriod !== "monthly" && body.billingPeriod !== "yearly")) {
      return NextResponse.json(
        { error: "Parametro billingPeriod mancante o non valido." },
        { status: 400 }
      );
    }

    const billingPeriod = body.billingPeriod as BillingPeriod;
    const priceId = getPriceId(billingPeriod);

    if (!priceId) {
      return NextResponse.json(
        { error: "Stripe price ID mancante per il piano selezionato." },
        { status: 500 }
      );
    }

    const baseUrl = getBaseUrl(req);

    // Creazione sessione Stripe Checkout
    const session = await stripe.checkout.sessions.create({
const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: `${baseUrl}/success`,
  cancel_url: `${baseUrl}/pay/cancel`,
  metadata: {
    userId: user.id,  // 👈 NECESSARIO
    email: user.email,  // non obbligatorio, ma consigliato
  },
});


    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe non ha restituito una URL di checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Errore nel creare la sessione Stripe." },
      { status: 500 }
    );
  }
}

