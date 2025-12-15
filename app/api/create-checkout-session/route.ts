import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type BillingPeriod = "monthly" | "yearly";
type RequestBody = {
  billingPeriod?: BillingPeriod | string;
  lang?: string;
};

const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function isSupportedLocale(x: unknown): x is Locale {
  return typeof x === "string" && (SUPPORTED_LOCALES as readonly string[]).includes(x);
}

const STRIPE_LOCALE_MAP: Record<Locale, any> = {
  it: "it",
  en: "en",
  fr: "fr",
  de: "de",
  es: "es",
};

function normalizeBillingPeriod(x: unknown): BillingPeriod | null {
  if (x === "monthly" || x === "yearly") return x;
  if (x === "month" || x === "mensile") return "monthly";
  if (x === "year" || x === "annuale" || x === "annual") return "yearly";
  return null;
}

function getBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (envUrl) {
    // se manca schema, lo aggiungiamo
    if (envUrl.startsWith("http://") || envUrl.startsWith("https://")) {
      return envUrl.replace(/\/+$/, "");
    }
    return `https://${envUrl.replace(/\/+$/, "")}`;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/+$/, "")}`;
  }

  // fallback locale
  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await req.json()) as RequestBody;

    const billingPeriod = normalizeBillingPeriod(body.billingPeriod);
    if (!billingPeriod) {
      return NextResponse.json({ error: "Invalid billingPeriod" }, { status: 400 });
    }

    const appLang: Locale = isSupportedLocale(body.lang) ? (body.lang as Locale) : "it";
    const stripeLocale = STRIPE_LOCALE_MAP[appLang];

    const monthlyPriceId = process.env.STRIPE_PRICE_ID_MONTHLY;
    const yearlyPriceId = process.env.STRIPE_PRICE_ID_YEARLY;
    const priceId = billingPeriod === "yearly" ? yearlyPriceId : monthlyPriceId;

    if (!priceId) {
      console.error("Stripe price ID missing", {
        STRIPE_PRICE_ID_MONTHLY: monthlyPriceId ? "SET" : "MISSING",
        STRIPE_PRICE_ID_YEARLY: yearlyPriceId ? "SET" : "MISSING",
      });
      return NextResponse.json({ error: "Stripe price ID missing" }, { status: 500 });
    }

    // User row dalla tabella "User"
    const { data: userRow, error: userRowError } = await supabase
      .from("User")
      .select("id, email, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userRowError || !userRow) {
      console.error("User row missing in DB", userRowError);
      return NextResponse.json({ error: "User profile missing" }, { status: 500 });
    }

    let stripeCustomerId = (userRow as any).stripe_customer_id as string | null;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: (userRow as any).email ?? user.email ?? undefined,
        metadata: { user_id: user.id },
      });

      stripeCustomerId = customer.id;

      const { error: updateErr } = await supabase
        .from("User")
        .update({ stripe_customer_id: stripeCustomerId })
        .eq("id", user.id);

      if (updateErr) console.error("Failed to persist stripe_customer_id", updateErr);
    }

    const baseUrl = getBaseUrl();

    // URL assolute valide per Stripe
    const successUrl = new URL(`/${appLang}/pay/success`, baseUrl).toString();
    const cancelUrl = new URL(`/${appLang}/pay/cancel`, baseUrl).toString();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: stripeCustomerId!,
      locale: stripeLocale,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
        billing_period: billingPeriod,
        price_id: priceId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const e = err as any;
    console.error("Stripe checkout error route", e);
    return NextResponse.json(
      { error: e?.message ?? "Errore nella creazione della sessione di pagamento." },
      { status: 500 }
    );
  }
}


