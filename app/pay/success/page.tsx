// app/pay/success/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PaySuccessPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("ai_plan", "pro"); // ← utente PRO
      localStorage.setItem("ai_uses", "0");   // ← reset conteggio free
    }
  }, []);

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
          background: "rgba(15,23,42,0.6)",
          border: "1px solid rgba(148,163,184,0.3)",
          borderRadius: 20,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          padding: "30px 24px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 10 }}>Pagamento riuscito 🎉</h1>
        <p style={{ opacity: 0.85, marginBottom: 18 }}>
          Hai attivato <strong>Ricerca Pro</strong>. Puoi usare l’AI senza limiti del piano.
        </p>
        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#a855f7",
            borderRadius: 999,
            padding: "10px 20px",
            color: "white",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Torna alla ricerca
        </Link>
      </div>
    </main>
  );
}


