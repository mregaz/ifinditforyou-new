// lib/i18n-config.ts

// URL base del sito (usato da alcune pagine e dalla sitemap)
export const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

// Tutte le lingue supportate nel progetto
export const locales = ["it", "en", "fr", "de", "es"] as const;
export type Locale = (typeof locales)[number];

// Oggetto i18n (se ti serve in altre parti del codice, es. sitemap)
export const i18n = {
  defaultLocale: "it",
  locales,
} as const;

// Utility: controlla se una stringa è una locale supportata
export function isSupportedLocale(
  value: string | null | undefined
): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

// Utility: costruisce l’URL locale corretto a partire da pathname
//  - "it" (o "default") -> senza prefisso lingua
//  - altre lingue       -> /en/..., /fr/..., /de/..., /es/...
export function localePathname(
  locale: Locale | "default",
  pathname: string
): string {
  // normalizza il pathname ("/about", "about", ecc.)
  let cleanPath =
    pathname === "/"
      ? ""
      : pathname.startsWith("/")
      ? pathname
      : `/${pathname}`;

  if (locale === "default" || locale === "it") {
    // Italiano: niente prefisso lingua
    return cleanPath || "/";
  }

  // Altre lingue con prefisso
  return cleanPath ? `/${locale}${cleanPath}` : `/${locale}`;
}

