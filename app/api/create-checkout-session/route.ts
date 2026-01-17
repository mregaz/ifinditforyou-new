import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

function toLocale(v?: string | null): Locale {
  const s = (v ?? "").toLowerCase().replace("_", "-").split("-")[0];
  return (SUPPORTED_LOCALES as readonly string[]).includes(s) ? (s as Locale) : "it";
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Missing STRIPE_SECRET_KEY");
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    console.error("Supabase env missing:", {
      hasSUPABASE_URL: !!process.env.SUPABASE_URL,
      hasSUPABASE_ANON_KEY: !!process.env.SUPABASE_ANON_KEY,
      hasNEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasNEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    });
    throw new Error("Missing Supabase URL or ANON key env vars");
  }

  return createClient(url, anon);
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

    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error || !data?.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const user = data.user;

    const priceMonthly = process.env.STRIPE_PRICE_ID_MONTHLY;
    const priceYearly = process.env.STRIPE_PRICE_ID_YEARLY;
    const priceId = billingPeriod === "yearly" ? priceYearly : priceMonthly;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID_MONTHLY / STRIPE_PRICE_ID_YEARLY" },
        { status: 500 }
      );
    }

    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
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

