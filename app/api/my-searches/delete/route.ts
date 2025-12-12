import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseServer";


export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    


    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("delete my-searches getUser error:", userError);
      return NextResponse.json(
        { error: "Errore nel recupero utente." },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json({ error: "Non autorizzato." }, { status: 401 });
    }

    const body = (await req.json().catch(() => null)) as
      | { id?: string }
      | null;

    const id = body?.id;
    if (!id) {
      return NextResponse.json(
        { error: "ID ricerca mancante." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Search")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("delete my-searches error:", error);
      return NextResponse.json(
        { error: "Errore nella cancellazione della ricerca." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("delete my-searches unexpected error:", err);
    return NextResponse.json(
      { error: "Errore interno del server." },
      { status: 500 }
    );
  }
}
