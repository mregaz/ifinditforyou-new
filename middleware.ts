import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const proto = req.headers.get('x-forwarded-proto');
  const host = req.headers.get('host') || '';
  const url = new URL(req.url);

  // 1) Forza HTTPS se la richiesta arriva in HTTP
  if (proto !== 'https') {
    url.protocol = 'https:';
    url.hostname = 'ifinditforyou.com';
    return NextResponse.redirect(url, 308);
  }

  // 2) Canonicalizza 'www.' → dominio root
  if (host === 'www.ifinditforyou.com') {
    url.hostname = 'ifinditforyou.com';
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/:path*', // applica a tutte le rotte
};

