"use client";
import { useState, useMemo } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("it");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // 👇 dizionario UI
  const t = useMemo(() => {
    const translations: Record<string, any> = {
      it: {
        title: "I find it for you",
        subtitle: "Il tuo assistente personale AI. Dimmi cosa cerchi e ti propongo subito 2-3 opzioni migliori.",
        placeholder: "Cosa vuoi che trovi per te?",
        button: loading ? "Sto cercando..." : "Trovalo per me",
        loading: "Sto cercando per te…",
        examplesTitle: "Esempi:",
        examples: [
          "Idee regalo per 50enne appassionato di bici",
          "Weekend romantico vicino Milano",
          "Miglior notebook leggero per viaggiare",
        ],
        footer: "© 2025 ifinditforyou.com — powered by AI",
      },
      en: {
        title: "I find it for you",
        subtitle: "Your personal AI assistant. Tell me what you’re looking for and I’ll suggest the best 2–3 options right away.",
        placeholder: "What do you want me to find for you?",
        button: loading ? "Searching..." : "Find it for me",
        loading: "Searching for you...",
        examplesTitle: "Examples:",
        examples: [
          "Gift ideas for a 50-year-old cycling enthusiast",
          "Romantic weekend near Milan",
          "Best lightweight laptop for travel",
        ],
        footer: "© 2025 ifinditforyou.com — powered by AI",
      },
      fr: {
        title: "Je le trouve pour toi",
        subtitle: "Ton assistant IA personnel. Dis-moi ce que tu cherches et je te propose 2–3 options idéales.",
        placeholder: "Que veux-tu que je trouve pour toi ?",
        button: loading ? "Je cherche..." : "Trouve-le pour moi",
        loading: "Je cherche pour toi…",
        examplesTitle: "Exemples :",
        examples: [
          "Idées cadeau pour une femme de 60 ans qui aime cuisiner",
          "Week-end romantique près de Milan",
          "Meilleur ordinateur portable léger pour voyager",
        ],
        footer: "© 2025 ifinditforyou.com — propulsé par l’IA",
      },
      de: {
        title: "Ich finde es für dich",
        subtitle: "Dein persönlicher KI-Assistent. Sag mir, was du suchst, und ich schlage dir 2–3 Top-Optionen vor.",
        placeholder: "Was soll ich für dich finden?",
        button: loading ? "Suche läuft..." : "Finde es für mich",
        loading: "Ich suche für dich…",
        examplesTitle: "Beispiele:",
        examples: [
          "Geschenkideen für einen 50-jährigen Fahrradfan",
          "Romantisches Wochenende in der Nähe von Mailand",
          "Bestes leichtes Notebook für Reisen",
        ],
        footer: "© 2025 ifinditforyou.com — unterstützt von KI",
      },
    };
    return translations[lang];
  }, [lang, loading]);

  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);

    try {
      const url = `/api/search?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(lang)}`;
      const res = await fetch(url, { method: "GET" });
      const data = await res.json();

      if (Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setResults(["Invalid response from server."]);
      }
    } catch (err) {
      console.error(err);
      setResults(["Connection error."]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearch();
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
          {t.title}
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
          {t.subtitle}
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
          <label style={{ color: "#aaa" }}>🌐 Language:</label>
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
            placeholder={t.placeholder}
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
              background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
              border: "none",
              color: "white",
              fontWeight: 500,
              cursor: "pointer",
              minWidth: 130,
              fontSize: 14,
            }}
          >
            {t.button}
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
              {t.loading}
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
              {t.examplesTitle}
              <br />
              {t.examples.map((ex: string, i: number) => (
                <div key={i} style={{ color: "#888" }}>
                  • {ex}
                </div>
              ))}
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
          {t.footer}
        </footer>
      </div>
    </main>
  );
}

