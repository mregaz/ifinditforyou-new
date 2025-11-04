// app/api/lead/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "../../../lib/prisma";

const INTERNAL_NOTIFY_EMAIL = "info@ifinditforyou.com";

// contenuti auto-reply per 4 lingue
const autoReplyContent: Record<
  "it" | "en" | "fr" | "de",
  { subject: string; html: (name?: string) => string }
> = {
  it: {
    subject: "Grazie per averci contattato!",
    html: (name?: string) => `
      <p>Ciao ${name ?? ""},</p>
      <p>grazie per averci contattato su <strong>iFindItForYou</strong>! 👋</p>
      <p>Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.</p>
      <p style="font-size:12px;color:#777;">Se non sei stato tu a inviare questa richiesta, puoi ignorare questa email.</p>
    `,
  },
  en: {
    subject: "Thank you for contacting us!",
    html: (name?: string) => `
      <p>Hi ${name ?? ""},</p>
      <p>thank you for reaching out to <strong>iFindItForYou</strong>!</p>
      <p>We've received your message and will get back to you as soon as possible.</p>
    `,
  },
  fr: {
    subject: "Merci pour ton message !",
    html: (name?: string) => `
      <p>Salut ${name ?? ""},</p>
      <p>merci d’avoir contacté <strong>iFindItForYou</strong> 👋</p>
      <p>On a bien reçu ton message et on te répond au plus vite.</p>
    `,
  },
  de: {
    subject: "Danke für deine Anfrage!",
    html: (name?: string) => `
      <p>Hallo ${name ?? ""},</p>
      <p>danke, dass du <strong>iFindItForYou</strong> kontaktiert hast!</p>
      <p>Wir haben deine Nachricht erhalten und melden uns so schnell wie möglich.</p>
    `,
  },
};

export async function POST(req: Request) {
  const body = await req.json();

  const {
    email,
    message,
    lang = "it",
    name = "",
  }: {
    email?: string;
    message?: string;
    lang?: "it" | "en" | "fr" | "de";
    name?: string;
  } = body;

  // validazione base
  if (!email || !message) {
    return NextResponse.json(
      { ok: false, error: "Missing data" },
      { status: 400 }
    );
  }

  // rispondiamo subito alla UI
  const baseResponse = NextResponse.json({ ok: true }, { status: 200 });

  // 1) EMAIL (se c'è la chiave)
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const replyCfg = autoReplyContent[lang] ?? autoReplyContent.it;

      // mail all'utente
      await resend.emails.send({
        from: "iFindItForYou <no-reply@ifinditforyou.com>",
        to: email,
        subject: replyCfg.subject,
        html: replyCfg.html(name),
      });

      // mail interna a te
      await resend.emails.send({
        from: "iFindItForYou <no-reply@ifinditforyou.com>",
        to: INTERNAL_NOTIFY_EMAIL,
        subject: "Nuova richiesta dal sito",
        html: `
          <p>Nuovo lead dal sito:</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Lingua richiesta:</strong> ${lang}</p>
          <p><strong>Messaggio:</strong><br/>${message}</p>
        `,
      });
    } catch (err) {
      console.warn("⚠️ Errore invio email (continuo lo stesso):", err);
    }
  } else {
    console.warn("⚠️ RESEND_API_KEY non presente: salto invio email.");
  }

  // 2) SALVATAGGIO (solo se hai il DB)
  if (process.env.DATABASE_URL) {
    try {
      await prisma.lead.create({
        data: {
          email,
          message,
          lang,
          name,
        },
      });
    } catch (err) {
      console.warn("⚠️ Errore salvataggio su Prisma:", err);
    }
  } else {
    console.warn("⚠️ DATABASE_URL non presente: salto salvataggio.");
  }

  return baseResponse;
}


