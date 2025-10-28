"use client";
export const experimental_ppr = false;

import { useState } from "react";

export default function Home() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const onSearch = () => {
    if (!q.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResults([`Top 1 per: ${q}`, `Alternativa valida per: ${q}`, "Scelta premium"]);
      setLoading(false);
    }, 600);
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", fontFamily: "system-ui" }}>
      <div style={{ width: "min(720px, 92vw)" }}>
        <h1 style={{ textAlign: "center", marginBottom: 12 }}>I find it for you</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Cosa vuoi che trovi per te?"
            style={{ flex: 1, padding: 12, borderRadius: 999, border: "1px solid #ddd" }}
          />
          <button onClick={onSearch} style={{ padding: "12px 16px", borderRadius: 999 }}>
            Trovalo per me
          </button>
        </div>
        <div style={{ marginTop: 16, color: "#666" }}>
          {loading ? "Sto cercando per te…" : null}
          {!loading && results.length > 0 && (
            <ul>
              {results.map((r, i) => (
                <li key={i} style={{ padding: 8, border: "1px solid #eee", borderRadius: 12, marginTop: 8 }}>
                  {r}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
