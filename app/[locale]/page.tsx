export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 32, fontWeight: 700 }}>
        IFINDEV PAGE HIT ✅
      </h1>
      <p>locale: {locale}</p>
      <p>timestamp: {new Date().toISOString()}</p>
    </main>
  );
}
