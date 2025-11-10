import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, message, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "EMAIL_REQUIRED" },
        { status: 400 }
      );
    }

    // qui salviamo solo i campi che ESISTONO nello schema Prisma
    await prisma.lead.create({
      data: {
        email,
        message: message || "",
        // name lo lasciamo fuori perché nello schema su Vercel non c'è
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("lead api error", err);
    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}
