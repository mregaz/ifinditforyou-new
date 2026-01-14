// app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-12-15.clover",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

function getUserIdFromSession(session: Stripe.Checkout.Session): string | null {
  const fromRef =
    typeof session.client_reference_id === "string" && session.client_reference_id
      ? session.client_reference_id
      : null;

  const fromMeta =
    typeof session.metadata?.supabase_user_id === "string" && session.metadata.supabase_user_id
      ? session.metadata.supabase_user_id
      : null;

  return fromRef || fromMeta || null;
}

export async function POST(req: Request) {
  // 1) headers + secret
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = (process.env.STRIPE_WEBHOOK_SECRET ?? "").trim();

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  // 2) RAW body (Byte-perfect)
  const buf = Buffer.from(await req.arrayBuffer());

  // 3) verify signature
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret) as Stripe.Event;
  } catch (err: any) {
    console.error("Invalid Stripe signature:", err?.message ?? err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 4) handle events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("WS checkout.session.completed", {
          sessionId: session.id,
          client_reference_id: session.client_reference_id,
          metadata: session.metadata,
          customer: session.customer,
        });

        const userId = getUserIdFromSession(session);
        if (!userId) {
          console.error("WS: missing userId in session");
          break;
        }

        const stripeCustomerId =
          typeof session.customer === "string" ? session.customer : null;
        if (!stripeCustomerId) {
          console.error("WS: missing stripe customer id on session");
          break;
        }

        const billingPeriod =
          (typeof session.metadata?.billing_period === "string" &&
            session.metadata.billing_period) ||
          "monthly";

        // A) update mapping in "User"
        const map = await supabaseAdmin
          .from("User")
          .update({ stripe_customer_id: stripeCustomerId })
          .eq("id", userId);

        if (map.error) {
          console.error("WS update User error:", map.error);
          throw map.error;
        }

        // B) upsert entitlements
        const up = await supabaseAdmin.from("entitlements").upsert({
          user_id: userId,
          plan: billingPeriod === "yearly" ? "pro_yearly" : "pro_monthly",
          is_pro: true,
          credits_balance: 100,
          updated_at: new Date().toISOString(),
        });

        if (up.error) {
          console.error("WS upsert entitlements error:", up.error);
          throw up.error;
        }

        console.log("✅ WS: entitlements updated", { userId, billingPeriod });
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        console.log("WS customer.subscription.deleted", {
          id: sub.id,
          customer: sub.customer,
          status: sub.status,
        });
        // downgrade (lo facciamo dopo)
        break;
      }

    case "invoice.payment_succeeded": {
  const invoice = event.data.object as Stripe.Invoice;

  console.log("WS invoice.payment_succeeded", {
    id: invoice.id,
    customer: invoice.customer,
    billing_reason: (invoice as any).billing_reason,
    paid: (invoice as any).paid,
    total: (invoice as any).total,
  });

  break;
}


      default: {
        console.log("WS event received:", event.type);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook handler error:", err?.message ?? err);
    return NextResponse.json(
      { error: err?.message ?? "Webhook handler error" },
      { status: 500 }
    );
  }
}
