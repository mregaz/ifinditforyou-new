// app/api/my-searches/[id]/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function DELETE(req: Request) {
  try {
    // prendo l'id dall'URL, ultimo segmento del path
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const id = segments[segments.length - 1];

    const supabase = createRouteHandlerClient({ cookies });

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

    // Cancello solo se la ricerca appartiene all'utente loggato
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


