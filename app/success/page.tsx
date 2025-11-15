export default function SuccessPage() {
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
    border: "1px solid #22c55e33",
    backgroundColor: "#020617",
    padding: 24,
    textAlign: "center",
    boxShadow: "0 0 40px rgba(34,197,94,0.3)",
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
        <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
          Pagamento completato!
        </h1>
        <p style={{ fontSize: 14, color: "#9ca3af", marginBottom: 16 }}>
          Grazie, il tuo abbonamento <strong>IFindItForYou PRO</strong> è attivo.
        </p>
        <p style={{ fontSize: 14, color: "#9ca3af" }}>
          Ti abbiamo inviato una email di conferma da Stripe con il riepilogo del
          pagamento. Da lì potrai anche gestire il rinnovo dell&apos;abbonamento.
        </p>

        <a href="/" style={buttonStyle}>
          Torna alla home e inizia a usare il servizio →
        </a>

        <p style={{ fontSize: 12, color: "#6b7280", marginTop: 16 }}>
          In caso di problemi puoi contattarci a{" "}
          <a href="mailto:support@ifinditforyou.com" style={linkStyle}>
            support@ifinditforyou.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}

