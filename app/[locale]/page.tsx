import HomeLandingClient from "@/components/HomeLandingClient";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <HomeLandingClient locale={locale} />;
}

