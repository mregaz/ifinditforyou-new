// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json(); // o quello che usi tu

    // 1️⃣ Legge la base URL dall'ENV
    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const cleanedBaseUrl = rawBaseUrl.trim().replace(/\/+$/, ""); // toglie spazi e slash finali

    // 2️⃣ Fallback sicuro se l'ENV è vuoto
    const baseUrl = cleanedBaseUrl || "https://ifinditforyou.com";

    // 3️⃣ Controllo extra: deve iniziare con http
    if (!baseUrl.startsWith("http")) {
      console.error("❌ NEXT_PUBLIC_APP_URL non valida:", baseUrl);
      return NextResponse.json(
        { error: "Configurazione URL non valida" },
        { status: 500 }
      );
    }

    const successUrl = `${baseUrl}/success`;
    const cancelUrl = `${baseUrl}/pay/cancel`;

    console.log("✅ URL usate per Stripe:", { successUrl, cancelUrl });

    // 4️⃣ Crea la sessione Stripe
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId, // o process.env.STRIPE_PRICE_MONTHLY / YEARLY
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error in create-checkout-session:", err?.message);
    return NextResponse.json(
      { error: "Stripe error: " + err?.message },
      { status: 500 }
    );
  }
}


