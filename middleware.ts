import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = new URL(req.url);

  // Leggo cosa sta succedendo davvero lato edge
  const proto = req.headers.get('x-forwarded-proto') || url.protocol.replace(':', '');
  const host = req.headers.get('host') || url.hostname;

  // Valori canonici che VOGLIAMO sempre
  const canonicalHost = 'ifinditforyou.com';
  const canonicalProto = 'https';

  const needsHttps = proto !== canonicalProto;
  const needsHostFix = host !== canonicalHost;

  // Se qualcosa non è canonico ⇒ costruiamo l'URL definitivo UNA SOLA VOLTA
  if (needsHttps || needsHostFix) {
    const redirectUrl = new URL(req.url);

    redirectUrl.protocol = canonicalProto + ':';
    redirectUrl.hostname = canonicalHost;

    // importantissimo: se già stiamo andando esattamente lì, NON redirectare di nuovo
    if (
      redirectUrl.protocol !== url.protocol ||
      redirectUrl.hostname !== url.hostname
    ) {
      return NextResponse.redirect(redirectUrl, 308);
    }
  }

  // Se è già https://ifinditforyou.com/... → lascio passare
  return NextResponse.next();
}

// Applica a tutte le route (pagine, asset, ecc.)
export const config = {
  matcher: '/:path*',
};


 

