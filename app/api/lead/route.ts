import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const email = String(body?.email ?? "").trim();
    const message = String(body?.message ?? "").trim();
    const lang = String(body?.lang ?? "it").trim() || "it";

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { ok: false, error: "Email non valida." },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Descrivi brevemente cosa ti serve." },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        email,
        message,
        lang,
        status: "RECEIVED",
      },
    });

    return NextResponse.json(
      {
        ok: true,
        leadId: lead.id,
        message: "Richiesta ricevuta correttamente.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Lead creation failed:", error);

    return NextResponse.json(
      { ok: false, error: "Errore interno durante il salvataggio della richiesta." },
      { status: 500 }
    );
  }
}