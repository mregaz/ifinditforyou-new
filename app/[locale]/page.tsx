import HomePageClient from "@/components/HomePageClient";
import { toLocale } from "@/lib/lang";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <HomePageClient initialLang={toLocale(locale)} />;
}
