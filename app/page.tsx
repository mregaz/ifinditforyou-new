"use client";

import { useState } from "react";

// testi per le 4 lingue
// testi per le 4 lingue
const UI_TEXTS = {
  it: {
    beta: "AI Finder per prodotti introvabili",
    title: "Trova l’introvabile",
    subtitle:
      "Scrivi cosa cerchi — l’AI esplora marketplace, fonti nascoste e motori Pro per trovartelo prima di chiunque altro.",
    placeholder: "Es. profumo vintage Dior 1985, o videocamera Sony anni 90",
    button: "Cerca",
    aiButton: "Trovalo con l’AI",
    langLabel: "Lingua",
    resultsTitle: "Ecco cosa ho trovato:",
    empty: "Fai una ricerca per vedere i risultati 👆",
    formTitle: "Non lo hai trovato?",
    formSubtitle: "Posso cercarlo io e mandartelo via email.",
    emailLabel: "La tua email",
    msgLabel: "Cosa devo trovare?",
    replyLabel: "Rispondimi in",
    submit: "Invia richiesta",
    ok: "Ricevuto! Ti scrivo appena posso 👍",
    ko: "Errore nell’invio. Riprova.",
    aboutTitle: "💡 Cos’è iFindItForYou",
    aboutText:
      "Un assistente AI che trova l’introvabile: oggetti fuori produzione, vintage, rari o equivalenti moderni.",
    feedbackText: "Hai un’idea o vuoi collaborare?",
    showExamplesBtn: "Mostra un esempio 👀",
    proSectionTitle: "⏱️ Vuoi guadagnare tempo?",
    proSectionText:
      "I motori pubblici mostrano milioni di risultati. Noi interroghiamo le fonti nascoste e i motori AI professionali per darti subito ciò che cerchi.",
    proCTA: "Attiva la Ricerca Pro ⚡",
  },
  en: {
    beta: "AI Finder for rare products",
    title: "Find the Unfindable",
    subtitle:
      "Type what you’re looking for — the AI searches hidden marketplaces and Pro engines to locate it before anyone else.",
    placeholder: "e.g. vintage Dior perfume 1985, or Sony camera from the 90s",
    button: "Search",
    aiButton: "Find it with AI",
    langLabel: "Language",
    resultsTitle: "Here’s what I found:",
    empty: "Search above to see results 👆",
    formTitle: "Didn’t find it?",
    formSubtitle: "I can search it for you and email the results.",
    emailLabel: "Your email",
    msgLabel: "What should I find?",
    replyLabel: "Reply in",
    submit: "Send request",
    ok: "Got it! I’ll email you soon 👍",
    ko: "Error sending. Try again.",
    aboutTitle: "💡 About iFindItForYou",
    aboutText:
      "An AI assistant that finds the unfindable: discontinued, rare, or vintage products — and modern equivalents.",
    feedbackText: "Got an idea or want to collaborate?",
    showExamplesBtn: "Show an example 👀",
    proSectionTitle: "⏱️ Want to save time?",
    proSectionText:
      "Public search engines show millions of results. We query hidden sources and professional AI engines to get you the right ones instantly.",
    proCTA: "Enable Pro Search ⚡",
  },
  fr: {
    beta: "Chercheur IA pour produits introuvables",
    title: "Trouve l’introuvable",
    subtitle:
      "Écris ce que tu cherches — l’IA explore les marketplaces, sources cachées et moteurs Pro pour te le trouver avant tout le monde.",
    placeholder: "ex. parfum Dior vintage 1985, ou caméra Sony des années 90",
    button: "Chercher",
    aiButton: "Trouver avec l’IA",
    langLabel: "Langue",
    resultsTitle: "Voici ce que j’ai trouvé :",
    empty: "Fais une recherche pour voir les résultats 👆",
    formTitle: "Tu ne l’as pas trouvé ?",
    formSubtitle: "Je peux le chercher pour toi et te l’envoyer par e-mail.",
    emailLabel: "Ton email",
    msgLabel: "Que dois-je trouver ?",
    replyLabel: "Réponds-moi en",
    submit: "Envoyer la demande",
    ok: "Bien reçu ! Je te réponds vite 👍",
    ko: "Erreur d’envoi. Réessaye.",
    aboutTitle: "💡 À propos de iFindItForYou",
    aboutText:
      "Un assistant IA qui trouve l’introuvable : objets rares, vintage ou équivalents modernes.",
    feedbackText: "Envie d’aider ou d’échanger une idée ?",
    showExamplesBtn: "Voir un exemple 👀",
    proSectionTitle: "⏱️ Gagne du temps",
    proSectionText:
      "Les moteurs publics affichent des millions de résultats. Nous interrogeons les sources cachées et les moteurs IA Pro pour te donner l’essentiel.",
    proCTA: "Activer la recherche Pro ⚡",
  },
  de: {
    beta: "KI-Suchmaschine für seltene Produkte",
    title: "Finde das Unauffindbare",
    subtitle:
      "Schreib, was du suchst – die KI durchsucht versteckte Quellen und Pro-Suchmaschinen, um es zuerst zu finden.",
    placeholder: "z.B. Dior Parfüm von 1985 oder Sony Kamera aus den 90ern",
    button: "Suchen",
    aiButton: "Mit KI finden",
    langLabel: "Sprache",
    resultsTitle: "Hier ist, was ich gefunden habe:",
    empty: "Suche oben, um Ergebnisse zu sehen 👆",
    formTitle: "Nicht gefunden?",
    formSubtitle: "Ich kann es für dich suchen und per E-Mail schicken.",
    emailLabel: "Deine E-Mail",
    msgLabel: "Was soll ich finden?",
    replyLabel: "Antwort in",
    submit: "Anfrage senden",
    ok: "Erhalten! Ich melde mich bald 👍",
    ko: "Fehler beim Senden. Versuche es erneut.",
    aboutTitle: "💡 Über iFindItForYou",
    aboutText:
      "Ein KI-Assistent, der das Unauffindbare findet: seltene, Vintage- oder nicht mehr produzierte Artikel.",
    feedbackText: "Ideen oder Lust auf Zusammenarbeit?",
    showExamplesBtn: "Beispiel anzeigen 👀",
    proSectionTitle: "⏱️ Zeit sparen",
    proSectionText:
      "Öffentliche Suchmaschinen zeigen Millionen Ergebnisse. Wir befragen versteckte Quellen und professionelle KI-Engines, um dir sofort das Richtige zu liefern.",
    proCTA: "Pro-Suche aktivieren ⚡",
  },
} as const;


export default function HomePage() {
  // 📌 stato che comanda IL POPUP
  const [showLead, setShowLead] = useState(false);

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

  // ricerca AI
// ricerca AI (versione con piano free/pro + pagamento)
const handleAiFinder = async () => {
  const q = query.trim();
  if (!q) return;

  // 🔐 stato "Pro" dopo acquisto (salvato alla /pay/success)
  const isPro =
    typeof window !== "undefined" &&
    (localStorage.getItem("ai_plan") === "pro" ||
      localStorage.getItem("ai_plan") === "lifetime");

  // 📊 conteggio usi per gli utenti Free
  const currentUses =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("ai_uses") || "0")
      : 0;

  // ⛔️ se NON sei Pro e hai finito le 3 gratuite → monetizza
  if (!isPro && currentUses >= 3) {
    setAiError(
      lang === "it"
        ? "Hai usato le 3 ricerche gratuite. Puoi acquistare i crediti Pro."
        : lang === "fr"
        ? "Tu as utilisé les 3 recherches gratuites. Tu peux acheter des crédits Pro."
        : lang === "de"
        ? "Du hast die 3 Gratis-Suchen verwendet. Kaufe Pro-Credits."
        : "You used the 3 free searches. You can buy Pro credits."
    );
    setResults([
      lang === "it"
        ? "Per continuare: attiva la Ricerca Pro (10 crediti)."
        : lang === "fr"
        ? "Pour continuer : active la Recherche Pro (10 crédits)."
        : lang === "de"
        ? "Um fortzufahren: Pro-Suche aktivieren (10 Credits)."
        : "To continue: enable Pro Search (10 credits).",
    ]);

    // redirect dolce al checkout
    setTimeout(() => {
      window.location.href = "/api/pay";
    }, 1200);
    return;
  }

  // 🧭 piano da usare per questa chiamata
  const plan: "free" | "pro" = isPro ? "pro" : "free";

  setAiLoading(true);
  setAiError("");

  try {
    const res = await fetch("/api/finder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: q, lang, plan }), // ← passa il piano
    });

    const data = await res.json();

    // backend può ancora chiedere acquisto
    if (res.status === 402 || data?.action === "purchase") {
      setAiError(
        lang === "it"
          ? "Ricerche gratuite esaurite. Attiva la Ricerca Pro."
          : lang === "fr"
          ? "Recherches gratuites épuisées. Active la Recherche Pro."
          : lang === "de"
          ? "Gratis-Suchen aufgebraucht. Pro-Suche aktivieren."
          : "Free searches exhausted. Enable Pro Search."
      );
      setTimeout(() => {
        window.location.href = "/api/pay";
      }, 1000);
      return;
    }

    // parsing elastico
    let parsed: any = null;
    try {
      parsed = JSON.parse(data.data ?? data);
    } catch {
      parsed = data?.data ?? data;
    }

    const aiResults: string[] = [];
    if (Array.isArray(parsed?.items)) {
      parsed.items.forEach((item: any) => {
        aiResults.push(
          `${item.title ?? "Senza titolo"} — ${item.price ?? "N/D"} — ${
            item.source ?? "sorgente n/d"
          }`
        );
      });
    }
    if (parsed?.summary) aiResults.push(parsed.summary);
    if (typeof parsed === "string" && aiResults.length === 0) aiResults.push(parsed);

    if (aiResults.length > 0) {
      setResults(aiResults);
    } else {
      setResults([
        lang === "it"
          ? "La ricerca automatica non ha trovato un risultato da mostrarti qui."
          : lang === "fr"
          ? "La recherche automatique n’a pas trouvé de résultat à afficher ici."
          : lang === "de"
          ? "Die automatische Suche hat kein Ergebnis zum Anzeigen gefunden."
          : "The automatic search didn’t find a result to show here.",
      ]);
      setShowLead(true); // offri servizio email
    }

    // aggiorna conteggio SOLO se Free
    if (!isPro && typeof window !== "undefined") {
      localStorage.setItem("ai_uses", String(currentUses + 1));
    }

    setShowExamples(true);
  } catch (err) {
    setAiError(
      lang === "it"
        ? "Non riesco a parlare con l’AI adesso."
        : lang === "fr"
        ? "Je n’arrive pas à contacter l’IA."
        : lang === "de"
        ? "Ich kann die KI gerade nicht erreichen."
        : "I can’t reach the AI right now."
    );
    setShowLead(true);
  } finally {
    setAiLoading(false);
  }
};




  // invio form LEAD del popup
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
      // ✅ qui chiudiamo il popup dopo invio riuscito
      setShowLead(false);
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
      {/* HERO */}
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
  {aiLoading
    ? lang === "it"
      ? "AI in corso..."
      : lang === "fr"
      ? "IA en cours..."
      : lang === "de"
      ? "KI läuft..."
      : "AI running..."
    : t.aiButton}
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
            {/* BOX PRO – sezione per promuovere la ricerca Pro */}
      {(() => {
        // Nascondi il box se l’utente è già PRO
        const isPro =
          typeof window !== "undefined" &&
          (localStorage.getItem("ai_plan") === "pro" ||
            localStorage.getItem("ai_plan") === "lifetime");

        if (isPro) return null;

        return (
          <div
            style={{
              background: "rgba(168,85,247,0.10)",
              border: "1px solid rgba(168,85,247,0.35)",
              borderRadius: 16,
              padding: "16px 20px",
              textAlign: "center",
              maxWidth: 750,
              margin: "0 auto",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>
              {t.proSectionTitle}
            </h3>
            <p
              style={{
                margin: 0,
                marginBottom: 12,
                opacity: 0.85,
                lineHeight: 1.5,
              }}
            >
              {t.proSectionText}
            </p>
            <button
              onClick={() => (window.location.href = "/api/pay")}
              style={{
                background: "#a855f7",
                color: "white",
                border: "none",
                borderRadius: 999,
                padding: "10px 22px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 6px 20px rgba(168,85,247,0.35)",
              }}
            >
              {t.proCTA}
            </button>
          </div>
        );
      })()}
      {/* CONTATORE RICERCHE GRATUITE */}
      {(() => {
        if (typeof window === "undefined") return null;
        const isPro =
          localStorage.getItem("ai_plan") === "pro" ||
          localStorage.getItem("ai_plan") === "lifetime";

        if (isPro) return null;

        // recupera o inizializza il numero di ricerche rimanenti
        const [freeCount, setFreeCount] = useState<number | null>(null);

        useEffect(() => {
          const stored = localStorage.getItem("free_searches_left");
          if (stored) {
            setFreeCount(Number(stored));
          } else {
            localStorage.setItem("free_searches_left", "3");
            setFreeCount(3);
          }
        }, []);

        // ogni volta che viene fatta una ricerca, il conteggio scende (gestito nel handleAiFinder)
        useEffect(() => {
          const handleStorage = () => {
            const updated = localStorage.getItem("free_searches_left");
            if (updated) setFreeCount(Number(updated));
          };
          window.addEventListener("storage", handleStorage);
          return () => window.removeEventListener("storage", handleStorage);
        }, []);

        if (freeCount === null) return null;

        return (
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 14,
              opacity: 0.7,
            }}
          >
            {freeCount > 0 ? (
              <>
                🔹 Ti restano <b>{freeCount}</b> ricerche gratuite
              </>
            ) : (
              <>
                ⚡ Ricerche gratuite terminate —{" "}
                <span
                  style={{
                    color: "#a855f7",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={() => (window.location.href = "/api/pay")}
                >
                  passa alla versione Pro
                </span>
              </>
            )}
          </div>
        );
      })()}

{/* BOX PRO – mettilo sotto i campi di ricerca */}
{(() => {
  // Nascondi il box se l’utente è già PRO
  const isPro =
    typeof window !== "undefined" &&
    (localStorage.getItem("ai_plan") === "pro" ||
     localStorage.getItem("ai_plan") === "lifetime");

  if (isPro) return null;

  return (
    <div
      style={{
        background: "rgba(168,85,247,0.10)",
        border: "1px solid rgba(168,85,247,0.35)",
        borderRadius: 16,
        padding: "16px 20px",
        textAlign: "center",
        maxWidth: 750,
        margin: "18px auto 0",
      }}
    >
      <h3 style={{ margin: 0, marginBottom: 8, fontSize: 18 }}>{t.proSectionTitle}</h3>
      <p style={{ margin: 0, marginBottom: 12, opacity: 0.85, lineHeight: 1.5 }}>
        {t.proSectionText}
      </p>
      <button
        onClick={() => (window.location.href = "/api/pay")}
        style={{
          background: "#a855f7",
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "10px 22px",
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 6px 20px rgba(168,85,247,0.35)",
        }}
      >
        {t.proCTA}
      </button>
    </div>
  );
})()}

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

            {/* bottone per aprire il form manualmente */}
            <button
              onClick={() => setShowLead(true)}
              style={{
                marginTop: 16,
                background: "rgba(168,85,247,0.12)",
                border: "1px solid rgba(168,85,247,0.4)",
                borderRadius: 999,
                padding: "8px 16px",
                color: "white",
                cursor: "pointer",
              }}
            >
              {t.openLeadBtn}
            </button>
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

      {/* 🔴 POPUP “Invia per email” — ORA CONTROLLATO SOLO DA showLead */}
      {showLead && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            style={{
              background: "#1e293b",
              borderRadius: 20,
              padding: "28px 26px",
              maxWidth: 420,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            }}
          >
            <h3 style={{ fontSize: 20, marginBottom: 8, color: "#fff" }}>
              {lang === "it"
                ? "Vuoi che te lo mandi via email?"
                : lang === "fr"
                ? "Tu veux que je te l’envoie par e-mail ?"
                : lang === "de"
                ? "Willst du es per E-Mail erhalten?"
                : "Want me to send it by email?"}
            </h3>

            <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 20 }}>
              {lang === "it"
                ? "L’AI non ha trovato un risultato preciso. Posso cercarlo manualmente e inviartelo."
                : lang === "fr"
                ? "L’IA n’a pas trouvé de résultat précis. Je peux chercher manuellement et te l’envoyer."
                : lang === "de"
                ? "Die KI hat kein genaues Ergebnis gefunden. Ich kann manuell suchen und es dir schicken."
                : "AI didn’t find a precise result. I can look manually and email it to you."}
            </p>

            <form
              onSubmit={handleLead}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                alignItems: "center",
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  lang === "it"
                    ? "tu@email.com"
                    : lang === "fr"
                    ? "ton@email.com"
                    : lang === "de"
                    ? "deine@email.com"
                    : "your@email.com"
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "white",
                }}
              />
              <textarea
                rows={3}
                value={leadMsg}
                onChange={(e) => setLeadMsg(e.target.value)}
                placeholder={
                  lang === "it"
                    ? "Descrivi brevemente cosa cerchi..."
                    : lang === "fr"
                    ? "Décris brièvement ce que tu cherches..."
                    : lang === "de"
                    ? "Beschreibe kurz, was du suchst..."
                    : "Describe briefly what you’re looking for..."
                }
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  color: "white",
                  resize: "none",
                }}
              />
              <button
                type="submit"
                disabled={leadLoading}
                style={{
                  background: leadLoading ? "#7c3aed" : "#a855f7",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 18px",
                  fontWeight: 600,
                  cursor: leadLoading ? "not-allowed" : "pointer",
                  color: "white",
                }}
              >
                {leadLoading
                  ? lang === "it"
                    ? "Invio in corso…"
                    : lang === "fr"
                    ? "Envoi en cours…"
                    : lang === "de"
                    ? "Wird gesendet…"
                    : "Sending…"
                  : lang === "it"
                  ? "Inviami la richiesta"
                  : lang === "fr"
                  ? "Envoie la demande"
                  : lang === "de"
                  ? "Anfrage senden"
                  : "Send request"}
              </button>

              {leadOk && (
                <p style={{ color: "#22c55e", marginTop: 6 }}>
                  {lang === "it"
                    ? "✅ Ricevuto! Ti scrivo presto."
                    : lang === "fr"
                    ? "✅ Bien reçu ! Je te réponds vite."
                    : lang === "de"
                    ? "✅ Erhalten! Ich melde mich bald."
                    : "✅ Received! I’ll get back to you soon."}
                </p>
              )}
              {leadErr && (
                <p style={{ color: "#f97316", marginTop: 6 }}>
                  {lang === "it"
                    ? "⚠️ Errore nell’invio."
                    : lang === "fr"
                    ? "⚠️ Erreur d’envoi."
                    : lang === "de"
                    ? "⚠️ Fehler beim Senden."
                    : "⚠️ Error sending."}
                </p>
              )}
            </form>

            <button
              onClick={() => {
                setShowLead(false);
                setAiError("");
                setLeadErr(false);
                setLeadOk(false);
              }}
              style={{
                marginTop: 20,
                color: "#94a3b8",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: 13,
              }}
            >
              {lang === "it"
                ? "Chiudi"
                : lang === "fr"
                ? "Fermer"
                : lang === "de"
                ? "Schließen"
                : "Close"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
