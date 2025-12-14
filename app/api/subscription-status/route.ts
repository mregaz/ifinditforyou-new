import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";

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
      .select("is_pro, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError || !userRow) {
      if (userError) {
        console.error("subscription-status user error:", userError);
      }
      return NextResponse.json({ plan: "free" });
    }

    // Piano base da DB
    let plan: "free" | "pro" = userRow.is_pro ? "pro" : "free";
    let status: string | undefined;
    let renewsAt: number | undefined;

    // Se non abbiamo customer Stripe → usiamo solo is_pro
    if (!userRow.stripe_customer_id) {
      return NextResponse.json({ plan });
    }

    // Se abbiamo Stripe, proviamo a leggere la subscription
    try {
      const subs = await stripe.subscriptions.list({
        customer: userRow.stripe_customer_id,
        status: "all",
        limit: 1,
      });

      const sub = subs.data[0];

      if (sub && sub.status === "active") {
        plan = "pro";
        status = sub.status;

        // current_period_end non è tipizzato, quindi usiamo any
        const periodEnd = (sub as any).current_period_end;
        if (typeof periodEnd === "number") {
          renewsAt = periodEnd * 1000;
        }
      } else if (sub) {
        status = sub.status;
      }
    } catch (stripeError) {
      console.error("subscription-status stripe error:", stripeError);
      // In caso di errore Stripe, restiamo sul piano da DB
    }

    return NextResponse.json({ plan, status, renewsAt });
  } catch (error) {
    console.error("subscription-status fatal error:", error);
    return NextResponse.json({ plan: "free" });
  }
}
