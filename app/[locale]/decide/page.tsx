import DecidePageClient from "@/components/DecidePageClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <DecidePageClient locale={locale} />;
}
