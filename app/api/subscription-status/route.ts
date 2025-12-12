import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (!user || authError) {
      // Utente non loggato → per sicurezza consideriamo Free
      return NextResponse.json({ plan: "free" });
    }

    const { data: userRow, error: userError } = await supabase
      .from("User")
      .select("is_pro, stripe_customer_id")
      .eq("id", user.id)
      .maybeSingle();

    if (userError) {
      console.error("subscription-status user error:", userError);
    }

    if (!userRow) {
      return NextResponse.json({ plan: "free" });
    }

    // Piano di base da DB (fallback)
    let plan: "free" | "pro" = userRow.is_pro ? "pro" : "free";

    // Se non abbiamo customer Stripe → andiamo solo a is_pro
    if (!userRow.stripe_customer_id) {
      return
