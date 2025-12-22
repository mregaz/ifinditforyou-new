import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { isSupportedLocale, type Locale } from "@/lib/lang";

type BillingPeriod = "monthly" | "yearly";
type RequestBody = { billingPeriod: BillingPeriod; lang?: string };

function resolveLocale(bodyLang: unknown, req: Request): Locale {
  // 1) Body (priorità massima)
  if (typeof bodyLang === "string" && isSupportedLocale(bodyLang)) {
    return bodyLang as Locale;
  }

  // 2) Referer (es: https://site.com/de/... )
  const ref = req.headers.get("referer");
  if (ref) {
    try {
      const url = new URL(ref);
      const firstSeg = url.pathname.split("/").filter(Boolean)[0]; // "de"
      if (isSupportedLocale(firstSeg)) return firstSeg as Locale;
    } catch {
      // ignore
    }
  }

  // 3) Default
  return "it";
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as RequestBody;
    const { billingPeriod } = body;

    if (!billingPeriod) {
      return NextResponse.json({ error: "Missing billingPeriod" }, { status: 400 });
    }
    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json({ error: "Invalid billingPeriod" }, { status: 400 });
    }

    const appLang = resolveLocale(body.lang, req);

    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY;
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY;
    const priceId = billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      return NextResponse.json({ error: "Stripe price ID non configurato" }, { status: 500 });
    }

    const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000")
      .trim()
      .replace(/\/+$/, "");

    const successUrl = `${appUrl}/${appLang}/pay/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/${appLang}/pay/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: "auto",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "Errore imprevisto nella creazione della sessione di pagamento" },
      { status: 500 }
    );
  }
}
