import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { billingPeriod, lang } = await req.json();
  const priceId = billingPeriod === "yearly"
    ? process.env.STRIPE_PRICE_ID_YEARLY
    : process.env.STRIPE_PRICE_ID_MONTHLY;

  if (!priceId) return NextResponse.json({ error: "Missing priceId" }, { status: 500 });

  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://ifinditforyou.com").replace(/\/+$/, "");
  const locale = (lang || "it").toString();

  const session = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [{ price: priceId, quantity: 1 }],
  client_reference_id: user.id,
  subscription_data: { metadata: { user_id: user.id } },
  success_url: successUrl,
  cancel_url: cancelUrl,
});


  return NextResponse.json({ url: session.url });
}
