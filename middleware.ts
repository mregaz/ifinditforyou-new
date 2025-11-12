import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // in sviluppo NON fare nessun redirect
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  // --- DA QUI IN GIÙ vale solo in produzione ---
  const url = req.nextUrl.clone();

  // se è già sul dominio giusto, lascia passare
  if (url.host === "ifinditforyou.com") {
    return NextResponse.next();
  }

  url.protocol = "https";
  url.host = "ifinditforyou.com";
  return NextResponse.redirect(url);
}


 

