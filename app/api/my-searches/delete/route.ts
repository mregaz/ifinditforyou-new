import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const supabase = await createClient(); // FIX: await

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error("delete my-searches getUser error:", userError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const searchId = body?.id ?? body?.searchId ?? null;

    if (!searchId) {
      return NextResponse.json({ error: "Missing search id" }, { status: 400 });
    }

    // TODO: se la tua tabella non si chiama "searches" o la colonna non è "user_id",
    // dimmelo e la adatto. Questo è lo schema più comune.
    const { error: deleteError } = await supabase
      .from("searches")
      .delete()
      .eq("id", searchId)
      .eq("user_id", user.id);

    if (deleteError) {
      console.error("delete my-searches DB error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete search" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("delete my-searches unexpected error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
