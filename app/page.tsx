"use client";

import { useState } from "react";

const TEXTS: Record<
  string,
  {
    beta: string;
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    langLabel: string;
    footerPrivacy: string;
    footerTerms: string;
    resultsTitle: string;
    empty: string;
  }
> = {
  it: {
    beta: "Beta gratuita",
    title: "iFindItForYou",
    subtitle:
      "Tu scrivi cosa cerchi, io ti mando il link/opzione giusta per email.",
    placeholder: "Cosa vuoi che trovi per te?",
    button: "Trovalo per me",
    langLabel: "Lingua dell’interfaccia",
    footerPrivacy: "Privacy",
    footerTerms: "Termini",
    resultsTitle: "Ecco alcune opzioni:",
    empty: "Scrivi cosa cerchi sopra 👆",
  },
  en: {
    beta: "Free beta",
    title: "iFindItForYou",
    subtitle:
      "You tell me what you need, I send you the best link/option by email.",
    placeholder: "What do you want me to find?",
    button: "Find it for me",
    langLabel: "Interface language",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    resultsTitle: "Here are some options:",
    empty: "Tell me what you’re looking for 👆",
  },
  fr: {
    beta: "Bêta gratuite",
    title: "iFindItForYou",
    subtitle:
      "Tu écris ce que tu cherches, je t’envoie le bon lien / la bonne option par email.",
    placeholder: "Qu’est-ce que tu veux que je trouve ?",
    button: "Trouve-le pour moi",
    langLabel: "Langue de l’interface",
    footerPrivacy: "Confidentialité",
    footerTerms: "Conditions",
    resultsTitle: "Quelques options :",
    empty: "Écris ce que tu cherches 👆",
  },
  de: {
    beta: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle:
      "Du schreibst, was du suchst, ich schicke dir den richtigen Link per E-Mail.",
    placeholder: "Was soll ich für dich finden?",
    button: "Finde es für mich",
    langLabel: "Sprache",
    footerPrivacy: "Datenschutz",
    footerTerms: "AGB",
    resultsTitle: "Einige Vorschläge:",
    empty: "Schreib oben, was du suchst 👆",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<"it" | "en" | "fr" | "de">("it");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");

  const t = TEXTS[lang];

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&lang=${lang}`
      );

      if (!res.ok) {
        throw new Error("API non disponibile");
      }

      const data = await res.json();

      if (Array.isArray(data.results)) {
        setResults(data.results);
      } else {
        setResults([
          `Idea 1 per: ${q}`,
          `Idea 2 per: ${q}`,
          `Idea 3 per: ${q}`,
        ]);
      }
    } catch (err) {
      setError("Non sono riuscito a chiamare l’API, ti propongo qualcosa io.");
      setResults([
        `🔍 Migliore opzione per: ${q}`,
        `✨ Alternativa semplice per: ${q}`,
        `💡 Un’altra soluzione per: ${q}`,
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "40px 16px 24px",
      }}
    >
      {/* blocco centrale */}
      <div
        style={{
          width: "min(900px, 95%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          textAlign: "center",
          marginTop: "-5vh",
        }}
      >
        <p style={{ fontSize: 14, opacity: 0.7, marginBottom: 8 }}>{t.beta}</p>

        <h1
          style={{
            fontSize: "clamp(48px, 6vw, 72px)",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: 20,
            maxWidth: 720,
            lineHeight: 1.4,
            opacity: 0.9,
            marginBottom: 32,
          }}
        >
          {t.subtitle}
        </p>

        {/* input + button */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.placeholder}
            style={{
              flex: 1,
              minWidth: 320,
              background: "rgba(255,255,255,0.05)",
              border: "2px solid rgba(148,163,184,0.3)",
              borderRadius: 999,
              padding: "15px 20px",
              fontSize: 16,
              color: "white",
              outline: "none",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              background: loading ? "#7c3aed" : "#a855f7",
              border: "none",
              borderRadius: 999,
              padding: "15px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Sto cercando…" : t.button}
          </button>
        </div>

        {/* select lingua */}
        <div style={{ marginBottom: 30 }}>
          <label style={{ fontSize: 14, opacity: 0.7, marginRight: 12 }}>
            {t.langLabel}
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            style={{
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.3)",
              color: "white",
              padding: "6px 12px",
              borderRadius: 8,
            }}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* risultati */}
        <div style={{ width: "100%", maxWidth: 700 }}>
          {results.length === 0 ? (
            <p style={{ opacity: 0.6 }}>{t.empty}</p>
          ) : (
            <>
              <h3 style={{ fontSize: 18, marginBottom: 12 }}>
                {t.resultsTitle}
              </h3>
              {error && (
                <p style={{ color: "#f97316", marginBottom: 8, fontSize: 14 }}>
                  {error}
                </p>
              )}
              <div style={{ display: "grid", gap: 12 }}>
                {results.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      borderRadius: 14,
                      padding: "12px 16px",
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* footer */}
      <footer
        style={{
          width: "min(1100px, 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          fontSize: 14,
          opacity: 0.75,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p>© 2025 iFindItForYou</p>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/privacy" style={{ color: "white" }}>
            {t.footerPrivacy}
          </a>
          <a href="/terms" style={{ color: "white" }}>
            {t.footerTerms}
          </a>
          <a href="/en/privacy" style={{ color: "white" }}>
            EN Privacy
          </a>
          <a href="/en/terms" style={{ color: "white" }}>
            EN Terms
          </a>
        </div>
      </footer>
    </main>
  );
}


