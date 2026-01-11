// lib/lang.ts

export const LOCALES = ["it", "en", "fr", "de", "es"] as const;
export type Locale = (typeof LOCALES)[number];

// Alias per compatibilità
export type Lang = Locale;

export const defaultLocale: Locale = "it";

export function isSupportedLocale(v?: string | null): v is Locale {
  return !!v && (LOCALES as readonly string[]).includes(v);
}

export function toLocale(v?: string | null): Locale {
  if (!v) return defaultLocale;

  const normalized = v.toLowerCase().replace("_", "-");
  const short = normalized.split("-")[0];

  return (LOCALES as readonly string[]).includes(short)
    ? (short as Locale)
    : defaultLocale;
}
