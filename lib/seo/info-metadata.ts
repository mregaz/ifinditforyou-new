// lib/seo/info-metadata.ts
import type { Metadata } from "next";
import { baseUrl, locales, localePathname, type Locale } from "@/lib/i18n-config";

type InfoMetaInput = {
  locale: Locale;
  path: string; // es. "/about"
  title: string; // già localizzato (solo testo della pagina, senza brand)
  description: string; // già localizzata
};

export function buildInfoMetadata(input: InfoMetaInput): Metadata {
  const { locale, path, title, description } = input;

  const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

  const languages = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
    return acc;
  }, {});

  const fullTitle = `${title} – iFindItForYou`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: "iFindItForYou",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
