import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";


const SUPPORTED_LANGUAGES = ["it", "en", "fr", "de", "es"] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export async function POST(req: Request) {
  try {
  const supabase = await createClient();



    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error("update-preferences auth error:", authError);
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { preferredLanguage } = body as {
      preferredLanguage?: SupportedLanguage | null;
    };

    let value: string | null = null;

    if (preferredLanguage) {
      if (!SUPPORTED_LANGUAGES.includes(preferredLanguage)) {
        return NextResponse.json(
          { error: "Unsupported language" },
          { status: 400 }
        );
      }
      value = preferredLanguage;
    }

    const { error: updateError } = await supabase
      .from("User")
      .update({ preferred_language: value })
      .eq("id", user.id);

    if (updateError) {
      console.error("update-preferences db error:", updateError);
      return NextResponse.json(
        { error: "DB error" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, preferredLanguage: value });
  } catch (error) {
    console.error("update-preferences error", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
