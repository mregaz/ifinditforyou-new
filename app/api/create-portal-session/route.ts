import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("portal profile error:", profileError);
      return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: "Stripe customer not found" }, { status: 400 });
    }

    const rawBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "";
    const baseUrl = rawBaseUrl.trim().replace(/\/+$/, "");

    if (!baseUrl) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_APP_URL" }, { status: 500 });
    }

    // Locale: se non lo hai, fallback it. (Va benissimo così per ora)
    const locale = (user.user_metadata?.locale as string | undefined) ?? "it";

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${baseUrl}/${locale}/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("create-portal-session error:", err);
    return NextResponse.json({ error: err?.message ?? "Unexpected error" }, { status: 500 });
  }
}
