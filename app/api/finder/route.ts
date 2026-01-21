import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lang = "it" | "fr" | "en" | "de" | "es";

function normalizeLang(x: any): Lang {
  const v = String(x ?? "it").toLowerCase();
  if (v === "it" || v === "fr" || v === "en" || v === "de" || v === "es") return v;
  return "it";
}

async function searchPublic(query: string, lang: Lang) {
  // TODO: sostituisci con la tua logica reale già esistente
  return [];
}

async function searchPro(query: string, lang: Lang) {
  // TODO: sostituisci con la tua logica reale già esistente
  return [];
}

export async function POST(req: Request) {
  const supabase = await createClient();

  // ✅ 1) CLIENT ADMIN (SERVICE ROLE) per bypassare RLS lato server
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  const supabaseAdmin = createAdminClient(supabaseUrl, serviceRoleKey);

  // ✅ 2) Auth user (cookie-based)
  const userRes = await supabase.auth.getUser();
  const user = userRes.data?.user ?? null;

  const body = await req.json().catch(() => ({}));
  const query = String(body?.query ?? "").trim();
  const lang = normalizeLang(body?.lang);

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // ✅ 3) Carica userRow (DB) se loggato
  let userRow: any = null;

  if (user?.id) {
    const { data, error } = await supabase
      .from("User")
      .select("id, is_pro, credits, plan")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("Failed to load user", error);
      return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }

    userRow = data ?? null;
  }

  // ✅ 4) PRO deciso SOLO dal DB
  const isPro = !!userRow?.is_pro;

  // ✅ 5) Consumo crediti SOLO se PRO
  let creditsRemaining: number | null = null;

  if (isPro) {
    const { data, error } = await supabase.rpc("consume_credit", { p_user_id: user!.id });

    if (error) {
      const msg = String(error.message || "").toLowerCase();
      if (msg.includes("no credits left")) {
        return NextResponse.json({ error: "No credits left" }, { status: 402 });
      }
      if (msg.includes("pro required")) {
        return NextResponse.json({ error: "PRO required" }, { status: 403 });
      }
      console.error("consume_credit failed", error);
      return NextResponse.json({ error: "Credit consumption failed" }, { status: 500 });
    }

    creditsRemaining = data?.[0]?.new_credits ?? null;
  }

  // ✅ 6) Esegui ricerca
  const results = isPro ? await searchPro(query, lang) : await searchPublic(query, lang);

  // ✅ 7) Log Search con ADMIN (bypassa RLS)
  if (userRow?.id) {
    const { error: logErr } = await supabaseAdmin.from("Search").insert({
      user_id: userRow.id,
      query,
      lang,
      plan: isPro ? "pro" : "free",
    });

    if (logErr) {
      console.warn("Failed to log search (admin)", logErr);
      // non blocco la risposta
    }
  }

  return NextResponse.json({
    ok: true,
    isPro,
    creditsRemaining,
    results,
  });
}
