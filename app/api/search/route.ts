import { NextResponse } from "next/server";

export async function GET(req: Request) {
 {
  try {
    const { query, lang } = await req.json();

    const prompt = `
Sei un assistente personale chiamato "Ifinditforyou".
L'utente chiede: "${query}".
Rispondi in ${lang} con 3 suggerimenti concreti e ordinati.
`;

    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Sei un assistente che aiuta le persone a trovare prodotti, idee o soluzioni con chiarezza e tono amichevole.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
      }),
    });

    const data = await aiRes.json();
    const text =
      data?.choices?.[0]?.message?.content ||
      "Non ho trovato risultati, riprova con più dettagli.";

    const results = text.split("\n").filter((line: string) => line.trim() !== "");
    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error("AI error", err);
    return NextResponse.json({
      ok: false,
      results: ["Errore interno. Riprova tra poco."],
    });
  }
}

