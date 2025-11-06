app.post("/api/finder", async (req, res) => {
  try {
    const { query, userId = "demo-user" } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Manca la descrizione del prodotto." });
    }

    const hasCredits = userCredits[userId] && userCredits[userId] > 0;

    // se non hai messo la chiave, rispondiamo subito con la versione base
    if (!process.env.OPENAI_API_KEY) {
      return res.json({
        success: true,
        creditsLeft: userCredits[userId] || 0,
        data: JSON.stringify({
          items: [
            {
              title: "Suggerimento generico",
              price: "N/D",
              source: "es. Amazon o eBay",
              shipping: "da verificare",
              notes: "Per risultati più precisi usa la ricerca avanzata.",
            },
          ],
          summary:
            "Per risultati più precisi (prezzo, disponibilità, spedizione) attiva la ricerca avanzata.",
          premium: true,
        }),
        wasPremium: false,
      });
    }

    // PROMPT premium e free come prima
    const promptPremium = `
Sei AI Finder per un sito che trova prodotti difficili da reperire.
Utente: "${query}"
...
`;

    const promptFree = `
Sei AI Finder in modalità gratuita.
Utente: "${query}"
...
`;

    const prompt = hasCredits ? promptPremium : promptFree;

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

    if (hasCredits) {
      userCredits[userId] = userCredits[userId] - 1;
    }

    return res.json({
      success: true,
      creditsLeft: userCredits[userId] || 0,
      data: data.choices[0].message.content,
      wasPremium: hasCredits,
    });
  } catch (err) {
    console.error("Errore in /api/finder:", err);

    // FALLBACK se succede qualsiasi cosa
    return res.json({
      success: true,
      creditsLeft: 0,
      data: JSON.stringify({
        items: [
          {
            title: "Suggerimento generico",
            price: "N/D",
            source: "es. Amazon o eBay",
            shipping: "da verificare",
            notes: "Per risultati più precisi usa la ricerca avanzata.",
          },
        ],
        summary:
          "Per risultati più precisi (prezzo, disponibilità, spedizione) attiva la ricerca avanzata.",
        premium: true,
      }),
      wasPremium: false,
      import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const query = body?.query || "nessuna query";

  return NextResponse.json({
    success: true,
    message: "Risposta di test dal server Next.js (solo per build Vercel).",
    query,
  });
}

    });
  }
});


