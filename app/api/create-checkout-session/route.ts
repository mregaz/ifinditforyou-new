import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAppUrl(req: Request) {
  // Preferisci variabile, fallback su host reale
  const envUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const host = req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

function isPreview() {
  return process.env.VERCEL_ENV !== "production";
}

function pickPriceId() {
  // Strategia anti-caos:
  // - Production: usa STRIPE_PRICE_ID_MONTHLY (live)
  // - Preview/Dev: usa STRIPE_PRICE_ID_MONTHLY_TEST (test)
  const prod = process.env.STRIPE_PRICE_ID_MONTHLY;
  const test = process.env.STRIPE_PRICE_ID_MONTHLY_TEST;

  if (isPreview()) return test ?? prod; // se manca test, usa prod (meglio di rompere)
  return prod ?? test;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Utente deve essere loggato per creare session pro (altrimenti non abbiamo user.id)
    const userRes = await supabase.auth.getUser();
    const user = userRes.data?.user;

    if (!user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const locale = String(body?.locale ?? "it");

    const priceId = pickPriceId();
    if (!priceId) {
      console.error("Missing priceId env", {
        vercelEnv: process.env.VERCEL_ENV,
        hasProd: !!process.env.STRIPE_PRICE_ID_MONTHLY,
        hasTest: !!process.env.STRIPE_PRICE_ID_MONTHLY_TEST,
      });
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const appUrl = getAppUrl(req);

    const stripe = getStripe();

    // (Opzionale ma utile) email customer
    const email = user.email ?? undefined;

    // ✅ Checkout subscription con riferimento utente robusto
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: user.id, // ✅ fondamentale
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/${locale}/pay/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/${locale}/pay/cancel`,
      subscription_data: {
        metadata: {
          user_id: user.id, // ✅ fallback per subscription.updated/deleted
        },
      },
      // Se vuoi evitare che Stripe crei più customer per la stessa email:
      // customer_creation: "always",
    });

    console.log("checkout created", {
      sessionId: session.id,
      userId: user.id,
      vercelEnv: process.env.VERCEL_ENV,
      priceIdPrefix: priceId.slice(0, 8),
      modeGuess: process.env.STRIPE_SECRET_KEY?.startsWith("sk_test") ? "TEST" : "LIVE",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-checkout-session error", err?.message ?? err);
    return NextResponse.json({ error: "Checkout creation failed" }, { status: 500 });
  }
}

