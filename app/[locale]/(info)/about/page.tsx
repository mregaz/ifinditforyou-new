import type { Metadata } from "next";
import {
  baseUrl,
  i18n,
  isSupportedLocale,
  locales,
  localePathname,
  type Locale,
} from "@/lib/i18n-config";
import { getAboutCopy } from "@/lib/i18n/info";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const path = "/about";
  const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

  const languages = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
    return acc;
  }, {});

  const t = getAboutCopy(locale);

  return {
    title: `${t.title} – iFindItForYou`,
    description: t.body,
    alternates: { canonical: canonicalUrl, languages },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale: rawLocale } = await params;

  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const t = getAboutCopy(locale);

  return (
    <main>
      <h1 className="mb-4 text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm leading-relaxed max-w-2xl">{t.body}</p>
    </main>
  );
}

