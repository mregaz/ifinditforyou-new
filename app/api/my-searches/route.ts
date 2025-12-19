import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type SearchRow = {
  id: string;
  user_id: string;
  query: string;
  lang: string | null;
  plan: string | null;
  created_at: string;
};

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("Search")
    .select("id, user_id, query, lang, plan, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("my-searches GET DB error:", {
      message: error.message,
      code: (error as any).code,
      details: (error as any).details,
      hint: (error as any).hint,
    });
    return NextResponse.json(
      { error: "DB error", message: error.message },
      { status: 500 }
    );
  }

  const rows = (data ?? []) as SearchRow[];

  // Normalizziamo per la UI (createdAt camelCase)
  const items = rows.map((r) => ({
    id: r.id,
    query: r.query,
    status: r.plan ?? "FREE",   // se non hai "status", usiamo plan come fallback utile
    createdAt: r.created_at,
    lang: r.lang ?? null,
    plan: r.plan ?? null,
  }));

  return NextResponse.json({ items });
}

