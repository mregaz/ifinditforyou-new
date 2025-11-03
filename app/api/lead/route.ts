// app/api/lead/route.ts
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '../../../lib/prisma';


const resend = new Resend(process.env.RESEND_API_KEY);

// Email interna dove ricevi le notifiche
const INTERNAL_NOTIFY_EMAIL = 'info@ifinditforyou.com';

const autoReplyContent: Record<
  string,
  { subject: string; html: (name?: string) => string }
> = {
  it: {
    subject: 'Grazie per averci contattato!',
    html: (name?: string) => `
      <p>Ciao ${name ?? ''},</p>
      <p>grazie per averci contattato su <strong>iFindItForYou</strong>! 🎯</p>
      <p>Abbiamo ricevuto il tuo messaggio e ti risponderemo al più presto.</p>
      <br/>
      <p>Il team di <strong>iFindItForYou</strong></p>
      <p style="font-size:12px;color:#777;">Se non sei stato tu a inviare questa richiesta, puoi ignorare questa email.</p>
    `,
  },
  en: {
    subject: 'Thank you for contacting us!',
    html: (name?: string) => `
      <p>Hi ${name ?? ''},</p>
      <p>thank you for reaching out to <strong>iFindItForYou</strong>! 🎯</p>
      <p>We've received your message and will get back to you as soon as possible.</p>
      <br/>
      <p>The <strong>iFindItForYou</strong> team</p>
      <p style="font-size:12px;color:#777;">If you didn’t submit this request, you can ignore this email.</p>
    `,
  },
  fr: {
    subject: 'Merci de nous avoir contactés !',
    html: (name?: string) => `
      <p>Bonjour ${name ?? ''},</p>
      <p>merci d'avoir contacté <strong>iFindItForYou</strong> ! 🎯</p>
      <p>Nous avons bien reçu votre message et nous vous répondrons dès que possible.</p>
      <br/>
      <p>L’équipe <strong>iFindItForYou</strong></p>
      <p style="font-size:12px;color:#777;">Si vous n’êtes pas à l’origine de cette demande, vous pouvez ignorer cet e-mail.</p>
    `,
  },
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // accetta più nomi per il campo messaggio (per tolleranza con il form)
    const {
      name,
      email,
      message,
      msg,
      text,
      question,
      descrizione,
      lang,
    }: {
      name?: string;
      email?: string;
      message?: string;
      msg?: string;
      text?: string;
      question?: string;
      descrizione?: string;
      lang?: string;
    } = body || {};

    const userMessage =
      message ?? msg ?? text ?? question ?? descrizione ?? '';

    if (!email || !userMessage) {
      console.error('Missing data. Body received:', body);
      return NextResponse.json(
        { error: 'Missing required fields: email or message' },
        { status: 400 }
      );
    }

    const safeLang =
      lang && ['it', 'en', 'fr'].includes(lang.toLowerCase())
        ? lang.toLowerCase()
        : 'it';

    // 1) salva nel DB
    const savedLead = await prisma.lead.create({
      data: {
        name: name ?? null,
        email,
        message: userMessage,
        lang: safeLang,
      },
    });

    // 2) email interna a te
    await resend.emails.send({
      from: 'iFindItForYou <noreply@ifinditforyou.com>',
      to: INTERNAL_NOTIFY_EMAIL,
      subject: 'Nuovo lead dal sito iFindItForYou',
      html: `
        <p><strong>Lead ID:</strong> ${savedLead.id}</p>
        <p><strong>Nome:</strong> ${name ?? '(non fornito)'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Lingua:</strong> ${safeLang}</p>
        <p><strong>Messaggio:</strong></p>
        <p style="white-space:pre-line">${userMessage}</p>
        <hr/>
        <p><small>Arrivato il ${savedLead.createdAt.toISOString()}</small></p>
      `,
    });

    // 3) auto-risposta all’utente
    const replyCfg = autoReplyContent[safeLang];
    await resend.emails.send({
      from: 'iFindItForYou <noreply@ifinditforyou.com>',
      to: email,
      subject: replyCfg.subject,
      html: replyCfg.html(name),
      replyTo: 'info@ifinditforyou.com', // <-- corretto (non reply_to)
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('POST /api/lead error:', err);
    return NextResponse.json(
      { error: 'Errore durante l’invio o il salvataggio del lead' },
      { status: 500 }
    );
  }
}

