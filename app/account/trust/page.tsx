import TrustPageClient from "@/components/TrustPageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <TrustPageClient locale={locale} />;
}
