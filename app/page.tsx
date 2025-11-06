"use client";

import { useState } from "react";

// testi per le 4 lingue
const UI_TEXTS = {
  it: {
    beta: "Beta gratuita",
    title: "iFindItForYou",
    subtitle: "Scrivi cosa ti serve, l’AI ti propone i link migliori.",
    placeholder: "Es. iPhone 13 mini blu sotto 350 CHF in Svizzera",
    button: "Cerca",
    langLabel: "Lingua",
    resultsTitle: "Ecco cosa ho trovato:",
    empty: "Fai una ricerca per vedere i risultati 👆",
    formTitle: "Vuoi che te lo mandi via email?",
    formSubtitle: "Lasciami i dettagli e ti rispondo.",
    emailLabel: "La tua email",
    msgLabel: "Cosa devo trovare?",
    replyLabel: "Rispondimi in",
    submit: "Invia richiesta",
    ok: "Ricevuto! Ti scrivo appena posso 👍",
    ko: "Errore nell’invio. Riprova.",
    aboutTitle: "💡 Cos’è iFindItForYou",
    aboutText:
      "Un piccolo assistente online che trova per te il prodotto o servizio che cerchi.",
    feedbackText: "Hai idee o vuoi collaborare?",
    showExamplesBtn: "Mostra un esempio 👀",
  },
  en: {
    beta: "Free beta",
    title: "iFindItForYou",
    subtitle: "Tell me what you need, I’ll find the best options.",
    placeholder: "e.g. vintage Nikon camera under 200 CHF",
    button: "Search",
    langLabel: "Language",
    resultsTitle: "Here are some options:",
    empty: "Search above to see results 👆",
    formTitle: "Want it by email?",
    formSubtitle: "Leave your details, I’ll reply.",
    emailLabel: "Your email",
    msgLabel: "What should I find?",
    replyLabel: "Reply in",
    submit: "Send request",
    ok: "Got it! I’ll email you 👍",
    ko: "Error sending. Try again.",
    aboutTitle: "💡 About iFindItForYou",
    aboutText:
      "A tiny online assistant that finds the best options for you.",
    feedbackText: "Got ideas or want to help?",
    showExamplesBtn: "Show me an example 👀",
  },
  fr: {
    beta: "Bêta gratuite",
    title: "iFindItForYou",
    subtitle: "Tu écris ton besoin, l’IA te propose les meilleurs liens.",
    placeholder: "ex. iPhone 13 mini bleu sous 350 CHF en Suisse",
    button: "Chercher",
    langLabel: "Langue",
    resultsTitle: "Voici quelques options :",
    empty: "Fais une recherche pour voir les résultats 👆",
    formTitle: "Tu veux le recevoir par email ?",
    formSubtitle: "Laisse-moi les détails.",
    emailLabel: "Ton email",
    msgLabel: "Qu’est-ce que je dois trouver ?",
    replyLabel: "Je te réponds en",
    submit: "Envoyer la demande",
    ok: "Bien reçu 👍",
    ko: "Erreur d’envoi.",
    aboutTitle: "💡 À propos",
    aboutText:
      "Un petit assistant en ligne pour trouver des produits/solutions.",
    feedbackText: "Envie d’aider ?",
    showExamplesBtn: "Montre-moi un exemple 👀",
  },
  de: {
    beta: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle: "Schreib, was du brauchst – die KI findet es.",
    placeholder: "z.B. Nikon Kamera unter 200 CHF",
    button: "Suchen",
    langLabel: "Sprache",
    resultsTitle: "Hier ein paar Vorschläge:",
    empty: "Suche oben, um Ergebnisse zu sehen 👆",
    formTitle: "Per E-Mail bekommen?",
    formSubtitle: "Gib mir die Details, ich antworte.",
    emailLabel: "Deine E-Mail",
    msgLabel: "Was soll ich finden?",
    replyLabel: "Antwort in",
    submit: "Anfrage senden",
    ok: "Danke! Ich antworte bald 👍",
    ko: "Fehler beim Senden.",
    aboutTitle: "💡 Über iFindItForYou",
    aboutText: "Kleiner Online-Assistent, der für dich recherchiert.",
    feedbackText: "Ideen oder Lust zu helfen?",
    showExamplesBtn: "Beispiel zeigen 👀",
  },
} as const;

export default function HomePage() {
  // stato base
  const [lang, setLang] = useState<"it" | "en" | "fr" | "de">("it");
  const t = UI_TEXTS[lang];

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showExamples, setShowExamples] = useState(false);

  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiCreditsLeft, setAiCreditsLeft] = useState<number | null>(null);

  // form lead
  const [email, setEmail] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadLang, setLeadLang] = useState<"it" | "en" | "fr" | "de">("it");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadOk, setLeadOk] = useState(false);
  const [leadErr, setLeadErr] = useState(false);

  // ricerca "normale"
  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&lang=${lang}`);
      if (!res.ok) throw new Error("API non disponibile");
      const data = await res.json();
      setResults(
        Array.isArray(data.results) && data.results.length > 0
          ? data.results
          : [`Non ho trovato molto su “${q}”. Scrivimi sotto 👇`]
      );
      setShowExamples(true);
    } catch (err) {
      setSearchError("Non riesco a chiamare l’AI adesso, ti lascio 3 idee.");
      setResults([
        `1) Cerca comparatori per “${q}”`,
        `2) Guarda marketplace europei`,
        `3) Se vuoi che lo faccia io, usa il form sotto.`,
      ]);
      setShowExamples(true);
    } finally {
      setSearchLoading(false);
    }
  };

  // ricerca AI (quella che ora è su Vercel)
  const handleAiFinder = async () => {
    const q = query.trim();
    if (!q) return;
    setAiLoading(true);
    setAiError("");
    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, lang }),
      });
      const data = await res.json();

      if (res.status === 402 || data?.action === "purchase") {
        setAiError("Crediti esauriti. Usa il form sotto 👇");
        setShowExamples(true);
        return;
      }

      setAiCreditsLeft(data.creditsLeft ?? null);

      let parsed: any = null;
      try {
        parsed = JSON.parse(data.data);
      } catch {
        parsed = { summary: data.data };
      }

      const aiResults: string[] = [];
      if (Array.isArray(parsed?.items)) {
        parsed.items.forEach((item: any) => {
          aiResults.push(
            `${item.title ?? "Senza titolo"} — ${item.price ?? "N/D"} — ${item.source ?? "sorgente n/d"}`
          );
        });
      }
      if (parsed?.summary) aiResults.push(parsed.summary);

      setResults(
        aiResults.length > 0 ? aiResults : ["AI ha risposto ma non leggo i risultati."]
      );
      setShowExamples(true);
    } catch (err) {
      setAiError("Non riesco a parlare con l’AI adesso.");
    } finally {
      setAiLoading(false);
    }
  };

  // invio form
  const handleLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadLoading(true);
    setLeadOk(false);
    setLeadErr(false);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: leadMsg || query,
          lang: leadLang,
        }),
      });
      if (!res.ok) throw new Error("send fail");
      setLeadOk(true);
      setEmail("");
      setLeadMsg("");
    } catch (err) {
      setLeadErr(true);
    } finally {
      setLeadLoading(false);
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
        gap: 36,
        padding: "32px 16px 24px",
      }}
    >
      {/* HERO COMPATTA */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p style={{ opacity: 0.6, marginBottom: 6 }}>{t.beta}</p>
        <h1
          style={{
            fontSize: "clamp(40px, 6vw, 70px)",
            fontWeight: 700,
            marginBottom: 10,
          }}
        >
          {t.title}
        </h1>
        <p
          style={{
            opacity: 0.85,
            marginBottom: 20,
          }}
        >
          {t.subtitle}
        </p>

        {/* campo + bottoni */}
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 12,
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.placeholder}
            style={{
              minWidth: 280,
              width: "55%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(148,163,184,0.3)",
              borderRadius: 999,
              padding: "14px 20px",
              color: "white",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              background: searchLoading ? "#7c3aed" : "#a855f7",
              border: "none",
              borderRadius: 999,
              padding: "14px 26px",
              fontWeight: 600,
              cursor: searchLoading ? "not-allowed" : "pointer",
            }}
          >
            {searchLoading ? "Cerco..." : t.button}
          </button>
          <button
            onClick={handleAiFinder}
            disabled={aiLoading}
            style={{
              background: "rgba(148,163,184,0.08)",
              border: "1px solid rgba(148,163,184,0.3)",
              borderRadius: 999,
              padding: "14px 20px",
              color: "white",
              cursor: aiLoading ? "not-allowed" : "pointer",
            }}
          >
            {aiLoading ? "AI in corso..." : "Trovalo con l’AI"}
          </button>
        </div>

        {/* select lingua */}
        <div style={{ marginTop: 8 }}>
          <label style={{ opacity: 0.5, marginRight: 8 }}>{t.langLabel}</label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            style={{
              background: "transparent",
              border: "1px solid rgba(148,163,184,0.3)",
              color: "white",
              padding: "4px 10px",
              borderRadius: 8,
            }}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {aiCreditsLeft !== null && (
          <p style={{ fontSize: 12, opacity: 0.5, marginTop: 6 }}>
            Crediti AI rimasti: {aiCreditsLeft}
          </p>
        )}
      </div>

      {/* RISULTATI */}
      <div
        style={{
          maxWidth: 850,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {aiError && (
          <p style={{ color: "#f97316", marginBottom: 10 }}>{aiError}</p>
        )}

        {results.length > 0 || searchError || showExamples ? (
          <>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>
              {t.resultsTitle}
            </h3>
            {searchError && (
              <p style={{ color: "#f97316", marginBottom: 10 }}>
                {searchError}
              </p>
            )}
            {results.length === 0 ? (
              <p style={{ opacity: 0.5 }}>{t.empty}</p>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {results.map((r, i) => (
                  <div
                    key={i}
                    style={{
                      background: "rgba(255,255,255,0.02)",
                      border: "1px solid rgba(148,163,184,0.2)",
                      borderRadius: 16,
                      padding: "12px 16px",
                    }}
                  >
                    {r}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <button
            onClick={() => setShowExamples(true)}
            style={{
              background: "rgba(168,85,247,0.12)",
              border: "1px solid rgba(168,85,247,0.4)",
              borderRadius: 999,
              padding: "8px 16px",
              color: "white",
              cursor: "pointer",
            }}
          >
            {t.showExamplesBtn}
          </button>
        )}
      </div>

      {/* FORM LEAD — quello tuo, ma a tendina material */}
      {/* qui incolli il <details> material con freccetta che abbiamo fatto prima */}
      {/* ... */}

      {/* ABOUT */}
      <div
        style={{
          maxWidth: 850,
          width: "100%",
          margin: "0 auto 30px",
          textAlign: "center",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(148,163,184,0.15)",
          borderRadius: 20,
          padding: "24px 20px",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 10 }}>{t.aboutTitle}</h2>
        <p
          style={{
            fontSize: 15,
            opacity: 0.8,
            maxWidth: 650,
            margin: "0 auto 18px",
          }}
        >
          {t.aboutText}
        </p>
        <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 6 }}>
          {t.feedbackText}
        </p>
        <a
          href="mailto:info@ifinditforyou.com"
          style={{ color: "#a855f7", textDecoration: "none" }}
        >
          info@ifinditforyou.com
        </a>
      </div>

      <footer
        style={{
          maxWidth: 850,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          opacity: 0.6,
        }}
      >
        <p>© 2025 iFindItForYou</p>
        <div style={{ display: "flex", gap: 12 }}>
          <a href="/privacy" style={{ color: "white" }}>
            Privacy
          </a>
          <a href="/terms" style={{ color: "white" }}>
            Termini
          </a>
        </div>
      </footer>
    </main>
  );
}
