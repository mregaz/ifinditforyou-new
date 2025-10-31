"use client";
import { useState } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("it"); // lingua scelta (per ora non la mandiamo all'API, la integriamo dopo)
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      // chiamiamo la nostra API route con metodo GET
      const url = `/api/search?q=${encodeURIComponent(query)}`;
      const res = await fetch(url, {
        method: "GET",
      });

      const data = await res.json();

      if (Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setResults(["Risposta non valida dal server."]);
      }
    } catch (err) {
      console.error(err);
      setResults(["Errore di connessione."]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        onSearch();
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
        backgroundColor: "#0a0a0a",
        color: "white",
        padding: "2rem",
      }}
    >
      <div style={{ width: "min(720px, 92vw)" }}>
        {/* titolo */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontSize: 28,
            fontWeight: 600,
            background: "linear-gradient(90deg,#fff,#8b5cf6)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          I find it for you
        </h1>

        {/* sottotitolo */}
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            lineHeight: 1.4,
            color: "#9ca3af",
            maxWidth: "46ch",
            margin: "0 auto 20px auto",
          }}
        >
          Il tuo assistente personale AI. Dimmi cosa cerchi e ti propongo 2-3
          opzioni migliori, subito.
        </p>

        {/* blocco lingua */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 16,
            display: "flex",
            justifyContent: "center",
            gap: 8,
            flexWrap: "wrap",
            color: "#aaa",
            fontSize: 14,
          }}
        >
          <label style={{ color: "#aaa" }}>Lingua risposta:</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: "#1a1a1a",
              color: "white",
              borderRadius: 8,
              padding: "6px 10px",
              border: "1px solid #444",
              fontSize: 14,
              minWidth: 120,
            }}
          >
            <option value="it">🇮🇹 Italiano</option>
            <option value="en">🇬🇧 English</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="de">🇩🇪 Deutsch</option>
          </select>
        </div>

        {/* barra di ricerca + bottone */}
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cosa vuoi che trovi per te?"
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 999,
              border: "1px solid #444",
              backgroundColor: "#1a1a1a",
              color: "white",
              fontSize: 16,
              outline: "none",
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
              minWidth: 130,
              fontSize: 14,
            }}
          >
            {loading ? "Sto cercando..." : "Trovalo per me"}
          </button>
        </div>

        {/* box risultati */}
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
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 8,
              }}
            >
              {results.map((line, i) => (
                <li
                  key={i}
                  style={{
                    padding: 12,
                    border: "1px solid #333",
                    borderRadius: 12,
                    backgroundColor: "#111",
                    fontSize: 15,
                    lineHeight: 1.4,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {line}
                </li>
              ))}
            </ul>
          )}

          {!loading && results.length === 0 && (
            <div
              style={{
                marginTop: 16,
                fontSize: 13,
                color: "#555",
                textAlign: "center",
              }}
            >
              Esempi:
              <br />
              <span style={{ color: "#888" }}>
                • Idee regalo per 50enne appassionato bici
              </span>
              <br />
              <span style={{ color: "#888" }}>
                • Weekend romantico vicino Milano
              </span>
              <br />
              <span style={{ color: "#888" }}>
                • Miglior notebook leggero per viaggiare
              </span>
            </div>
          )}
        </div>

        {/* footer */}
        <footer
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#555",
            marginTop: 40,
          }}
        >
          © 2025 ifinditforyou.com — powered by AI
        </footer>
      </div>
    </main>
  );
}

