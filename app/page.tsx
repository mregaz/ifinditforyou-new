"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("it");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, lang }),
      });
      const data = await res.json();
      if (data.ok) setResults(data.results);
      else setResults(["Errore nella risposta AI"]);
    } catch (err) {
      console.error(err);
      setResults(["Errore di connessione."]);
    }

    setLoading(false);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui",
        backgroundColor: "#0a0a0a",
        color: "white",
        padding: "2rem",
      }}
    >
      <div style={{ width: "min(720px, 92vw)" }}>
        <h1 style={{ textAlign: "center", marginBottom: 12, fontSize: 28 }}>
          I find it for you
        </h1>

        {/* Selettore lingua */}
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <label style={{ fontSize: 14, color: "#aaa", marginRight: 8 }}>
            Lingua:
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: "#1a1a1a",
              color: "white",
              borderRadius: 8,
              padding: "6px 10px",
              border: "1px solid #444",
            }}
          >
            <option value="it">🇮🇹 Italiano</option>
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </div>

        {/* Barra di ricerca */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Cosa vuoi che trovi per te?"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 999,
              border: "1px solid #444",
              backgroundColor: "#1a1a1a",
              color: "white",
              fontSize: 16,
            }}
          />
          <button
            onClick={onSearch}
            style={{
              padding: "12px 16px",
              borderRadius: 999,
              background:
                "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
              minWidth: 110,
            }}
          >
            {loading ? "Sto cercando..." : "Trovalo per me"}
          </button>
        </div>

        {/* Risultati */}
        <div style={{ marginTop: 24, color: "#ccc" }}>
          {loading && (
            <div
              style={{
                padding: 16,
                borderRadius: 12,
                border: "1px solid #333",
                backgroundColor: "#111",
                fontSize: 14,
                color: "#9b9bff",
              }}
            >
              Sto cercando per te…
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {results.map((line, i) => (
                <li
                  key={i}
                  style={{
                    padding: 12,
                    border: "1px solid #333",
                    borderRadius: 12,
                    backgroundColor: "#111",
                    marginTop: 8,
                    fontSize: 15,
                    lineHeight: 1.4,
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#555",
            marginTop: 32,
          }}
        >
          © 2025 ifinditforyou.com — powered by AI
        </footer>
      </div>
    </main>
  );
}
