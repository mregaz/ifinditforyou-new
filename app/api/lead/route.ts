import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY;

// se c'è la chiave creo il client, altrimenti lo lascio null
const resend = RESEND_KEY ? new Resend(RESEND_KEY) : null;

export async function POST(req: NextRequest) {
  try {
    const { email, message } = await req.json();

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "EMAIL_REQUIRED" },
        { status: 400 }
      );
    }

    // invio email solo se hai messo la chiave
    if (resend) {
      await resend.emails.send({
        from: "iFindItForYou <noreply@ifinditforyou.com>",
        to: [email],
        subject: "Richiesta ricevuta",
        text:
          "Ciao! Ho ricevuto la tua richiesta.\n\n" +
          (message ? `Dettagli: ${message}` : "Nessun dettaglio aggiunto.") +
          "\n\nTi risponderò appena possibile.",
      });
    }

    // risposta al frontend
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("API /api/lead errore:", err);
    return NextResponse.json(
      { ok: false, error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
