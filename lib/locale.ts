export const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function toLocale(v?: string | null): Locale {
  if (!v) return "it";

  const normalized = v.toLowerCase().replace("_", "-");
  const short = normalized.split("-")[0];

  return (SUPPORTED_LOCALES as readonly string[]).includes(short)
    ? (short as Locale)
    : "it";
}
