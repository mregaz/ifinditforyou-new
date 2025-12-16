import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const preferred_language = body?.preferred_language ?? body?.language ?? null;

    if (!preferred_language) {
      return NextResponse.json({ error: "Missing preferred_language" }, { status: 400 });
    }

    const { error } = await supabase
      .from("User")
      .update({ preferred_language })
      .eq("id", user.id);

    if (error) {
      console.error("update-preferences DB error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("update-preferences unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
