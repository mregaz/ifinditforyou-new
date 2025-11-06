import { NextResponse } from "next/server";

// finto db crediti (solo runtime, a ogni deploy si resetta)
const userCredits: Record<string, number> = {
  "demo-user": 3,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = (body?.query as string | undefined)?.trim();
    const userId = (body?.userId as string) || "demo-user";
    const lang = (body?.lang as string) || "it";

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Manca la descrizione del prodotto." },
        { status: 400 }
      );
    }

    const hasKey = !!process.env.OPENAI_API_KEY;

    // se non c'è la chiave su Vercel → risposta base
    if (!hasKey) {
      return NextResponse.json(makeFallback(query, userCredits[userId] ?? 0, false));
    }

    // prompt per GPT
    const prompt = `
Sei "iFindItForYou AI Finder".
L'utente chiede: "${query}" (lingua: ${lang}).

Devi proporre 2-3 risultati in questo formato JSON, senza testo fuori dal JSON:

{
  "items": [
    {
      "title": "nome prodotto o soluzione",
      "price": "prezzo indicativo o 'N/D'",
      "source": "dove trovarlo (sito, marketplace, brand)",
      "shipping": "se noto",
      "notes": "note utili o alternative"
    }
  ],
  "summary": "breve riassunto in ${lang}",
  "premium": false
}
Se non trovi esatto, proponi alternative compatibili.
`;

    // chiamata a OpenAI (modello chat)
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    });

    const data = await openaiRes.json();

    // se OpenAI non ha risposto bene → fallback
    const aiText =
      data?.choices?.[0]?.message?.content ?? null;

    if (!aiText) {
      return NextResponse.json(makeFallback(query, userCredits[userId] ?? 0, true));
    }

    // scala 1 credito se l'utente ne aveva
    if (userCredits[userId] && userCredits[userId] > 0) {
      userCredits[userId] = userCredits[userId] - 1;
    }

    return NextResponse.json({
      success: true,
      creditsLeft: userCredits[userId] ?? 0,
      data: aiText, // è una stringa JSON, il tuo frontend la fa JSON.parse()
      wasPremium: true,
    });
  } catch (err) {
    console.error("Errore in /api/finder:", err);
    return NextResponse.json(
      { success: false, error: "Errore interno" },
      { status: 500 }
    );
  }
}

// funzione di fallback (se non c'è la chiave o GPT fallisce)
function makeFallback(query: string, creditsLeft: number, premiumFlag: boolean) {
  return {
    success: true,
    creditsLeft,
    data: JSON.stringify({
      items: [
        {
          title: "Suggerimento generico per: " + query,
          price: "N/D",
          source: "es. Amazon, eBay, AliExpress",
          shipping: "da verificare",
          notes: "Per risultati più precisi attiva la ricerca avanzata.",
        },
      ],
      summary:
        "Versione base attiva. Aggiungi una chiave OpenAI su Vercel per avere la ricerca avanzata.",
      premium: premiumFlag,
    }),
    wasPremium: false,
  };
}





