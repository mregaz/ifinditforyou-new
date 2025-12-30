import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = {
    id: user.id,
    email: user.email ?? null,
    plan: "free",
    is_pro: false,
    updatedAt: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("User")
    .upsert(payload, { onConflict: "id" })
    .select("id, email, plan, is_pro")
    .maybeSingle();

  if (error) {
    console.error("❌ ensure user error:", error);
    return NextResponse.json({ error: "DB error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, user: data });
}
