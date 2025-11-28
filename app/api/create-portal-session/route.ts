import { NextResponse } from "next/server";
import Stripe from "stripe";

const secretKey =
  process.env.STRIPE_SECRET_KEYS || process.env.STRIPE_SECRET_KEY || "";

if (!secretKey) {
  console.error("Manca STRIPE_SECRET_KEYS / STRIPE_SECRET_KEY");
}

const stripe = new Stripe(secretKey || "sk_test_dummy" as string);

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = (body.email as string | undefined)?.trim();

    if (!email) {
      return NextResponse.json(
        { error: "Email utente non fornita." },
        { status: 400 }
      );
    }

    // 1) Troviamo il cliente Stripe con questa email
    const customers = await stripe.customers.list({
      email,
      limit: 1,
    });

    const customer = customers.data[0];

    if (!customer) {
      return NextResponse.json(
        {
          error:
            "Nessun cliente Stripe trovato per questa email. Verifica di avere un abbonamento attivo.",
        },
        { status: 404 }
      );
    }

    // 2) Calcoliamo l'URL di ritorno (pagina account)
    const rawAppUrl =
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const appUrl = rawAppUrl.trim().replace(/\/+$/, "");

    try {
      new URL(appUrl);
    } catch {
      return NextResponse.json(
        {
          error: `Configurazione NEXT_PUBLIC_APP_URL non valida: "${rawAppUrl}"`,
        },
        { status: 500 }
      );
    }

    // 3) Creiamo la sessione del Customer Portal
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${appUrl}/account`,
    });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (err: any) {
    console.error("Stripe error in create-portal-session:", err);
    return NextResponse.json(
      {
        error:
          "Stripe error: " +
          (err?.message ??
            "Errore sconosciuto nella creazione della sessione del portale."),
      },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: "Usa il metodo POST per creare una sessione del portale Stripe." },
    { status: 405 }
  );
}
