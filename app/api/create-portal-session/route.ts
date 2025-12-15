import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: userRow, error } = await supabase
    .from("User")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    console.error("create-portal-session db error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  if (!userRow?.stripe_customer_id) {
    return NextResponse.json({ error: "Stripe customer not found" }, { status: 400 });
  }

  const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const siteUrl = rawSiteUrl.trim().replace(/\/+$/, "");

  const locale = (user.user_metadata?.locale as string | undefined) ?? "it";

  const session = await stripe.billingPortal.sessions.create({
    customer: userRow.stripe_customer_id,
    return_url: `${siteUrl}/${locale}/account`,
  });

  return NextResponse.json({ url: session.url });
}

