 import { NextResponse } from "next/server";
import { isSupportedLocale, type Locale } from "@/lib/lang";
// ATTENZIONE: usa lo stesso import che avevi prima per Stripe.
// Se in lib/stripe.ts hai "export const stripe = new Stripe(...)" allora:
import { stripe } from "@/lib/stripe";
// Se invece hai "export default stripe", usa:  import stripe from "@/lib/stripe";

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

    if (!body.billingPeriod) {
      return NextResponse.json(
        { error: "Missing billingPeriod" },
        { status: 400 }
      );
    }

    const billingPeriod = body.billingPeriod;
    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json(
        { error: "Invalid billingPeriod" },
        { status: 400 }
      );
    }

    const appLang: Locale = isSupportedLocale(body.lang)
      ? (body.lang as Locale)
      : "it";

    const stripeLocale = localeMap[appLang];

    // IMPORTANTE: usa gli stessi env var che avevi prima.
    // Ad esempio, se prima usavi STRIPE_PRICE_PRO_MONTHLY e STRIPE_PRICE_PRO_YEARLY,
    // sostituisci qui i nomi.
    const priceId =
      billingPeriod === "yearly"
        ? process.env.STRIPE_PRICE_YEARLY_ID
        : process.env.STRIPE_PRICE_MONTHLY_ID;

    if (!priceId) {
      console.error("Stripe price ID non configurato", {
        billingPeriod,
        priceIdMonthly: process.env.STRIPE_PRICE_MONTHLY_ID
          ? "SET"
          : "MISSING",
        priceIdYearly: process.env.STRIPE_PRICE_YEARLY_ID ? "SET" : "MISSING",
      });
      return NextResponse.json(
        { error: "Stripe price ID non configurato" },
        { status: 500 }
      );
    }

    const successUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/success`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/cancel`;

    if (!process.env.NEXT_PUBLIC_APP_URL) {
      console.error("NEXT_PUBLIC_APP_URL non configurata");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      locale: stripeLocale,
      // qui puoi rimettere eventuali metadata/customer che avevi
      // customer: ...,
      // metadata: {...},
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
