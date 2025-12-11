import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { isSupportedLocale, type Locale } from "@/lib/lang";

type BillingPeriod = "monthly" | "yearly";

type RequestBody = {
  billingPeriod: BillingPeriod;
  lang?: string;
};

const localeMap: Record<Locale, string> = {
  it: "it",
  en: "en",
  fr: "fr",
  de: "de",
  es: "es",
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { billingPeriod, lang } = body;

    if (!billingPeriod) {
      return NextResponse.json(
        { error: "Missing billingPeriod" },
        { status: 400 }
      );
    }

    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json(
        { error: "Invalid billingPeriod" },
        { status: 400 }
      );
    }

    const appLang: Locale = isSupportedLocale(lang) ? (lang as Locale) : "it";
    const stripeLocale = localeMap[appLang];

    // QUI usiamo ESATTAMENTE i nomi che hai in Vercel:
    // STRIPE_PRICE_ID_MONTHLY e STRIPE_PRICE_ID_YEARLY
    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY;
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY;

    const priceId =
      billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      console.error("Stripe price ID non configurato", {
        billingPeriod,
        STRIPE_PRICE_ID_MONTHLY: monthlyPriceId ? "SET" : "MISSING",
        STRIPE_PRICE_ID_YEARLY: yearlyPriceId ? "SET" : "MISSING",
      });

      return NextResponse.json(
        { error: "Stripe price ID non configurato" },
        { status: 500 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

     const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  locale: "auto",   // ✅ nessun problema di tipo
  line_items: [{ price: priceId, quantity: 1 }],
  success_url: `${appUrl}/pay/success`,
  cancel_url: `${appUrl}/pay/cancel`,
  // ... il resto uguale
});


    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error route", err);
    return NextResponse.json(
      {
        error:
          err?.message ??
          "Errore imprevisto nella creazione della sessione di pagamento",
      },
      { status: 500 }
    );
  }
}
