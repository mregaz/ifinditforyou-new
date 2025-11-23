// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getBaseUrl() {
  // Prova prima con NEXT_PUBLIC_APP_URL, poi con URL_APP, poi fallback
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.URL_APP ??
    "";

  // pulizia: trim + rimuovi eventuale "/" finale
  const cleaned = raw.trim().replace(/\/+$/, "");

  // fallback se vuoto o palesemente sbagliato
  const baseUrl = cleaned || "https://ifinditforyou.com";

  console.log("DEBUG baseUrl per Stripe:", JSON.stringify(baseUrl));

  return baseUrl;
}

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId) {
      return new NextResponse("Missing priceId", { status: 400 });
    }

    const baseUrl = getBaseUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card", "link"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId ?? "",
      },
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/pay/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error in create-checkout-session:", err);
    return new NextResponse(
      `Stripe error: ${err?.message ?? "Unknown error"}`,
      { status: 500 }
    );
  }
}

