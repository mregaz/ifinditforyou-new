import { NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma"; // <-- controlla il path del tuo prisma

const resend = new Resend(process.env.RESEND_API_KEY);

// helper: cerca di chiamare l'AI interna
async function askFinder(query: string, lang: string) {
  try {
    // se hai già la route /api/finder in questo stesso progetto,
    // la possiamo chiamare così.
    // In produzione è meglio avere un URL assoluto (es. process.env.APP_URL)
    const res = await fetch(`${process.env.APP_URL ?? "http://localhost:3000"}/api/finder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // il tuo /api/finder accettava { query, lang }
      body: JSON.stringify({ query, lang }),
    });

    if (!res.ok) {
      return { ok: false, data: null };
    }

    const data = await res.json();

    // il tuo /api/finder nel codice di prima restituiva una stringa JSON in data.data
    // proviamo a leggerla
    let parsed: any = null;
    try {
      parsed = JSON.parse(data.data);
    } catch {
      parsed = { summary: data.data };
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

    // 1) salviamo SUBITO sul db
    // ATTENZIONE: cambia "lead" con il nome del tuo modello Prisma (Lead, Request, ecc.)
    const leadRecord = await prisma.lead.create({
      data: {
        email,
        message: message ?? "",
        lang,
        status: "RECEIVED", // se nel modello hai uno status
      },
    });

    // 2) cerco di far rispondere l’AI con quello che ha chiesto l’utente
    const finderResult = message
      ? await askFinder(message, lang)
      : { ok: false, data: null };

    // 3) preparo il testo dell’email da mandare al mittente
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

    // se l’AI ha trovato qualcosa, lo aggiungo in fondo
    let aiPart = "";
    if (finderResult.ok && finderResult.data) {
      // la tua /api/finder aveva spesso { items: [...], summary: "..." }
      const items = Array.isArray(finderResult.data.items)
        ? finderResult.data.items
        : [];

      aiPart += "\n\n";
      aiPart +=
        lang === "it"
          ? "Ho già provato a cercare qualcosa per te:"
          : lang === "fr"
          ? "J’ai déjà cherché pour toi :"
          : lang === "de"
          ? "Ich habe schon etwas für dich gesucht:"
          : "I already tried to find something for you:";

      aiPart += "\n";

      items.forEach((item: any, idx: number) => {
        aiPart += `\n${idx + 1}) ${item.title ?? "Senza titolo"}${
          item.price ? " — " + item.price : ""
        }${item.source ? " — " + item.source : ""}`;
      });

      if (finderResult.data.summary) {
        aiPart += "\n\n" + finderResult.data.summary;
      }
    } else {
      // se l’AI non ha risposto
      aiPart += "\n\n";
      aiPart +=
        lang === "it"
          ? "In questo momento non sono riuscito a completare la ricerca automatica, ma ti risponderò manualmente."
          : lang === "fr"
          ? "Je n’ai pas pu terminer la recherche automatique pour le moment, mais je te répondrai manuellement."
          : lang === "de"
          ? "Die automatische Suche hat diesmal nicht geklappt, aber ich antworte dir manuell."
          : "I couldn't finish the automatic search right now, but I will reply manually.";
    }

    // 4) mando la mail con Resend
    // Cambia "noreply@ifinditforyou.com" con il tuo sender verificato su Resend
    await resend.emails.send({
      from: "iFindItForYou <noreply@ifinditforyou.com>",
      to: email,
      subject,
      text: `${intro}\n\n${bodyText}${aiPart}\n\n— iFindItForYou`,
    });

    // 5) aggiorno lo stato sul db (opzionale)
    await prisma.lead.update({
      where: { id: leadRecord.id },
      data: {
        status: "SENT", // o "DONE"
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lead error", err);
    return NextResponse.json({ error: "server error" }, { status: 500 });
  }
}
