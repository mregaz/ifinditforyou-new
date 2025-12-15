import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

type BillingPeriod = "monthly" | "yearly";
type RequestBody = {
  billingPeriod: BillingPeriod;
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
    const billingPeriod = body.billingPeriod;
    const lang = body.lang;

    if (billingPeriod !== "monthly" && billingPeriod !== "yearly") {
      return NextResponse.json({ error: "Invalid billingPeriod" }, { status: 400 });
    }

    const appLang: Locale = isSupportedLocale(lang) ? lang : "it";
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

    const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const appUrl = rawAppUrl.trim().replace(/\/+$/, "");

    // 1) Prova a leggere la riga "User"
    let { data: userRow, error: userRowError } = await supabase
      .from("User")
      .select("id, email, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userRowError) {
      console.error("DB error reading User row:", userRowError);
      return NextResponse.json({ error: "DB error reading user" }, { status: 500 });
    }

    // 2) Se manca, creala (UPSERT)
    if (!userRow) {
      const insertPayload = {
        id: user.id,
        email: user.email ?? null,
        is_pro: false,
      };

      const { error: insertErr } = await supabase.from("User").insert(insertPayload);

      if (insertErr) {
        console.error("Failed to create User row:", insertErr);
        return NextResponse.json({ error: "User profile missing" }, { status: 500 });
      }

      const retry = await supabase
        .from("User")
        .select("id, email, stripe_customer_id")
        .eq("id", user.id)
        .maybeSingle();

      userRow = retry.data ?? null;

      if (!userRow) {
        return NextResponse.json({ error: "User profile missing (after create)" }, { status: 500 });
      }
    }

    // 3) Customer Stripe: crea se manca
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

      if (updateErr) {
        console.error("Failed to persist stripe_customer_id", updateErr);
      }
    }

    const successUrl = `${appUrl}/${appLang}/pay/success`;
    const cancelUrl = `${appUrl}/${appLang}/pay/cancel`;

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
      customer_email: (userRow as any).email ?? user.email ?? undefined,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const e = err as any;
    console.error("create-checkout-session error", e);
    return NextResponse.json(
      { error: e?.message ?? "Unexpected error creating checkout session" },
      { status: 500 }
    );
  }
}

