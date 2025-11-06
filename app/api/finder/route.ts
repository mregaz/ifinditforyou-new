import { NextResponse } from "next/server";

// finto "database" crediti, come avevamo fatto in locale
const userCredits: Record<string, number> = {
  "demo-user": 3,
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const query = body?.query as string | undefined;
    const userId = (body?.userId as string) || "demo-user";

    if (!query) {
      return NextResponse.json(
        { success: false, error: "Manca la descrizione del prodotto." },
        { status: 400 }
      );
    }

    // vedi se l’utente ha crediti
    const hasCredits = (userCredits[userId] ?? 0) > 0;

    // prompt premium vs free
    const promptPremium = `
Sei AI Finder per un sito che trova prodotti difficili da reperire.
Utente: "${query}"

Restituisci SOLO questo JSON:
{
  "items": [
    { "title": "...", "price": "...", "source": "...", "shipping": "...", "notes": "..." }
  ],
  "summary": "...",
  "premium": true
}
`;
    const promptFree = `
Sei AI Finder in modalità gratuita.
Utente: "${query}"

Restituisci SOLO questo JSON molto breve (1 oggetto) e scrivi che per dettagli serve la versione avanzata.
{
  "items": [
    { "title": "Suggerimento generico per: ${query}", "price": "N/D", "source": "es. Amazon o eBay", "shipping": "da verificare", "notes": "Per risultati più precisi usa la ricerca avanzata." }
  ],
  "summary": "Per risultati più precisi (prezzo, disponibilità, spedizione) attiva la ricerca avanzata.",
  "premium": false
}
`;

    const prompt = hasCredits ? promptPremium : promptFree;

    // se NON hai la chiave su Vercel, rispondiamo col free e basta
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: true,
        data: JSON.parse(
          promptFree
            .slice(promptFree.indexOf("{"), promptFree.lastIndexOf("}") + 1)
        ),
        wasPremium: false,
      });
    }

    // chiamata a OpenAI
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
    const aiText =
      data?.choices?.[0]?.message?.content ??
      '{"items":[],"summary":"Nessun risultato"}';

    // scala 1 credito se era premium
    if (hasCredits) {
      userCredits[userId] = userCredits[userId] - 1;
    }

    return NextResponse.json({
      success: true,
      creditsLeft: userCredits[userId] ?? 0,
      data: aiText,
      wasPremium: hasCredits,
    });
  } catch (err) {
    console.error("Errore in /api/finder:", err);
    return NextResponse.json(
      { success: false, error: "Errore interno" },
      { status: 500 }
    );
  }
}




