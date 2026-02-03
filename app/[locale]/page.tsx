import { headers } from "next/headers";
import HomeLandingClient from "@/components/HomeLandingClient";
import HomePageClient from "@/components/HomePageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const h = await headers();
  const host = h.get("host") ?? "";
  const isIFindEV = host.includes("ifindev.com");

  // ✅ ifindev.com -> homepage iFindEV (ha bisogno di locale)
  if (isIFindEV) {
    return <HomeLandingClient locale={locale} />;
  }

  // ✅ altri domini -> homepage ombrello (NON accetta locale)
  return <HomePageClient />;
}
