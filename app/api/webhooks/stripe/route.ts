import Stripe from "stripe";
import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // evita tentativi di pre-render

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function getStripe(): Stripe {
  return new Stripe(getEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2025-12-15.clover",
  });
}

function getSupabaseAdmin() {
  return createClient(getEnv("SUPABASE_URL"), getEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

function getUserIdFromSession(session: Stripe.Checkout.Session): string | null {
  return session.metadata?.user_id || session.client_reference_id || null;
}

export async function POST(req: Request) {
  const sig = (await headers()).get("stripe-signature");
  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  const rawBody = await req.text();

  const stripe = getStripe();
  const supabaseAdmin = getSupabaseAdmin();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      getEnv("STRIPE_WEBHOOK_SECRET")
    );
  } catch (err: any) {
    return new Response(`Webhook signature verification failed: ${err.message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const userId = getUserIdFromSession(session);
        if (!userId) throw new Error("Missing user_id in metadata/client_reference_id");

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;
        if (!stripeCustomerId) throw new Error("Missing session.customer");

        // salva mapping su public."User"
        const { error: mapErr } = await supabaseAdmin
          .from("User")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", userId);

        if (mapErr) throw mapErr;

        // aggiorna entitlements
        const { error: entErr } = await supabaseAdmin
          .from("entitlements")
          .upsert({
            user_id: userId,
            plan: "pro",
            is_pro: true,
            credits_balance: 100,
            updated_at: new Date().toISOString(),
          });

        if (entErr) throw entErr;

        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId =
          typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;
        if (!customerId) throw new Error("Missing invoice.customer");

        const { data: userRow, error: userErr } = await supabaseAdmin
          .from("User")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (userErr) throw userErr;
        if (!userRow?.id) break;

        const { error: entErr } = await supabaseAdmin
          .from("entitlements")
          .upsert({
            user_id: userRow.id,
            plan: "pro",
            is_pro: true,
            credits_balance: 100, // reset mensile
            updated_at: new Date().toISOString(),
          });

        if (entErr) throw entErr;

        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const customerId =
          typeof sub.customer === "string" ? sub.customer : sub.customer?.id;
        if (!customerId) break;

        const { data: userRow, error: userErr } = await supabaseAdmin
          .from("User")
          .select("id")
          .eq("stripe_customer_id", customerId)
          .maybeSingle();

        if (userErr) throw userErr;
        if (!userRow?.id) break;

        const { error: entErr } = await supabaseAdmin
          .from("entitlements")
          .upsert({
            user_id: userRow.id,
            plan: "free",
            is_pro: false,
            updated_at: new Date().toISOString(),
          });

        if (entErr) throw entErr;

        break;
      }

      default:
        break;
    }

    return new Response("ok", { status: 200 });
  } catch (err: any) {
    return new Response(`Webhook handler error: ${err.message}`, { status: 500 });
  }
}
