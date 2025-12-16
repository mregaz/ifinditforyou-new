import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: adattare tabella/colonne alla tua struttura reale
    // Qui metto un placeholder sicuro che compila.
    const { data, error } = await supabase
      .from("my_searches")
      .select("*")
      .eq("user_id", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("my-searches GET DB error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ data: data ?? [] });
  } catch (err: any) {
    console.error("my-searches GET unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
