// lib/i18n-config.ts

// Lingue supportate dal sito
export const locales = ["it", "en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

// Lingua predefinita (quella senza prefisso nell'URL)
export const defaultLocale: Locale = "it";

// URL base del sito in produzione
export const baseUrl = "https://www.ifinditforyou.com";

// Funzione che costruisce il path corretto per ogni lingua
export const localePathname = (locale: Locale, path: string = "/") => {
  // Italiano: nessun prefisso /it, la root è "/"
  if (locale === "it") {
    return path === "/" ? "/" : path;
  }

  // Le altre lingue hanno il prefisso /en, /fr, /de
  return `/${locale}${path === "/" ? "" : path}`;
};
