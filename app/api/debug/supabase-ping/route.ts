import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) return NextResponse.json({ ok: false, error: "Missing SUPABASE_URL" }, { status: 500 });
  if (!key) return NextResponse.json({ ok: false, error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });

  const endpoint = `${url.replace(/\/+$/, "")}/rest/v1/User?select=id&limit=1`;

  try {
    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      cache: "no-store",
    });

    const text = await res.text();
    return NextResponse.json({
      ok: res.ok,
      status: res.status,
      endpoint,
      bodyPreview: text.slice(0, 300),
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "fetch failed", code: e?.code ?? null },
      { status: 500 }
    );
  }
}
