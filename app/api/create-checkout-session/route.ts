// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

// Stripe vuole il runtime Node, NON Edge
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://ifinditforyou.com.vercel.app";

const monthlyPriceId = process.env.STRIPE_PRICE_MONTHLY; // 👈 come in Vercel

if (!monthlyPriceId) {
  throw new Error("Missing STRIPE_PRICE_MONTHLY environment variable");
}

export async function POST(_req: NextRequest) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "link"],
      line_items: [
        {
          price: monthlyPriceId,
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/success`,
      cancel_url: `${appUrl}/pay/cancel`,
      // metadata: userId ... NON la usiamo, il webhook fa fallback sull'email
    });

    if (!session.url) {
      throw new Error("Stripe non ha restituito una URL di Checkout");
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Errore Stripe create-checkout-session:", err?.message, err);

    return NextResponse.json(
      {
        error:
          "Errore nella creazione della sessione di pagamento. (server)",
      },
      { status: 500 }
    );
  }
}

