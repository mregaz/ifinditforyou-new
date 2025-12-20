import type { Metadata } from "next";
import { i18n, isSupportedLocale, type Locale } from "@/lib/i18n-config";
import { getAboutCopy } from "@/lib/i18n/info";
import { buildInfoMetadata } from "@/lib/seo/info-metadata";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const t = getAboutCopy(locale);

  return buildInfoMetadata({
    locale,
    path: "/about",
    title: t.title,
    description: t.body,
  });
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

