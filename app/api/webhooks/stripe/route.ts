// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// --- Env ---
const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");


if (!supabaseUrl) throw new Error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseServiceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

// Supabase admin client (service role)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// --- DB helpers (profiles) ---
async function setProByUserId(userId: string, isPro: boolean) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_pro: isPro })
    .eq("id", userId);

  if (error) throw error;
}

async function setProByEmail(email: string, isPro: boolean) {
  const { error } = await supabase
    .from("profiles")
    .update({ is_pro: isPro })
    .eq("email", email);

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
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing stripe-signature", { status: 400 });
  }

  // IMPORTANT: raw body for signature verification
  const body = await req.text();

  let event: Stripe.Event;
 const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";
if (!webhookSecret) {
  return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
}

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

        // Safety: upgrade only when paid (for one-time payments). For subscriptions, invoice events exist.
        if (session.payment_status && session.payment_status !== "paid") {
          console.log(
            "ℹ️ checkout.session.completed but payment_status != paid:",
            session.payment_status
          );
          break;
        }

        // Best: userId from your app
        const userId =
          session.client_reference_id ||
          session.metadata?.user_id ||
          session.metadata?.userId ||
          null;

        // Stripe customer id (string in most cases)
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;

        // Save stripe_customer_id if possible
        if (userId && stripeCustomerId) {
          await saveStripeCustomerId(userId, stripeCustomerId);
        }

        // Upgrade PRO
        if (userId) {
          console.log("✅ Set is_pro = TRUE for user id:", userId);
          await setProByUserId(userId, true);
          break;
        }

        // Fallback: email
        const email =
          session.customer_details?.email ?? session.customer_email ?? null;

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

        // BEST: update by stripe_customer_id if you have it in profiles
        const { data: profileByCustomer, error: findErr } = await supabase
          .from("profiles")
          .select("id,email")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (findErr) {
          console.error("❌ profiles lookup by stripe_customer_id failed:", findErr);
        }

        if (profileByCustomer?.id) {
          console.log(
            `✅ subscription.updated → set is_pro = ${isActive} for user id:`,
            profileByCustomer.id
          );
          await setProByUserId(profileByCustomer.id, isActive);
          break;
        }

        // Fallback: retrieve customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email =
          (customer as any).email ?? (customer as any).metadata?.email ?? null;

        if (!email) {
          console.warn("⚠️ subscription.updated: cannot resolve email");
          break;
        }

        console.log(
          `✅ subscription.updated → set is_pro = ${isActive} for email:`,
          email
        );
        await setProByEmail(email, isActive);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;

        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        // BEST: update by stripe_customer_id
        const { data: profileByCustomer, error: findErr } = await supabase
          .from("profiles")
          .select("id,email")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (findErr) {
          console.error("❌ profiles lookup by stripe_customer_id failed:", findErr);
        }

        if (profileByCustomer?.id) {
          console.log("⚠️ subscription.deleted → set is_pro = FALSE for user id:", profileByCustomer.id);
          await setProByUserId(profileByCustomer.id, false);
          break;
        }

        // Fallback: retrieve customer email
        const customer = await stripe.customers.retrieve(customerId);
        const email =
          (customer as any).email ?? (customer as any).metadata?.email ?? null;

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
    // 500 so Stripe retries
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
