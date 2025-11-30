// app/api/my-searches/[id]/route.ts
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function DELETE(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const id = context.params.id;

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


