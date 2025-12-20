import type { Metadata } from "next";
import {
  baseUrl,
  i18n,
  isSupportedLocale,
  locales,
  localePathname,
  type Locale,
} from "@/lib/i18n-config";
import { getHowItWorksCopy } from "@/lib/i18n/info";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const path = "/how-it-works";
  const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

  const languages = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
    return acc;
  }, {});

  const t = getHowItWorksCopy(locale);

  return {
    title: `${t.title} – iFindItForYou`,
    description: t.body,
    alternates: { canonical: canonicalUrl, languages },
    openGraph: {
      url: canonicalUrl,
      title: `${t.title} – iFindItForYou`,
      description: t.body,
      siteName: "iFindItForYou",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${t.title} – iFindItForYou`,
      description: t.body,
    },
  };
}

export default async function HowItWorksPage({ params }: Props) {
  const { locale: rawLocale } = await params;

  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const t = getHowItWorksCopy(locale);

  return (
    <main>
      <h1 className="mb-4 text-2xl font-semibold">{t.title}</h1>
      <p className="text-sm leading-relaxed max-w-2xl">{t.body}</p>
    </main>
  );
}
