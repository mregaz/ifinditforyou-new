// app/[locale]/page.tsx
import HomePageClient from "@/components/HomePageClient";
import type { Lang } from "@/lib/lang";

const SUPPORTED: Lang[] = ["it", "en", "fr", "de", "es"];
const DEFAULT_LANG: Lang = "it";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const initialLang = (SUPPORTED as string[]).includes(locale)
    ? (locale as Lang)
    : DEFAULT_LANG;

  return <HomePageClient initialLang={initialLang} />;
}
