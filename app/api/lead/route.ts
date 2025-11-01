import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Inizializza Resend con la tua API key da Vercel
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Email del destinatario
const DESTINATION_EMAIL = "info@ifinditforyou.com";

// ✅ Mittente (funziona dopo la verifica del dominio su Resend)
//   Se non ancora verificato, puoi temporaneamente usare:
//   "onboarding@resend.dev"
const FROM_EMAIL = "noreply@ifinditforyou.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, details, lastQuery } = body || {};

    // Validazione base
    if (!email || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing_email" },
        { status: 400 }
      );
    }

    // Costruisci il contenuto dell’email
    const text = [
      `🔥 NUOVO LEAD dal sito ifinditforyou.com`,
      ``,
      `Contatto: ${email}`,
      details ? `Dettagli utente: ${details}` : `Dettagli utente: (nessuno)`,
      lastQuery
        ? `Ultima ricerca dell'utente: ${lastQuery}`
        : `Ultima ricerca dell'utente: (non presente)`,
      ``,
      `Data: ${new Date().toLocaleString("it-CH")}`,
    ].join("\n");

    // Invia l'email con Resend
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



