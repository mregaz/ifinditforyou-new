// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

type BillingPeriod = "monthly" | "yearly";

export async function POST(req: NextRequest) {
  try {
    const { billingPeriod } = (await req.json()) as {
      billingPeriod?: BillingPeriod;
    };

    // 0️⃣ Validazione del parametro
    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json(
        { error: "billingPeriod mancante o non valido" },
        { status: 400 }
      );
    }

    // 1️⃣ Price ID dalle variabili d'ambiente
    const priceMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
    const priceYearly = process.env.STRIPE_PRICE_ID_YEARLY;

    const priceId =
      billingPeriod === "monthly" ? priceMonthly : priceYearly;

    if (!priceId) {
      console.error(
        "❌ Manca la ENV per il priceId:",
        billingPeriod === "monthly"
          ? "STRIPE_PRICE_ID_MONTHLY"
          : "STRIPE_PRICE_ID_YEARLY"
      );
      return NextResponse.json(
        { error: "Configurazione price Stripe mancante" },
        { status: 500 }
      );
    }

    // 2️⃣ Base URL dell'app (es. https://ifinditforyou.com)
    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!rawBaseUrl) {
      console.error("❌ NEXT_PUBLIC_APP_URL non impostata");
      return NextResponse.json(
        { error: "Configurazione NEXT_PUBLIC_APP_URL mancante" },
        { status: 500 }
      );
    }

    const baseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

    if (!baseUrl.startsWith("http")) {
      console.error("❌ NEXT_PUBLIC_APP_URL non valida:", baseUrl);
      return NextResponse.json(
        { error: "Configurazione NEXT_PUBLIC_APP_URL non valida" },
        { status: 500 }
      );
    }

    // 3️⃣ URL di ritorno
    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pay/cancel`;

    console.log("✅ URL usate per Stripe:", { successUrl, cancelUrl });

    // 4️⃣ Crea la sessione Stripe (subscription)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    if (!session.url) {
      console.error("❌ Nessuna URL di checkout restituita da Stripe");
      return NextResponse.json(
        { error: "Stripe non ha restituito una URL di checkout" },
        { status: 500 }
      );
    }

    // 5️⃣ Risposta OK verso il frontend
    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error in create-checkout-session:", err);
    return NextResponse.json(
      { error: "Stripe error: " + (err?.message ?? "errore sconosciuto") },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Usa il metodo POST per creare una sessione di Checkout" },
    { status: 405 }
  );
}


