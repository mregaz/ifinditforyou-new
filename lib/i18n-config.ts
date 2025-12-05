// lib/i18n-config.ts

// URL base del sito in produzione
export const baseUrl = "https://www.ifinditforyou.com";

// Lingue supportate
export const locales = ["it", "en", "fr", "de", "tr"] as const;
export type Locale = (typeof locales)[number];

// Lingua di default (senza prefisso)
export const defaultLocale: Locale = "it";

/**
 * Restituisce il path corretto per una pagina in una lingua specifica.
 *
 * Esempi:
 *  localePathname("it", "/about") -> "/about"
 *  localePathname("en", "/about") -> "/en/about"
 *  localePathname("fr", "/")      -> "/fr"
 */
export function localePathname(locale: Locale, path: string): string {
  // Normalizziamo path: se è vuoto lo trattiamo come "/"
  const cleanPath = path && path.length > 0 ? path : "/";

  // Root "/"
  if (cleanPath === "/") {
    if (locale === "it") {
      return "/";
    }
    return "/" + locale;
  }

  // Pagine interne
  if (locale === "it") {
    return cleanPath;
  }

  return "/" + locale + cleanPath;
}
