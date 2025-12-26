// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// --- Env (server-only) ---
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Nota: nel codice NON usiamo "!" perché in build può rompere TS.
// Facciamo guard nella POST.
const webhookSecretEnv = process.env.STRIPE_WEBHOOK_SECRET;

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseServiceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

// Supabase admin client (service role) — bypassa RLS (va bene per webhook server)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- DB helpers (profiles) ---
async function setProByUserId(userId: string, isPro: boolean) {
  const { error } = await supabase.from("profiles").update({ is_pro: isPro }).eq("id", userId);
  if (error) throw error;
}

async function setProByEmail(email: string, isPro: boolean) {
  const { error } = await supabase.from("profiles").update({ is_pro: isPro }).eq("email", email);
  if (error) throw error;
}

async function saveStripeCustomerId(userId: string, stripeCustomerId: string) {
  const { error } = await supabase
    .from("profiles")
    .update({ stripe_customer_id: stripeCustomerId })
    .eq("id", userId);

  if (error) {
    console.error("❌ Error saving stripe_customer_id:", error);
  } else {
    console.log("✅ Saved stripe_customer_id for user:", userId);
  }
}

export async function POST(req: NextRequest) {
  // --- Guards ---
  const signature = req.headers.get("stripe-signature");
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const webhookSecret = webhookSecretEnv;
  if (!webhookSecret) return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });

  // IMPORTANT: raw body for signature verification
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Stripe signature verification failed:", err?.message || err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Extra safety: se payment_status non è "paid", non upgrade.
        // (Per subscription, spesso invoice_* arriva dopo; qui lo lasciamo prudente.)
        if (session.payment_status && session.payment_status !== "paid") {
          console.log("ℹ️ checkout.session.completed but payment_status != paid:", session.payment_status);
          break;
        }

        // Preferibile: userId dal tuo app (client_reference_id o metadata)
        const userId =
          session.client_reference_id ||
          session.metadata?.user_id ||
          session.metadata?.userId ||
          null;

        // stripe customer id
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;

        // salva stripe_customer_id se possibile
        if (userId && stripeCustomerId) {
          await saveStripeCustomerId(userId, stripeCustomerId);
        }

        // upgrade PRO
        if (userId) {
          console.log("✅ Set is_pro = TRUE for user id:", userId);
          await setProByUserId(userId, true);
          break;
        }

        // fallback: email
        const email = session.customer_details?.email ?? session.customer_email ?? null;
        if (!email) {
          console.warn("⚠️ checkout.session.completed without userId and without email");
          break;
        }

        console.log("✅ Set is_pro = TRUE for email:", email);
        await setProByEmail(email, true);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const isActive = sub.status === "active" || sub.status === "trialing";

        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        // BEST: match su stripe_customer_id in profiles
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id,email")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (error) console.error("❌ profiles lookup by stripe_customer_id failed:", error);

        if (profile?.id) {
          console.log(`✅ subscription.updated → set is_pro = ${isActive} for user id:`, profile.id);
          await setProByUserId(profile.id, isActive);
          break;
        }

        // fallback: retrieve customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as any).email ?? (customer as any).metadata?.email ?? null;

        if (!email) {
          console.warn("⚠️ subscription.updated: cannot resolve email");
          break;
        }

        console.log(`✅ subscription.updated → set is_pro = ${isActive} for email:`, email);
        await setProByEmail(email, isActive);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        // BEST: match su stripe_customer_id
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id,email")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (error) console.error("❌ profiles lookup by stripe_customer_id failed:", error);

        if (profile?.id) {
          console.log("⚠️ subscription.deleted → set is_pro = FALSE for user id:", profile.id);
          await setProByUserId(profile.id, false);
          break;
        }

        // fallback: retrieve customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email = (customer as any).email ?? (customer as any).metadata?.email ?? null;

        if (!email) {
          console.warn("⚠️ subscription.deleted: cannot resolve email");
          break;
        }

        console.log("⚠️ subscription.deleted → set is_pro = FALSE for email:", email);
        await setProByEmail(email, false);
        break;
      }

      default:
        console.log("ℹ️ Stripe event ignored:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook handler error:", err?.message || err);
    // 500 => Stripe ritenta
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
