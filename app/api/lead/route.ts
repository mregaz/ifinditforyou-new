import { NextRequest, NextResponse } from "next/server";

// Per ora salviamo semplicemente lato server nel log.
// Dopo possiamo collegare email, Telegram, Google Sheets, ecc.

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

    // Logga su server (lo vedi nei Function Logs su Vercel)
    console.log("🔥 NUOVO LEAD:", {
      email,
      details,
      lastQuery,
      createdAt: new Date().toISOString(),
    });

    // TODO futuro:
    // - salvare in un DB
    // - mandarti una mail
    // - mandarti un msg Telegram
    // - creare ticket cliente

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("💥 Errore /api/lead:", err);
    return NextResponse.json(
        { ok: false, error: "server_error" },
        { status: 500 }
    );
  }
}

