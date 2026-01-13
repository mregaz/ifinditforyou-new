import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function toLocale(v?: string | null): Locale {
  const s = (v ?? "").toLowerCase().replace("_", "-").split("-")[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(s) ? (s as Locale) : "it";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const billingPeriod = body?.billingPeriod as "monthly" | "yearly" | undefined;
    const lang = toLocale(body?.lang);
    const accessToken = body?.accessToken as string | undefined;

    if (!billingPeriod) {
      return NextResponse.json({ error: "Missing billingPeriod" }, { status: 400 });
    }
    if (!accessToken) {
      return NextResponse.json({ error: "Missing accessToken" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnon) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnon);

    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }
    const user = data.user;

    const priceMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
    const priceYearly = process.env.STRIPE_PRICE_ID_YEARLY;

    const priceId = billingPeriod === "yearly" ? priceYearly : priceMonthly;
    if (!priceId) {
      return NextResponse.json({ error: "Missing STRIPE_PRICE_ID env var" }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],

      // ✅ collegamento Stripe → Supabase
      client_reference_id: user.id,
      metadata: {
        supabase_user_id: user.id,
        billing_period: billingPeriod,
      },

      success_url: `${baseUrl}/${lang}/account/overview?checkout=success`,
      cancel_url: `${baseUrl}/${lang}/pro?checkout=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unknown error", type: err?.type, code: err?.code },
      { status: 500 }
    );
  }
}
