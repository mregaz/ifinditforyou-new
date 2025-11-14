// app/api/pay/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      error:
        "Questo endpoint è stato dismesso. Usa la pagina /pro per abbonarti a IFindItForYou PRO.",
    },
    { status: 410 }
  );
}

export async function POST() {
  return GET();
}
