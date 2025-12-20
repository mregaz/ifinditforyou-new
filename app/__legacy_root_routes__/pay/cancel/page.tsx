export default function CancelPage() {
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const boxStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 600,
    borderRadius: 16,
    border: "1px solid #4b5563",
    backgroundColor: "#020617",
    padding: 24,
    textAlign: "center",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: 24,
    display: "inline-block",
    padding: "10px 20px",
    borderRadius: 999,
    border: "none",
    backgroundColor: "#22c55e",
    color: "#022c22",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    textDecoration: "none",
  };

  const linkStyle: React.CSSProperties = {
    color: "#6ee7b7",
    textDecoration: "underline",
  };

  return (
    <main style={pageStyle}>
      <div style={boxStyle}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>⚠️</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Pagamento annullato
        </h1>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>
          Sembra che tu abbia annullato il pagamento o che qualcosa non sia
          andato a buon fine su Stripe.
        </p>
        <p style={{ fontSize: 14, color: "#9ca3af" }}>
          Nessun addebito è stato effettuato. Puoi riprovare quando vuoi dalla
          pagina <strong>IFindItForYou PRO</strong>.
        </p>

        <a href="/pro" style={buttonStyle}>
          Torna alla pagina PRO →
        </a>

        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>
          Se pensi che ci sia un errore, scrivici a{" "}
          <a href="mailto:support@ifinditforyou.com" style={linkStyle}>
            support@ifinditforyou.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
