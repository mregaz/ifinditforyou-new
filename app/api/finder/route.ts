import { NextResponse } from "next/server";

// finto DB crediti
const userCredits: Record<string, number> = {
  "demo@user.com": 3,
};

export async function POST(req: Request) {
  try {
    const { query, lang = "it", userId = "demo@user.com" } = await req.json();

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Richiesta non valida" },
        { status: 400 }
      );
    }

    // 1) controllo crediti
    if (!userCredits[userId] || userCredits[userId] <= 0) {
      return NextResponse.json(
        {
          success: false,
          action: "purchase",
          message: "Crediti esauriti. Acquista o compila il form.",
        },
        { status: 402 }
      );
    }

    // 2) chiamiamo OpenAI via fetch (nessuna libreria da installare)
    const openaiRes = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `Sei un assistente che trova prodotti/opzioni online.
Utente: "${query}"
Lingua: ${lang}
Rispondi in modo sintetico con 2-3 opzioni.`,
      }),
    });

    if (!openaiRes.ok) {
      console.error("OpenAI error", await openaiRes.text());
      return NextResponse.json(
        { error: "Errore nella chiamata a OpenAI" },
        { status: 500 }
      );
    }

    const aiData = await openaiRes.json();

    // la risposta testuale sta qui
    const text =
      aiData?.output?.[0]?.content?.[0]?.text ??
      "Non ho trovato molto, prova a descrivermi meglio cosa cerchi.";

    // 3) scala 1 credito
    userCredits[userId] = userCredits[userId] - 1;

    // 4) rispondi al frontend
    return NextResponse.json({
      success: true,
      data: text,
      creditsLeft: userCredits[userId],
    });
  } catch (err) {
    console.error("AI Finder route error:", err);
    return NextResponse.json(
      { error: "Errore interno nell’AI Finder" },
      { status: 500 }
    );
  }
}






