import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabaseServer";


export async function POST() {
  try {
    cconst supabase = await createSupabaseServerClient();
    


    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("account/delete auth error:", authError);
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1) Cancella le ricerche
    const { error: searchError } = await supabase
      .from("Search")
      .delete()
      .eq("user_id", user.id);

    if (searchError) {
      console.error("Search deletion error:", searchError);
      return NextResponse.json(
        { error: "Error deleting user searches" },
        { status: 500 }
      );
    }

    // 2) Cancella la riga nella tabella User
    const { error: userError } = await supabase
      .from("User")
      .delete()
      .eq("id", user.id);

    if (userError) {
      console.error("User deletion error:", userError);
      return NextResponse.json(
        { error: "Error deleting user record" },
        { status: 500 }
      );
    }

    // Nota: questo NON rimuove l'utente dalla Auth di Supabase.
    // Lo lasciamo così perché ora è sufficiente per la dashboard.

    return NextResponse.json({ deleted: true });
  } catch (error) {
    console.error("account/delete error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
