import { NextResponse } from "next/server";

// Endpoint temporaneo: non usa Resend, non manda email.
export async function POST() {
  return NextResponse.json(
    {
      ok: true,
      message:
        "Endpoint /api/lead temporaneamente disabilitato (nessuna email inviata).",
    },
    { status: 200 }
  );
}

