import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const lang = searchParams.get("lang") || "it"; // se non arriva niente, default italiano

  if (!q.trim()) {
    return NextResponse.json(
      { results: ["Dimmi cosa vuoi cercare 😎"] },
      { status: 200 }
    );
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("❌ OPENAI_API_KEY mancante su Vercel");
      return NextResponse.json(
        { results: ["Errore di configurazione: manca la chiave API."] },
        { status: 500 }
      );
    }

    // Costruiamo il prompt per l'AI, nella lingua scelta
    // Chiediamo 2-3 suggerimenti chiari e pratici
    const userContent = `
L'utente chiede: "${q}"

Rispondi in questa lingua: ${lang}.
Importante:
- Rispondi SOLO in ${lang}.
- Dai 2 o 3 suggerimenti pratici, numerati 1), 2), 3).
- Breve, concreto, utile.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sei un assistente AI personale che trova idee, prodotti, soluzioni e proposte utili. Tono amichevole, pratico, diretto.",
          },
          {
            role: "user",
            content: userContent,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("❌ Errore API OpenAI:", response.status, text);
      return NextResponse.json(
        { results: ["Errore durante la chiamata all'API OpenAI."] },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content =
      data?.choices?.[0]?.message?.content || "Nessuna risposta trovata.";

    // Spezziamo in righe per mostrarle in lista
    const results = content
      .split("\n")
      .map((r: string) => r.trim())
      .filter(Boolean);

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("💥 Errore generale /api/search:", error);
    return NextResponse.json(
      { results: ["Errore interno. Riprova tra poco."] },
      { status: 500 }
    );
  }
}

