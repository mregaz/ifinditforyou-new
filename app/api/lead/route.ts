import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Inizializza Resend con la tua API key da Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

// Email che deve ricevere le richieste dal form
const DESTINATION_EMAIL = "info@ifinditforyou.com";

// Mittente (deve essere su un dominio verificato in Resend)
const FROM_EMAIL = "noreply@ifinditforyou.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, details, lastQuery } = body || {};

    // Controllo minimo: serve almeno un contatto
    if (!email || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing_email" },
        { status: 400 }
      );
    }

    // Corpo dell'email che ricevi tu
    const text = [
      `🔥 NUOVO LEAD dal sito ifinditforyou.com`,
      ``,
      `Contatto lasciato dall'utente: ${email}`,
      details
        ? `Dettagli utente: ${details}`
        : `Dettagli utente: (nessuno fornito)`,
      lastQuery
        ? `Ultima ricerca fatta sul sito: ${lastQuery}`
        : `Ultima ricerca fatta sul sito: (non presente)`,
      ``,
      `Data: ${new Date().toLocaleString("it-CH")}`,
    ].join("\n");

    // Invio email a te
    const result = await resend.emails.send({
      from: `ifinditforyou <${FROM_EMAIL}>`,
      to: [DESTINATION_EMAIL],
      subject: "Nuovo lead dal sito ifinditforyou.com",
      text,
    });

    console.log("✅ Email inviata con successo:", result?.data?.id || result);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Errore in /api/lead:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}


