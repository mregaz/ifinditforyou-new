// lib/lang.ts

export type Lang = "it" | "fr" | "de" | "en";

export const DEFAULT_LANG: Lang = "it";

/**
 * Normalizza una stringa qualsiasi in una lingua valida.
 * Se non riconosce il valore, torna "it".
 */
export function normalizeLang(value?: string | null): Lang {
  if (value === "it" || value === "fr" || value === "de" || value === "en") {
    return value;
  }
  return DEFAULT_LANG;
}

