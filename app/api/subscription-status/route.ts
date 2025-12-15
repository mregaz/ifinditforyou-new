import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      return NextResponse.json({ plan: "free" });
    }

    const { data: userRow, error: userError } = await supabase
      .from("User")
      .select("is_pro, stripe_status, stripe_current_period_end, cancel_at_period_end")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userRow) {
      if (userError) console.error("subscription-status user error:", userError);
      return NextResponse.json({ plan: "free" });
    }

    const plan: "free" | "pro" = userRow.is_pro ? "pro" : "free";

    const renewsAt =
      userRow.stripe_current_period_end ? new Date(userRow.stripe_current_period_end).getTime() : undefined;

    return NextResponse.json({
      plan,
      status: userRow.stripe_status ?? undefined,
      renewsAt,
      cancelAtPeriodEnd: !!userRow.cancel_at_period_end,
    });
  } catch (error) {
    console.error("subscription-status fatal error:", error);
    return NextResponse.json({ plan: "free" });
  }
}
