// app/api/lead/route.ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

async function askFinder(query: string, lang: string) {
  try {
    const baseUrl = process.env.APP_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/finder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, lang }),
    });

    if (!res.ok) return { ok: false, data: null };

    const data = await res.json();

    // proviamo a decodificare in modo elastico
    let parsed: any = null;
    try {
      parsed = typeof data.data === "string" ? JSON.parse(data.data) : data.data;
    } catch {
      parsed = data.data ?? data;
    }

    return { ok: true, data: parsed };
  } catch (err) {
    console.error("finder error", err);
    return { ok: false, data: null };
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = (body.email as string | undefined)?.trim();
    const message = (body.message as string | undefined)?.trim();
    const lang = (body.lang as string | undefined) ?? "it";

    if (!email) {
      return NextResponse.json({ error: "email mancante" }, { status: 400 });
    }

    // provo a chiedere alla mia AI
    const finderResult =
      message && message.length > 0
        ? await askFinder(message, lang)
        : { ok: false, data: null };

    // testo base per la mail
    let subject = "";
    let intro = "";
    let bodyText = "";

    if (lang === "it") {
      subject = "Ho ricevuto la tua richiesta 👍";
      intro = "Ciao! Ho ricevuto la tua richiesta su iFindItForYou.";
      bodyText = message ? `Hai scritto: ${message}` : "";
    } else if (lang === "fr") {
      subject = "J’ai bien reçu ta demande 👍";
      intro = "Salut ! J’ai bien reçu ta demande sur iFindItForYou.";
      bodyText = message ? `Tu as écrit : ${message}` : "";
    } else if (lang === "de") {
      subject = "Ich habe deine Anfrage erhalten 👍";
      intro = "Hallo! Ich habe deine Anfrage auf iFindItForYou erhalten.";
      bodyText = message ? `Du hast geschrieben: ${message}` : "";
    } else {
      subject = "I got your request 👍";
      intro = "Hi! I received your request on iFindItForYou.";
      bodyText = message ? `You wrote: ${message}` : "";
    }

    // parte dei risultati AI (se c’è)
    let aiPart = "";
    if (finderResult.ok && finderResult.data) {
      const d = finderResult.data;
      const items = Array.isArray(d.items) ? d.items : [];
      aiPart += "\n\n";
      aiPart +=
        lang === "it"
          ? "Ho già provato a cercare qualcosa per te:"
          : lang === "fr"
          ? "J’ai déjà cherché pour toi :"
          : lang === "de"
          ? "Ich habe schon etwas für dich gesucht:"
          : "I already tried to find something for you:";
      items.forEach((item: any, idx: number) => {
        aiPart += `\n${idx + 1}) ${item.title ?? "Senza titolo"}${
          item.price ? " — " + item.price : ""
        }${item.source ? " — " + item.source : ""}`;
      });
      if (d.summary) {
        aiPart += "\n\n" + d.summary;
      }
    } else {
      aiPart +=
        lang === "it"
          ? "\n\nNon sono riuscito a fare la ricerca automatica ora, ti risponderò manualmente."
          : lang === "fr"
          ? "\n\nJe n’ai pas pu faire la recherche automatique, je te répondrai manuellement."
          : lang === "de"
          ? "\n\nDie automatische Suche hat nicht geklappt, ich antworte dir manuell."
          : "\n\nI couldn’t finish the automatic search, I will reply manually.";
    }

    await resend.emails.send({
      from: "iFindItForYou <noreply@ifinditforyou.com>",
      to: email,
      subject,
      text: `${intro}\n\n${bodyText}${aiPart}\n\n— iFindItForYou`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lead error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}

