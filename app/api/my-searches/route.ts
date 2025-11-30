// app/api/my-searches/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type SearchRow = {
  id: string;
  query: string;
  lang: string;
  plan: string;
  created_at: string;
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit");
    const offsetParam = url.searchParams.get("offset");

    const limit = Math.min(Number(limitParam ?? 50) || 50, 200);
    const offset = Number(offsetParam ?? 0) || 0;

    const supabase = createRouteHandlerClient({ cookies });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("my-searches getUser error:", userError);
      return NextResponse.json(
        { error: "Errore nel recupero utente." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("Search")
      .select("id, query, lang, plan, created_at")
      .eq("user_id", user.id) // opzionale ma esplicito
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("my-searches select error:", error);
      return NextResponse.json(
        { error: "Errore nel recupero delle ricerche." },
        { status: 500 }
      );
    }

    const searches: SearchRow[] = (data ?? []).map((row) => ({
      id: row.id,
      query: row.query,
      lang: row.lang,
      plan: row.plan,
      created_at: row.created_at,
    }));

    return NextResponse.json({
      searches,
      pagination: {
        limit,
        offset,
        count: searches.length,
      },
    });
  } catch (err) {
    console.error("my-searches unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno del server." },
      { status: 500 }
    );
  }
}
