import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anon) throw new Error("Missing Supabase URL/ANON env vars");
  return createClient(url, anon);
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const accessToken = body?.accessToken as string | undefined;

    if (!accessToken) {
      return NextResponse.json({ error: "Missing accessToken" }, { status: 401 });
    }

    const supabase = getSupabaseServerClient();

    const { data, error: userErr } = await supabase.auth.getUser(accessToken);
    if (userErr || !data?.user) {
      return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    // Leggi customer id dal tuo DB (tabella User o entitlements, dipende da dove lo salvi)
    // Qui assumo tabella "User" con colonna "stripe_customer_id" come nei tuoi screenshot.
    const { data: row, error: dbErr } = await supabase
      .from("User")
      .select("stripe_customer_id")
      .eq("id", data.user.id)
      .maybeSingle();

    if (dbErr) {
      return NextResponse.json({ error: "DB error reading stripe_customer_id" }, { status: 500 });
    }

    const stripeCustomerId = row?.stripe_customer_id;
    if (!stripeCustomerId) {
      return NextResponse.json({ error: "Missing stripe_customer_id for user" }, { status: 400 });
    }

    const baseUrl =
      process.env.APP_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const stripe = getStripe();

    const portal = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${baseUrl}/account/overview`,
    });

    return NextResponse.json({ url: portal.url });
  } catch (err: any) {
    console.error("create-portal-session error:", err);
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}
