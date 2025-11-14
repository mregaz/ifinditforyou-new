// app/pay/cancel/page.tsx
import Link from "next/link";

export default function PayCancelPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: "rgba(15,23,42,0.75)",
          border: "1px solid rgba(148,163,184,0.3)",
          borderRadius: 20,
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          padding: "34px 24px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.35)",
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 12 }}>Pagamento annullato</h1>

        <p style={{ opacity: 0.85, marginBottom: 22, lineHeight: 1.5 }}>
          Nessun addebito è stato effettuato.<br />
          Puoi riprovare quando vuoi.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              background: "#334155",
              borderRadius: 999,
              padding: "10px 20px",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Torna alla ricerca
          </Link>

          <Link
            href="/pro"
            style={{
              background: "#a855f7",
              borderRadius: 999,
              padding: "10px 20px",
              color: "white",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Riprova pagamento
          </Link>
        </div>
      </div>
    </main>
  );
}

