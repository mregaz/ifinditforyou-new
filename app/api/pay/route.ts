import { NextResponse } from "next/server";

// endpoint finto per "compra crediti"
export async function POST(req: Request) {
  // qui in futuro leggeremo cosa ha comprato l’utente
  return NextResponse.json({
    success: true,
    message: "Pagamento finto ok (endpoint di test).",
  });
}

// opzionale: così se lo apri dal browser non crasha
export async function GET() {
  return NextResponse.json({
    ok: true,
    info: "Endpoint /api/pay pronto.",
  });
}
