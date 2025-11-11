// app/pay/success/page.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function PaySuccessPage() {
  useEffect(() => {
    // appena arrivo qui, resetto il contatore delle ricerche AI
    if (typeof window !== "undefined") {
      localStorage.setItem("ai_uses", "0");
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
          maxWidth: 420,
          width: "100%",
          textAlign: "center",
          padding: "30px 24px",
          boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
        }}
      >
        <h1 style={{ fontSize: 26, marginBottom: 10 }}>Pagamento riuscito 🎉</h1>
        <p style={{ opacity: 0.8, marginBottom: 20 }}>
          Hai di nuovo crediti per usare la ricerca AI.
        </p>
        <p style={{ opacity: 0.6, marginBottom: 28, fontSize: 14 }}>
          Puoi tornare alla home e rifare la tua ricerca adesso.
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

