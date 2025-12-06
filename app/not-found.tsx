export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Pagina non trovata</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        La pagina che stai cercando non esiste o non è più disponibile.
      </p>
    </main>
  );
}
