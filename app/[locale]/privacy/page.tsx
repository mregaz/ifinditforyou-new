export default function PrivacyDebugLocalePrivacy({
  params,
}: {
  params: { locale: string };
}) {
  return (
    <div style={{ minHeight: "100vh", padding: 40, background: "#4c1d95", color: "white" }}>
      <h1 style={{ fontSize: 40, fontWeight: 800 }}>DEBUG /{params.locale}/privacy</h1>
      <p style={{ marginTop: 12, fontSize: 18 }}>
        Sei in: <b>app/[locale]/privacy/page.tsx</b>
      </p>
    </div>
  );
}
