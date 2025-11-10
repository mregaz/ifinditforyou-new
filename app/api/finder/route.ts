// app/api/finder/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const { email, query } = await req.json();

    if (!email || !query) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "email e query sono obbligatorie" },
        { status: 400 }
      );
    }

    // 1. prendo o creo l’utente
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        credits: 0, // se è nuovo parte da 0
      },
    });

    // 2. controllo crediti
    if (user.credits <= 0) {
      return NextResponse.json(
        {
          error: "NO_CREDITS",
          message: "Nessun credito disponibile. Acquista un pacchetto.",
        },
        { status: 402 }
      );
    }

    // 3. chiamo OpenAI
    let aiAnswer = "Je vais chercher et te répondre bientôt.";
    if (OPENAI_API_KEY) {
      const openaiRes = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "Tu es un assistant qui trouve des produits ou des infos et réponds clairement en français.",
              },
              {
                role: "user",
                content: `Requête de l'utilisateur: ${query}`,
              },
            ],
          }),
        }
      );

      const json = await openaiRes.json();
      aiAnswer =
        json.choices?.[0]?.message?.content ||
        "Je n’ai pas pu générer la réponse complète.";
    }

    // 4. salvo la ricerca
    await prisma.search.create({
      data: {
        userId: user.id,
        query,
        result: aiAnswer,
        paid: true,
      },
    });

    // 5. scalare 1 credito
    await prisma.user.update({
      where: { id: user.id },
      data: {
        credits: {
          decrement: 1,
        },
      },
    });

    // 6. invio email con Resend (se la chiave c’è)
    if (process.env.RESEND_API_KEY) {
      try {
        await resend.emails.send({
          from: "iFindItForYou <noreply@ifinditforyou.com>",
          to: email,
          subject: "Ton résultat iFindItForYou",
          text: aiAnswer,
        });
      } catch (emailErr) {
        console.warn("Resend email failed:", emailErr);
      }
    }

    return NextResponse.json({
      ok: true,
      source: "finder-api",
      result: aiAnswer,
    });
  } catch (err) {
    console.error("finder api error", err);
    return NextResponse.json(
      { error: "SERVER_ERROR", message: "Erreur interne" },
      { status: 500 }
    );
  }
}







