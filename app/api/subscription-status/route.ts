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

    const { data: profile, error } = await supabase
      .from("User")
      .select("is_pro, stripe_status, cancel_at_period_end, current_period_end, plan")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("subscription-status DB error:", error);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    return NextResponse.json({
      isPro: !!profile?.is_pro,
      plan: profile?.plan ?? "free",
      stripeStatus: profile?.stripe_status ?? null,
      cancelAtPeriodEnd: !!profile?.cancel_at_period_end,
      currentPeriodEnd: profile?.current_period_end ?? null,
    });
  } catch (err: any) {
    console.error("subscription-status unexpected:", err);
    return NextResponse.json(
      { error: err?.message ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
