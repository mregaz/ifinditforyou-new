// app/pay/success/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PaySuccessPage() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Segna utente PRO
      localStorage.setItem("ai_plan", "pro");
      // Reset crediti usati
      localStorage.setItem("aiCredits", "10"); 
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
        <h1 style={{ fontSize: 28, marginBottom: 12 }}>Pagamento riuscito 🎉</h1>

        <p style={{ opacity: 0.85, marginBottom: 22, lineHeight: 1.5 }}>
          Hai attivato <strong style={{ color: "#a855f7" }}>Ricerca Pro</strong>.<br />
          Hai ora <strong>10 crediti</strong> disponibili.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "#a855f7",
            borderRadius: 999,
            padding: "12px 22px",
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


