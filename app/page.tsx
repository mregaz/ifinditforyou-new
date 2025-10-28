"use client";

import { useState } from "react";

export default function IFindTForYou() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResults([
        `Ho trovato 3 opzioni per "${query}":`,
        "1️⃣ MacBook Air M3 - performance e leggerezza",
        "2️⃣ Lenovo Yoga 7i - ottimo equilibrio qualità/prezzo",
        "3️⃣ ASUS Zenbook 14 - design premium e autonomia top",
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        <span style={styles.sparkle}>✧</span> I Find It For You
      </h1>

      <p style={styles.subtitle}>
        Il tuo assistente AI personale che trova ciò che cerchi — prodotti,
        idee, offerte, viaggi e molto altro.
      </p>

      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="Scrivi cosa vuoi che trovi per te..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button} aria-label="Cerca">
          {loading ? "..." : "🔎"}
        </button>
      </div>

      <div style={styles.card}>
        {loading ? (
          <p style={styles.loading}>Sto cercando per te…</p>
        ) : (
          results.map((res, i) => (
            <p key={i} style={styles.result}>
              {res}
            </p>
          ))
        )}
      </div>

      <footer style={styles.footer}>
        © 2025 ifinditforyou.com — powered by AI
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, rgb(3,7,18), rgb(17,24,39))",
    color: "#e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    textAlign: "center",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  },
  title: {
    fontSize: 36,
    fontWeight: 800,
    margin: "0 0 8px",
    display: "flex",
    gap: 8,
    alignItems: "center",
    color: "#e5e7eb",
  },
  sparkle: { color: "#818cf8" },
  subtitle: {
    color: "#9ca3af",
    maxWidth: 640,
    margin: "0 auto 24px",
    lineHeight: 1.5,
  },
  searchRow: {
    display: "flex",
    gap: 8,
    width: "min(640px, 92vw)",
    marginBottom: 16,
  },
  input: {
    flex: 1,
    backgroundColor: "#1f2937",
    border: "1px solid #374151",
    color: "#e5e7eb",
    padding: "12px 14px",
    borderRadius: 999,
    outline: "none",
  },
  button: {
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: 999,
    padding: "12px 16px",
    cursor: "pointer",
  },
  card: {
    width: "min(640px, 92vw)",
    backgroundColor: "#111827",
    border: "1px solid #1f2937",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    minHeight: 150,
    textAlign: "left",
  },
  loading: { color: "#818cf8" },
  result: { color: "#d1d5db", margin: "8px 0" },
  footer: { marginTop: 32, color: "#6b7280", fontSize: 12 },
};
