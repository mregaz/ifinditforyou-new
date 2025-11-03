// app/page.tsx
"use client";

import { FormEvent, useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [lang, setLang] = useState<"it" | "en">("it");
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: request,
          lang,
          name: "",
        }),
      });

      if (!res.ok) throw new Error("errore");

      setStatus("ok");
      setEmail("");
      setRequest("");
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <main
      style={{
        maxWidth: "960px",
        margin: "0 auto",
        padding: "3rem 1.5rem 4rem",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <p style={{ opacity: 0.7, fontSize: "0.85rem" }}>
          Beta gratuita
        </p>
        <h1 style={{ fontSize: "2.7rem", fontWeight: 700, marginTop: "0.4rem" }}>
          iFindItForYou
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "1.1rem", lineHeight: 1.5, maxWidth: "46rem" }}>
          Ti mando direttamente il link migliore / l’opzione giusta. Tu scrivi cosa cerchi, io ti rispondo per email.
        </p>
      </header>

      <section
        style={{
          background: "rgba(15,23,42,0.5)",
          border: "1px solid rgba(148,163,184,0.2)",
          borderRadius: "1.25rem",
          padding: "1.5rem 1.5rem 1.25rem",
        }}
      >
        <form onSubmit={handleSubmit}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: "0.35rem" }}>
            La tua email
          </label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@esempio.com"
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "0.7rem",
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(15,23,42,0.35)",
              color: "inherit",
              marginBottom: "1rem",
            }}
          />

          <label style={{ display: "block", fontWeight: 500, marginBottom: "0.35rem" }}>
            Cosa ti devo trovare?
          </label>
          <textarea
            required
            rows={4}
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            placeholder="Esempio: 'un tool per creare fatture in italiano, gratis, che esporta in PDF'"
            style={{
              width: "100%",
              padding: "0.6rem 0.75rem",
              borderRadius: "0.7rem",
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(15,23,42,0.35)",
              color: "inherit",
              marginBottom: "1rem",
              resize: "vertical",
            }}
          />

          <label style={{ display: "block", fontWeight: 500, marginBottom: "0.35rem" }}>
            Come vuoi che ti risponda?
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "it" | "en")}
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.7rem",
              border: "1px solid rgba(148,163,184,0.35)",
              background: "rgba(15,23,42,0.35)",
              color: "inherit",
              marginBottom: "1.25rem",
            }}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
          </select>

          <button
            type="submit"
            disabled={status === "sending"}
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              border: "none",
              borderRadius: "9999px",
              padding: "0.7rem 1.4rem",
              fontWeight: 600,
              color: "white",
              cursor: "pointer",
            }}
          >
            {status === "sending" ? "Invio..." : "Contattami per la soluzione perfetta"}
          </button>

          {status === "ok" && (
            <p style={{ marginTop: "0.75rem", color: "#4ade80" }}>
              Fatto! Ti rispondo all’email che hai indicato.
            </p>
          )}
          {status === "error" && (
            <p style={{ marginTop: "0.75rem", color: "#fca5a5" }}>
              C’è stato un errore nell’invio. Riprova.
            </p>
          )}
        </form>
      </section>

      <footer style={{ marginTop: "2.5rem", opacity: 0.5, fontSize: "0.8rem" }}>
        <a href="/privacy" style={{ marginRight: "1rem" }}>
          Privacy
        </a>
        <a href="/terms">Termini</a>
        <div style={{ marginTop: "0.4rem" }}>© {new Date().getFullYear()} iFindItForYou</div>
      </footer>
    </main>
  );
}
