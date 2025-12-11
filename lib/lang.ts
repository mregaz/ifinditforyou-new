// lib/lang.ts

export const locales = ["it", "en", "fr", "de", "es"] as const;

export type Locale = (typeof locales)[number];

// Alias per compatibilità con il codice esistente
export type Lang = Locale;

export const defaultLocale: Locale = "it";

export function isSupportedLocale(
  value: string | undefined | null
): value is Locale {
  if (!value) return false;
  return (locales as readonly string[]).includes(value);
}
