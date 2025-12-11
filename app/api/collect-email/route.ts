// app/api/collect-email/route.ts
import { NextResponse } from "next/server";

type Body = {
  email?: string;
};

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    console.log("[collect-email] Richiesta ricevuta");

    const body = (await req.json()) as Body;

    if (!body.email || typeof body.email !== "string") {
      console.error("[collect-email] Email mancante o non valida:", body);
      return NextResponse.json(
        { error: "Email mancante o non valida." },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();

    // Qui in futuro salveremo nel DB; per ora solo log
    console.log("[collect-email] Nuova email lead:", email);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[collect-email] Errore nel parsing della richiesta:", err);
    return NextResponse.json(
      { error: "Richiesta non valida." },
      { status: 400 }
    );
  }
}

