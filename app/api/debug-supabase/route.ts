import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function mustEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function mustEnvAny(names: string[]): string {
  for (const n of names) {
    const v = process.env[n];
    if (v) return v;
  }
  throw new Error(`Missing one of: ${names.join(", ")}`);
}

export async function GET() {
  try {
    const supabaseUrl = mustEnvAny(["SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"]);
    const serviceKey = mustEnv("SUPABASE_SERVICE_ROLE_KEY");

    const supabase = createClient(supabaseUrl, serviceKey);

    const insertId = `DEBUG-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    const { data, error } = await supabase
      .from("StripeWebhookEvent")
      .insert({ event_id: insertId })
      .select();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          where: "supabase-insert",
          message: error.message,
          details: error,
          supabaseHost: new URL(supabaseUrl).host,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      inserted: insertId,
      supabaseHost: new URL(supabaseUrl).host,
      returned: data ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
