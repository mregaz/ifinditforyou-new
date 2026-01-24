import { NextRequest, NextResponse } from "next/server";

const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
const DEFAULT_LOCALE = "it";

// Se in futuro vuoi impostare un cookie dalla LanguageSwitcher, questo è il nome standard
const LOCALE_COOKIE_NAMES = ["NEXT_LOCALE", "ifiy_lang"];

function isSupportedLocale(v: string | undefined): v is (typeof SUPPORTED_LOCALES)[number] {
  return !!v && (SUPPORTED_LOCALES as readonly string[]).includes(v);
}

function pickLocale(req: NextRequest) {
  // 1) cookie
  for (const name of LOCALE_COOKIE_NAMES) {
    const c = req.cookies.get(name)?.value;
    if (isSupportedLocale(c)) return c;
  }

  // 2) header Accept-Language (prende il primo, es. "en-US" -> "en")
  const al = req.headers.get("accept-language");
  if (al) {
    const first = al.split(",")[0]?.trim().slice(0, 2);
    if (isSupportedLocale(first)) return first;
  }

  // 3) fallback
  return DEFAULT_LOCALE;
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

 // Ignora asset/Next internals/API
if (
  pathname.startsWith("/_next") ||
  pathname.startsWith("/api") ||                       // /api/*
  /^\/(it|en|fr|de|es)\/api(\/|$)/.test(pathname) ||    // /{locale}/api/*
  pathname.startsWith("/favicon") ||
  pathname.startsWith("/robots") ||
  pathname.startsWith("/sitemap") ||
  pathname.startsWith("/assets")
) {
  return NextResponse.next();
}


  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Se già locale (es. /en/..., /it/...) -> ok
  if (isSupportedLocale(first)) {
  const res = NextResponse.next();

  const maxAge = 60 * 60 * 24 * 365; // 1 anno
  res.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge, sameSite: "lax" });
  res.cookies.set("ifiy_lang", first, { path: "/", maxAge, sameSite: "lax" });

  return res;
}


  // Evita di interferire con eventuali cartelle "backup" sotto app/
  if (first === "en_disabled" || first === "login_old" || first === "register_old") {
    return NextResponse.next();
  }

  // Redirect: /login -> /{locale}/login, /account -> /{locale}/account, / -> /{locale}/
  const locale = pickLocale(req);

  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`.replace(/\/{2,}/g, "/");
  url.search = search;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon.ico|it/api|en/api|fr/api|de/api|es/api).*)",
  ],
};

