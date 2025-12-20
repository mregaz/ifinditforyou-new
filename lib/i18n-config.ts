// lib/i18n-config.ts

export const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const locales = ["it", "en", "fr", "de", "es"] as const;
export type Locale = (typeof locales)[number];

export const i18n = {
  defaultLocale: "it",
  locales,
} as const;

export function isSupportedLocale(
  value: string | null | undefined
): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localePathname(
  locale: Locale,
  pathname: string
): string {
  const cleanPath =
    pathname === "/"
      ? ""
      : pathname.startsWith("/")
      ? pathname
      : `/${pathname}`;

  return cleanPath ? `/${locale}${cleanPath}` : `/${locale}`;
}

