import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";


export async function GET(req: NextRequest) {
  try {
  const supabase = await createClient();

  


    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("my-searches getUser error:", authError);
      return NextResponse.json(
        { error: "Errore nel recupero utente." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 200) : 50;

    const { data, error } = await supabase
      .from("Search")
      .select("id, query, lang, plan, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("my-searches select error:", error);
      return NextResponse.json(
        { error: "Errore nel caricamento delle ricerche." },
        { status: 500 }
      );
    }

    return NextResponse.json({ searches: data ?? [] });
  } catch (err) {
    console.error("my-searches unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno del server." },
      { status: 500 }
    );
  }
}
