import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabaseUrl =
      process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) return NextResponse.json({ error: "Missing SUPABASE_URL" }, { status: 500 });
    if (!serviceKey) return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });

    const supabase = createClient(supabaseUrl, serviceKey);

    const unique = `DEBUG-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const { error } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: unique });

    if (error) {
      return NextResponse.json({ ok: false, where: "insert", error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, inserted: unique, supabaseHost: supabaseUrl.split("/")[2] });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown" }, { status: 500 });
  }
}
