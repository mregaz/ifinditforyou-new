// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: "priceId mancante nel body della richiesta" },
        { status: 400 }
      );
    }

    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!rawBaseUrl) {
      console.error("❌ NEXT_PUBLIC_APP_URL non è definita");
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

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/pay/cancel`;

    console.log("✅ URL usate per Stripe:", { successUrl, cancelUrl });

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

