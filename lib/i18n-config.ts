// lib/i18n-config.ts

// Lingue supportate dal sito
export const locales = ["it", "en", "fr", "de", "tr"] as const;
export type Locale = (typeof locales)[number];

// Lingua predefinita (root senza prefisso)
export const defaultLocale: Locale = "it";

// URL base del sito in produzione
export const baseUrl = "https://www.ifinditforyou.com";

// Funzione che costruisce il path corretto per ogni lingua
export const localePathname = (locale: Locale, path: string = "/") => {
  // Italiano: root senza prefisso
  if (locale === "it") {
    return path === "/" ? "/" : path;
  }

  // Altre lingue: /en, /fr, /de, /tr
  return `/${locale}${path === "/" ? "" : path}`;
};

};
