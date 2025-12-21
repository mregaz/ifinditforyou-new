import type { Metadata } from "next";
import { i18n, isSupportedLocale, type Locale } from "@/lib/i18n-config";
import { buildInfoMetadata } from "@/lib/seo/info-metadata";
import { getAboutCopy } from "@/lib/i18n/info";

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
    <main className="min-h-screen bg-white text-slate-900 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-semibold">{t.title}</h1>

        <div className="space-y-4">
          {t.body.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-sm leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </main>
  );
}
