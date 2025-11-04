// app/api/finder/route.ts
import { NextResponse } from "next/server";

const DEMO_USER = "demo-user";

// finto “database” di crediti
const userCredits: Record<string, number> = {
  [DEMO_USER]: 5,
};

const PROMPTS: Record<string, (query: string) => string> = {
  it: (query) => `
Sei "AI Finder" per un sito che aiuta a trovare prodotti/servizi difficili.
L'utente ha chiesto: "${query}".

Restituisci SOLO questo JSON:

{
  "items": [
    {
      "title": "...",
      "price": "...",
      "source": "...",
      "shipping": "...",
      "notes": "..."
    }
  ],
  "summary": "..."
}

Se non trovi l’esatto prodotto, proponi alternative simili.
Prezzi in EUR o CHF.
`,
  en: (query) => `
You are "AI Finder" for a site that finds hard-to-get products.
The user asked: "${query}".

Return ONLY this JSON:

{
  "items": [
    {
      "title": "...",
      "price": "...",
      "source": "...",
      "shipping": "...",
      "notes": "..."
    }
  ],
  "summary": "..."
}

If exact item is missing, propose similar alternatives.
Use EUR or CHF.
`,
  fr: (query) => `
Tu es "AI Finder" pour un site qui trouve des produits difficiles.
L'utilisateur a demandé: "${query}".

Retourne UNIQUEMENT ce JSON:

{
  "items": [
    {
      "title": "...",
      "price": "...",
      "source": "...",
      "shipping": "...",
      "notes": "..."
    }
  ],
  "summary": "..."
}

Si tu ne trouves pas exactement, propose des alternatives similaires.
`,
  de: (query) => `
Du bist "AI Finder" und findest schwer auffindbare Produkte.
Der Benutzer fragt: "${query}".

Gib NUR dieses JSON zurück:

{
  "items": [
    {
      "title": "...",
      "price": "...",
      "source": "...",
      "shipping": "...",
      "notes": "..."
    }
  ],
  "summary": "..."
}

Wenn nicht vorhanden, ähnliche Alternativen vorschlagen.
`,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { query, lang = "it", userId = DEMO_USER } = body as {
      query?: string;
      lang?: "it" | "en" | "fr" | "de";
      userId?: string;
    };

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Manca la descrizione." },
        { status: 400 }
      );
    }

    // crediti finti
    if (!userCredits[userId] || userCredits[userId] <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Crediti esauriti",
          action: "purchase",
          message: "Ricarica per avere ricerche AI avanzate.",
        },
        { status: 402 }
      );
    }

    const prompt = PROMPTS[lang]?.(query) ?? PROMPTS.it(query);

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      }),
    });

    const data = await openaiRes.json();
    const content = data?.choices?.[0]?.message?.content ?? "{}";

    // scala 1 credito
    userCredits[userId] = (userCredits[userId] || 1) - 1;

    return NextResponse.json(
      {
        success: true,
        creditsLeft: userCredits[userId],
        data: content,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ /api/finder error:", err);
    return NextResponse.json(
      { success: false, error: "Errore interno" },
      { status: 500 }
    );
  }
}

