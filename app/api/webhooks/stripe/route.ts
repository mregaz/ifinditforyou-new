// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Supabase admin client (service role key → NECESSARIA)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Errore verifica firma Stripe:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      /**************************************************
       * 1) UTENTE DIVENTA PRO  → checkout.session.completed
       **************************************************/
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // Email dell'acquirente
        const email =
          session.customer_details?.email ??
          session.customer_email ??
          null;

        if (!email) {
          console.error("❌ checkout.session.completed SENZA EMAIL");
          break;
        }

        console.log("✅ Imposto is_pro = TRUE per utente:", email);

        const { error } = await supabase
          .from("User")
          .update({ is_pro: true })
          .eq("email", email);

        if (error) {
          console.error("❌ Errore aggiornando is_pro = true:", error);
        }

        break;
      }

      /**************************************************
       * 2) ABBONAMENTO CANCELLATO → customer.subscription.deleted
       **************************************************/
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Stripe NON include l'email qui in automatico.
        // Recuperiamo l'email dal customer → chiamata API extra.
        const customerId = subscription.customer;

        if (!customerId) {
          console.warn("⚠️ subscription.deleted senza customerId");
          break;
        }

        // Recupero oggetto customer da Stripe
        const customer = await stripe.customers.retrieve(customerId as string);

        const email =
          (customer as any).email ??
          (customer as any).metadata?.email ??
          null;

        if (!email) {
          console.warn("⚠️ impossibile ottenere email per subscription.deleted");
          break;
        }

        console.log("⚠️ Imposto is_pro = FALSE per utente:", email);

        const { error } = await supabase
          .from("User")
          .update({ is_pro: false })
          .eq("email", email);

        if (error) {
          console.error("❌ Errore aggiornando is_pro = false:", error);
        }

        break;
      }

      /**************************************************
       * 3) Eventi ignorati
       **************************************************/
      default:
        console.log("ℹ️ Evento Stripe ignorato:", event.type);
    }
  } catch (err) {
    console.error("❌ Errore interno webhook Stripe:", err);
  }

  return NextResponse.json({ received: true });
}
