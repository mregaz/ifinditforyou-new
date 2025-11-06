import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// 🔹 Finto database crediti utente
// In futuro sarà Prisma o DB vero, ma per ora basta questo
const userCredits: Record<string, number> = {
  "demo@user.com": 3, // utente di esempio con 3 crediti
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

    // 🔹 Controllo crediti
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

    // 🔹 Chiamata a OpenAI
    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `Trova alcune opzioni per: "${query}" (lingua: ${lang})`,
    });

    const text = completion.output[0]?.content[0]?.text ?? "Nessun risultato.";

    // 🔹 Scala credito
    userCredits[userId] = userCredits[userId] - 1;

    return NextResponse.json({
      success: true,
      data: text,
      creditsLeft: userCredits[userId],
    });
  } catch (err: any) {
    console.error("AI Finder error:", err);
    return NextResponse.json(
      { error: "Errore nel server AI Finder" },
      { status: 500 }
    );
  }
}





