// app/[locale]/page.tsx
import HomePageClient from "@/components/HomePageClient";
import { toLocale } from "@/lib/lang";
// se preferisci: sposta toLocale in lib/locale.ts e importa da lì

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const initialLang = toLocale(locale);

  return <HomePageClient initialLang={initialLang} />;
}
