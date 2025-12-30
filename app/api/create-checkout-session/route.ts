// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";
import { isSupportedLocale, type Locale } from "@/lib/lang";
import type Stripe from "stripe";

type BillingPeriod = "monthly" | "yearly";
type RequestBody = { billingPeriod: BillingPeriod; lang?: string };

const stripeLocaleMap: Record<Locale, Stripe.Checkout.SessionCreateParams.Locale> = {
  it: "it",
  en: "en",
  fr: "fr",
  de: "de",
  es: "es",
};

function resolveLocale(bodyLang: unknown, req: Request): Locale {
  if (typeof bodyLang === "string" && isSupportedLocale(bodyLang)) {
    return bodyLang as Locale;
  }

  const ref = req.headers.get("referer");
  if (ref) {
    try {
      const url = new URL(ref);
      const firstSeg = url.pathname.split("/").filter(Boolean)[0];
      if (isSupportedLocale(firstSeg)) return firstSeg as Locale;
    } catch {
      // ignore
    }
  }

  return "it";
}

function getSafeAppOrigin(): string {
  const raw = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").trim();
  try {
    const u = new URL(raw);
    return u.origin;
  } catch {
    console.error("NEXT_PUBLIC_APP_URL invalid, fallback to localhost:", JSON.stringify(raw));
    return "http://localhost:3000";
  }
}

export async function POST(req: Request) {
  try {
    // 1) utente loggato (fondamentale per collegare checkout → User.id)
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2) body
    const body = (await req.json().catch(() => ({}))) as Partial<RequestBody>;
    const billingPeriod = body.billingPeriod;

    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json({ error: "Invalid billingPeriod" }, { status: 400 });
    }

    const appLang = resolveLocale(body.lang, req);

    // 3) price id
    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY?.trim();
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY?.trim();
    const priceId = billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      console.error("Stripe price ID missing", {
        billingPeriod,
        STRIPE_PRICE_ID_MONTHLY: monthlyPriceId ? "SET" : "MISSING",
        STRIPE_PRICE_ID_YEARLY: yearlyPriceId ? "SET" : "MISSING",
      });
      return NextResponse.json({ error: "Stripe price ID missing" }, { status: 500 });
    }

    // 4) success/cancel urls
    const origin = getSafeAppOrigin();
    const successUrl = `${origin}/${appLang}/pay/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/${appLang}/pay/cancel`;

    // 5) checkout session (COLLEGAMENTO DETERMINISTICO AL TUO USER)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      locale: stripeLocaleMap[appLang],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,

      // cruciale: il webhook aggiorna User usando questo id (niente più mismatch email)
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata: { user_id: user.id, billing_period: billingPeriod },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout error route:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error creating checkout session" },
      { status: 500 }
    );
  }
}
