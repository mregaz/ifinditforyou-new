import { NextRequest, NextResponse } from "next/server";

// 👇 Versione base funzionante del form "Contattami"
// Per ora logga sul server (vedi Function Logs su Vercel)
// e risponde con { ok: true }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, details, lastQuery } = body || {};

    if (!email || !email.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing_email" },
        { status: 400 }
      );
    }

    console.log("🔥 NUOVO LEAD:", {
      email,
      details,
      lastQuery,
      createdAt: new Date().toISOString(),
    });

    // 🔜 In futuro: collegare email, Telegram, o database
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ Errore in /api/lead:", err);
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}


