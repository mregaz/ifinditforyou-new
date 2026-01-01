import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ ok: false, error: "Missing userId" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("User")
      .update({ is_pro: true, plan: "pro", stripe_status: "active" })
      .eq("id", userId)
      .select("id, email, is_pro, plan, stripe_status")
      .maybeSingle();

    if (error) {
      console.error("make-pro error:", error);
      return NextResponse.json({ ok: false, error }, { status: 500 });
    }

    return NextResponse.json({ ok: true, data });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Unexpected" }, { status: 500 });
  }
}
