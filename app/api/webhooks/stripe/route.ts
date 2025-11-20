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

        // 🔑 Assunzione: quando crei la checkout session
        // passi userId in metadata (metadata: { userId })
        const metaUserId = session.metadata?.userId ?? null;

        // Fallback: usiamo l'email se non abbiamo userId in metadata
        const email =
          session.customer_details?.email || session.customer_email || undefined;

        const amountTotal = session.amount_total ?? 0;

        let userId: string | null = metaUserId;

        // Se non abbiamo userId ma abbiamo l'email → upsert user
        if (!userId && email) {
          const user = await prisma.user.upsert({
            where: { email },
            update: {}, // esiste già, non tocchiamo altro qui
            create: {
              email,
              credits: 0,
              plan: "free", // verrà aggiornato subito dopo a "pro"
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

        // 1️⃣ Salviamo il pagamento
        await prisma.payment.create({
          data: {
            userId,
            stripeSessionId: session.id,
            amount: amountTotal,
            creditsGranted: 0, // se in futuro vuoi dare crediti, aggiorna qui
          },
        });

        // 2️⃣ Aggiorniamo il piano a PRO
        await prisma.user.update({
          where: { id: userId },
          data: { plan: "pro" },
        });

        console.log(`✅ Utente ${userId} aggiornato a PRO da Stripe webhook`);
        break;
      }

      default:
        // Per ora ignoriamo gli altri eventi, ma puoi loggarli se vuoi
        // console.log(`Unhandled Stripe event type: ${event.type}`);
        break;
    }

    return new NextResponse("ok", { status: 200 });
  } catch (err) {
    console.error("❌ Errore nel gestire l'evento Stripe:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }
}
