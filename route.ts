§// app/api/finder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, query } = await req.json();

    // 1) validazione base
    if (!email || !query) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Email e query sono obbligatorie" },
        { status: 400 }
      );
    }

    // 2) trova o crea l'utente
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          credits: 0, // parte senza crediti, li aggiunge Stripe
        },
      });
    }

    // 3) controlla i crediti
    if (user.credits <= 0) {
      return NextResponse.json(
        {
          error: "NO_CREDITS",
          message: "Nessun credito disponibile. Acquista un pacchetto.",
        },
        { status: 200 }
      );
    }

    // 4) chiama AI (facoltativo, solo se hai la chiave)
    let aiAnswer = "Ho ricevuto la tua richiesta. Ti invierò i risultati.";
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch(
          "https://api.openai.com/v1/chat/completions",
console.log("✅ Richiesta OpenAI inviata con query:", query);
const json = await response.json();
console.log("🧠 Risposta OpenAI:", JSON.stringify(json, null, 2));

          {
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
                    "Sei un assistente che trova prodotti/risorse per l'utente. Rispondi in modo breve.",
                },
                {
                  role: "user",
                  content: query,
                },
              ],
            }),
          }
        );

        if (openaiRes.ok) {
          const json = await openaiRes.json();
          aiAnswer =
            json.choices?.[0]?.message?.content ??
            "Non sono riuscito a generare una risposta.";
        }
      } catch (err) {
        console.error("Errore OpenAI:", err);
        // lasciamo aiAnswer di default
      }
    }

    // 5) salva la ricerca nel DB
    await prisma.search.create({
      data: {
        userId: user.id,
        query,
        result: aiAnswer,
        paid: true,
      },
    });

    // 6) scala 1 credito
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: user.credits - 1,
      },
    });

    // 7) (facoltativo) invia mail con Resend
    // if (process.env.RESEND_API_KEY) { ... }

    // 8) risposta al frontend
    return NextResponse.json(
      {
        ok: true,
        message: "Ricerca AI eseguita",
        answer: aiAnswer,
        creditsLeft: updatedUser.credits,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Errore interno" },
      { status: 500 }
    );
  }
}

