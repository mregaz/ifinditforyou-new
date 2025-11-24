// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Supabase admin client (usa la service role key)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", {
      status: 400,
    });
  }

  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (err: any) {
    console.error("❌ Errore verifica firma Stripe:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const email =
          session.customer_details?.email ?? session.customer_email;

        if (!email) {
          console.error(
            "❌ checkout.session.completed senza email, impossibile aggiornare is_pro"
          );
          break;
        }

        console.log("✅ Imposto is_pro = true per utente con email:", email);

        const { error } = await supabase
          .from("User") // nome tabella: quella dove hai aggiunto is_pro
          .update({ is_pro: true })
          .eq("email", email);

        if (error) {
          console.error("❌ Errore aggiornando is_pro a true:", error);
        }

        break;
      }

      case "customer.subscription.deleted":
      case "customer.subscription.canceled": {
        const subscription = event.data.object as Stripe.Subscription;
        const email = (subscription as any).customer_email as
          | string
          | null;

        if (!email) {
          console.warn(
            "⚠️ subscription deleted senza email in metadata/customer_email"
          );
          break;
        }

        console.log("⚠️ Imposto is_pro = false per utente con email:", email);

        const { error } = await supabase
          .from("User")
          .update({ is_pro: false })
          .eq("email", email);

        if (error) {
          console.error("❌ Errore aggiornando is_pro a false:", error);
        }

        break;
      }

      default: {
        // Per ora ignoriamo gli altri eventi
        console.log("ℹ️ Evento Stripe ignorato:", event.type);
      }
    }
  } catch (err) {
    console.error("❌ Errore interno nel webhook Stripe:", err);
  }

  return NextResponse.json({ received: true });
}
