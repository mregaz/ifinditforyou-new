// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

type BillingPeriod = "monthly" | "yearly";

function getPriceId(billingPeriod: BillingPeriod): string | null {
  if (billingPeriod === "yearly") {
    return process.env.STRIPE_PRICE_YEARLY ?? null;
  }
  return process.env.STRIPE_PRICE_MONTHLY ?? null;
}

function getBaseUrl(req: Request): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

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

    if (
      !body ||
      (body.billingPeriod !== "monthly" && body.billingPeriod !== "yearly")
    ) {
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

    // 👇 Prendiamo l’email dal body (se presente)
    const email =
      typeof body.email === "string" && body.email.length > 0
        ? body.email
        : null;

    // userId opzionale, se riusciamo a risalire all’utente
    let userId: string | null = null;

    if (email) {
      // ✅ Creiamo o recuperiamo l’utente in base all’email
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          credits: 0,
          // "plan" ha default "free" in schema.prisma,
          // quindi non serve impostarlo qui.
        },
      });
      userId = user.id;
    }

    // Preparo i metadata per Stripe
    const metadata: Record<string, string> = {};
    if (userId) {
      metadata.userId = userId;
    }
    if (email) {
      metadata.email = email;
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/pay/cancel`,
      // Se non abbiamo user/email, metadata sarà vuoto (ok lo stesso)
      metadata,
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

