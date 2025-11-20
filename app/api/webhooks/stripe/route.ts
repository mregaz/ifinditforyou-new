// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

// Assicuriamoci di usare runtime Node (non Edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing stripe-signature header", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error("❌ Stripe webhook signature verification failed:", err?.message);
    return new NextResponse(`Webhook Error: ${err?.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        // 1️⃣ Recupero metadata
        const metaUserId = session.metadata?.userId ?? null;

        // 2️⃣ Fallback email
        const email =
          session.customer_details?.email ||
          session.customer_email ||
          undefined;

        const amountTotal = session.amount_total ?? 0;

        let userId: string | null = metaUserId;

        // 3️⃣ Se manca userId ma abbiamo email → upsert user
        if (!userId && email) {
          const user = await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
              email,
              credits: 0,
              plan: "free",
            },
          });
          userId = user.id;
        }

        if (!userId) {
          console.warn(
            "⚠️ checkout.session.completed senza userId né email, impossibile collegare il pagamento"
          );
          break;
        }

        // 4️⃣ Salviamo il pagamento
        await prisma.payment.upsert({
          where: { stripeSessionId: session.id },
          update: {},
          create: {
            userId,
            stripeSessionId: session.id,
            amount: amountTotal,
            creditsGranted: 0,
          },
        });

        // 5️⃣ Aggiorniamo il piano a PRO
        await prisma.user.update({
          where: { id: userId },
          data: { plan: "pro" },
        });

        console.log(`✅ Utente ${userId} aggiornato a PRO!`);
        break;
      }

      default:
        // altri eventi ignorati
        break;
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("❌ Errore nel webhook Stripe:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
