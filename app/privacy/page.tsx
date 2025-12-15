export default function PrivacyDebugStyle() {
  return (
    <div style={{ minHeight: "100vh", background: "#020617", color: "#f8fafc" }}>
      <main style={{ maxWidth: 768, margin: "0 auto", padding: "48px 16px" }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12 }}>
          PRIVACY DEBUG STYLE
        </h1>
        <p style={{ color: "#cbd5e1", fontSize: 16 }}>
          Se vedi sfondo scuro, questa route è corretta e il problema è SOLO Tailwind/globals.
        </p>
      </main>
    </div>
  );
}
