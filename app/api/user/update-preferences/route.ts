import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SUPPORTED_LANGUAGES = ["it", "en", "fr", "de", "es"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export async function POST(req: Request) {
  try {
    const supabase = await createClient(); // ✅ AWAIT

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const preferred_language = body?.preferred_language ?? null;

    if (
      !preferred_language ||
      typeof preferred_language !== "string" ||
      !SUPPORTED_LANGUAGES.includes(preferred_language as SupportedLanguage)
    ) {
      return NextResponse.json(
        { error: "Invalid preferred_language" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("User")
      .update({ preferred_language })
      .eq("id", user.id);

    if (updateError) {
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error" },
      { status: 500 }
    );
  }
}
