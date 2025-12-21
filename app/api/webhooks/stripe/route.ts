import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

export const runtime = "nodejs";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!supabaseUrl) throw new Error("Missing SUPABASE_URL / NEXT_PUBLIC_SUPABASE_URL");
if (!supabaseServiceRoleKey) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!webhookSecret) throw new Error("Missing STRIPE_WEBHOOK_SECRET");

// Supabase admin client (service role key)
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function setProByUserId(userId: string, isPro: boolean) {
  const { error } = await supabase.from("User").update({ is_pro: isPro }).eq("id", userId);
  if (error) throw error;
}

async function setProByEmail(email: string, isPro: boolean) {
  const { error } = await supabase.from("User").update({ is_pro: isPro }).eq("email", email);
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
  if (!signature) return new NextResponse("Missing stripe-signature", { status: 400 });

  const body = await req.text();
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
if (!webhookSecret) {
  throw new Error("Missing STRIPE_WEBHOOK_SECRET");
}

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

        // Extra safety: if payment is not settled yet, don’t upgrade here.
        if (session.payment_status && session.payment_status !== "paid") {
          console.log(
            "ℹ️ checkout.session.completed but payment_status != paid:",
            session.payment_status
          );
          break;
        }

        // Prefer stable user id coming from your app
        const userId =
          session.client_reference_id ||
          session.metadata?.user_id ||
          session.metadata?.userId ||
          null;

        // Save stripe_customer_id to profiles if possible
        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;

        if (userId && stripeCustomerId) {
          await saveStripeCustomerId(userId, stripeCustomerId);
        }

        if (userId) {
          console.log("✅ Set is_pro = TRUE for user id:", userId);
          await setProByUserId(userId, true);
          break;
        }

        // Fallback to email (less reliable)
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

        // Consider “active” and “trialing” as pro
        const isActive = sub.status === "active" || sub.status === "trialing";

        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer.id;

        // If you store stripe_customer_id in DB, this is the best key.
        // Here we fallback via customer -> email (extra API call).
        const customer = await stripe.customers.retrieve(customerId);
        const email =
          (customer as any).email ?? (customer as any).metadata?.email ?? null;

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
    // Return 500 so Stripe retries (useful if DB was temporarily down).
    console.error("❌ Webhook handler error:", err?.message || err);
    return new NextResponse("Webhook handler error", { status: 500 });
  }
}
