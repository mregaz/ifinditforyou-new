// app/api/finder/route.ts
import { NextResponse } from "next/server";

const DEMO_USER = "demo-user";

// finto "database" di crediti (in futuro: collegalo a Prisma)
const userCredits: Record<string, number> = {
  [DEMO_USER]: 5,
};

// prompt per GPT-4 in varie lingue
const PROMPTS: Record<string, (query: string) => string> = {
  it: (query) => `
Sei "AI Finder" per un sito che aiuta a trovare prodotti difficili da reperire.
L'utente ha chiesto: "${query}".
Cerca in marketplace come Amazon, eBay, AliExpress e siti europei.
Restituisci SOLO il seguente JSON:

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

Se non trovi esattamente il prodotto, proponi alternative simili.
Usa prezzi in EUR o CHF.
`,
  en: (query) => `
You are "AI Finder" for a website that helps users find hard-to-get products.
The user asked: "${query}".
Search across multiple marketplaces (Amazon, eBay, AliExpress, EU stores).
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

If the exact product is not found, suggest similar alternatives.
Use EUR or CHF currency.
`,
  fr: (query) => `
Tu es "AI Finder" pour un site qui aide à trouver des produits difficiles à obtenir.
L'utilisateur demande: "${query}".
Cherche sur Amazon, eBay, AliExpress, et d'autres sites européens.
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

Si le produit exact n'existe pas, propose des alternatives similaires.
Utilise des prix en EUR ou CHF.
`,
  de: (query) => `
Du bist "AI Finder", eine KI, die schwer auffindbare Produkte recherchiert.
Der Benutzer fragt: "${query}".
Durchsuche Marktplätze wie Amazon, eBay, AliExpress und EU-Shops.
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

Wenn kein exaktes Produkt gefunden wird, schlage ähnliche Alternativen vor.
Verwende Preise in EUR oder CHF.
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
        { success: false, error: "Manca la descrizione del prodotto." },
        { status: 400 }
      );
    }

    // controlla i crediti
    if (!userCredits[userId] || userCredits[userId] <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Crediti esauriti",
          action: "purchase",
          message:
            "Ricarica per avere ricerche avanzate o accedi con un piano Pro.",
        },
        { status: 402 }
      );
    }

    // genera prompt dinamico nella lingua richiesta
    const prompt = PROMPTS[lang]?.(query) ?? PROMPTS.it(query);

    // chiama GPT-4-Turbo
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
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

    // decrementa i crediti demo
    userCredits[userId] = (userCredits[userId] || 1) - 1;

    return NextResponse.json({
      success: true,
      creditsLeft: userCredits[userId],
      data: content,
    });
  } catch (err) {
    console.error("❌ Errore in /api/finder:", err);
    return NextResponse.json(
      { success: false, error: "Errore interno del server." },
      { status: 500 }
    );
  }
}

