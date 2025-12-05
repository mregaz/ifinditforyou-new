// lib/i18n-config.ts

export const locales = ["it", "en", "fr", "de"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "it";

export const baseUrl = "https://www.ifinditforyou.com";

export const localePathname = (locale: Locale, path: string = "/") => {
  if (locale === "it") {
    return path === "/" ? "/" : path;
  }
  return `/${locale}${path === "/" ? "" : path}`;
};
