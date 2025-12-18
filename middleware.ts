// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["en", "de", "fr", "es"] as const;
const DEFAULT_LOCALE = "en";

// opzionale: se salvi la lingua in cookie
const LOCALE_COOKIE = "NEXT_LOCALE";

function isSupportedLocale(s: string | undefined): s is (typeof SUPPORTED_LOCALES)[number] {
  return !!s && (SUPPORTED_LOCALES as readonly string[]).includes(s);
}

function pickLocale(req: NextRequest) {
  const cookieLocale = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isSupportedLocale(cookieLocale)) return cookieLocale;

  const al = req.headers.get("accept-language");
  if (al) {
    const first = al.split(",")[0]?.trim().slice(0, 2);
    if (isSupportedLocale(first)) return first;
  }

  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ignora roba tecnica
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // già localizzato → ok
  if (isSupportedLocale(first)) return NextResponse.next();

  // NON localizzato → redirect a /{locale}{pathname}
  const locale = pickLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

// applica a tutto tranne asset/api
export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
