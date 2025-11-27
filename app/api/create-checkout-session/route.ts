// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe"; // usa la tua lib esistente

export async function POST() {
  try {
    // 1) Prendiamo i price ID dalle env
    const priceMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
    const priceYearly = process.env.STRIPE_PRICE_ID_YEARLY;

    // Se vuoi gestire solo il mensile, puoi usare solo priceMonthly.
    // Per ora usiamo il mensile COME DEFAULT, così non dipendiamo dal body.
    const priceId = priceMonthly;

    if (!priceId) {
      console.error("❌ Manca STRIPE_PRICE_ID_MONTHLY nelle variabili di ambiente");
      return NextResponse.json(
        { error: "Configurazione Stripe mancante (price mensile)." },
        { status: 500 }
      );
    }

    // 2) Base URL dell’app (per success/cancel)
    const rawBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://ifinditforyou.com";

    const baseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

    // 3) Creiamo la sessione di Checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pro`,
    });

    if (!session.url) {
      console.error("❌ Stripe non ha restituito una URL di checkout");
      return NextResponse.json(
        { error: "Stripe non ha restituito una URL di checkout." },
        { status: 500 }
      );
    }

    // 4) Rispondiamo al frontend
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Errore create-checkout-session:", err);
    return NextResponse.json(
      {
        error:
          "Stripe error: " +
          (err?.message ?? "errore sconosciuto durante la creazione del checkout"),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Usa POST per creare una sessione di pagamento." },
    { status: 405 }
  );
}


