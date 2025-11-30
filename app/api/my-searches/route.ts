// app/api/my-searches/[id]/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function DELETE(req: any, context: any) {
  try {
    // Provo a leggere l'id da context.params, fallback all'URL
    const idFromContext = context?.params?.id as string | undefined;

    const url = new URL(req.url as string);
    const segments = url.pathname.split("/");
    const idFromUrl = segments[segments.length - 1];

    const id = idFromContext || idFromUrl;

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



