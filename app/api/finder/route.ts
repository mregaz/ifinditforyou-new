import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Lang = "it" | "fr" | "en" | "de" | "es";

function normalizeLang(x: any): Lang {
  const v = String(x ?? "it").toLowerCase();
  if (v === "it" || v === "fr" || v === "en" || v === "de" || v === "es") return v;
  return "it";
}

/**
 * TODO: sostituisci con la tua logica reale già esistente
 */
async function searchPublic(query: string, lang: Lang) {
  return [];
}

/**
 * TODO: sostituisci con la tua logica reale già esistente
 */
async function searchPro(query: string, lang: Lang) {
  return [];
}

export async function POST(req: Request) {
  const supabase = await createClient();

  // Auth user (se non loggato, può fare solo public search)
  const userRes = await supabase.auth.getUser();
  const user = userRes.data?.user ?? null;

  const body = await req.json().catch(() => ({}));
  const query = String(body?.query ?? "").trim();
  const lang = normalizeLang(body?.lang);

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  // Leggiamo lo user row se loggato
  let userRow: any = null;

  if (user?.id) {
    const { data, error } = await supabase
      .from("User")
      .select("id, is_pro, credits, plan")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: "Failed to load user" }, { status: 500 });
    }

    userRow = data ?? null;
  }

  // Decide modalità: PRO solo se DB dice PRO (mai fidarsi del client)
  const isPro = !!userRow?.is_pro;

  // 1) Se PRO: consuma 1 credito in modo atomico (RPC)
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
      return NextResponse.json({ error: "Credit consumption failed" }, { status: 500 });
    }

    creditsRemaining = data?.[0]?.new_credits ?? null;
  }

  // 2) Esegui ricerca (public o pro)
  const results = isPro ? await searchPro(query, lang) : await searchPublic(query, lang);

  // 3) Log ricerca (server-side)
  if (userRow?.id) {
    const { error: logErr } = await supabase.from("Search").insert({
      user_id: userRow.id,
      query,
      lang,
      plan: isPro ? "pro" : "free",
    });

    if (logErr) {
      // non blocchiamo la risposta, ma logghiamo
      console.warn("Failed to log search", logErr);
    }
  }

  return NextResponse.json({
    ok: true,
    isPro,
    creditsRemaining,
    results,
  });
}
