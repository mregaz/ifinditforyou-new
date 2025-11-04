
"use client";
export default function Page() { ... }

import { useState } from "react";

// testi per le 4 lingue
const UI_TEXTS = {
  it: {
    beta: "Beta gratuita",
    title: "iFindItForYou",
    subtitle:
      "Tu scrivi cosa cerchi, io ti mando il link/opzione giusta per email.",
    placeholder: "Cosa vuoi che trovi per te?",
    button: "Trovalo per me",
    langLabel: "Lingua dell’interfaccia",
    resultsTitle: "Ecco alcune opzioni:",
    empty: "Scrivi cosa cerchi sopra 👆",
    formTitle: "Vuoi che te lo mandi via email?",
    formSubtitle: "Lasciami i dettagli, ti rispondo il prima possibile.",
    emailLabel: "La tua email",
    msgLabel: "Cosa ti devo trovare?",
    replyLabel: "Come vuoi che ti risponda?",
    submit: "Contattami per la soluzione perfetta",
    ok: "Ricevuto! Ti scrivo appena ho la soluzione 👍",
    ko: "C'è stato un errore nell’invio. Riprova.",
    aboutTitle: "Chi c’è dietro iFindItForYou?",
    aboutText:
      "È un micro-progetto per farti risparmiare tempo: invece di girare 10 siti ti mando direttamente l’opzione giusta. Se hai idee o vuoi integrarlo con il tuo tool, scrivimi.",
    feedbackText: "Idee o collaborazioni:",
  },
  en: {
    beta: "Free beta",
    title: "iFindItForYou",
    subtitle: "You write what you need, I send you the right link by email.",
    placeholder: "What do you want me to find?",
    button: "Find it for me",
    langLabel: "Interface language",
    resultsTitle: "Here are some options:",
    empty: "Write what you need above 👆",
    formTitle: "Want me to send it by email?",
    formSubtitle: "Tell me more, I’ll reply as soon as I can.",
    emailLabel: "Your email",
    msgLabel: "What should I find?",
    replyLabel: "Reply in",
    submit: "Send me the perfect option",
    ok: "Got it! I’ll email you soon 👍",
    ko: "Error sending. Try again.",
    aboutTitle: "Who is behind iFindItForYou?",
    aboutText:
      "Tiny helper project to save you time. You tell me what you need, I search it for you and mail it back. If you want to integrate it or have ideas, just write.",
    feedbackText: "Ideas or partnerships:",
  },
  fr: {
    beta: "Bêta gratuite",
    title: "iFindItForYou",
    subtitle:
      "Tu écris ce que tu cherches, je t’envoie la bonne option par email.",
    placeholder: "Qu’est-ce que tu veux que je trouve ?",
    button: "Trouve-le pour moi",
    langLabel: "Langue de l’interface",
    resultsTitle: "Quelques options :",
    empty: "Écris ce que tu cherches 👆",
    formTitle: "Tu veux que je t’envoie ça par email ?",
    formSubtitle: "Donne-moi les détails, je te réponds vite.",
    emailLabel: "Ton email",
    msgLabel: "Qu’est-ce que je dois trouver ?",
    replyLabel: "Je te réponds en",
    submit: "Envoie-moi la bonne solution",
    ok: "Bien reçu ! Je te réponds vite 👍",
    ko: "Erreur d’envoi. Réessaie.",
    aboutTitle: "Qui est derrière iFindItForYou ?",
    aboutText:
      "Petit projet pour te faire gagner du temps. Tu écris, je trouve et je t’envoie. Si tu veux l’intégrer ou proposer une idée, écris-moi.",
    feedbackText: "Idées ou collaborations :",
  },
  de: {
    beta: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle:
      "Du schreibst, was du suchst, ich schicke dir den richtigen Link per E-Mail.",
    placeholder: "Was soll ich für dich finden?",
    button: "Finde es für mich",
    langLabel: "Sprache",
    resultsTitle: "Einige Vorschläge:",
    empty: "Schreib oben, was du suchst 👆",
    formTitle: "Willst du es per E-Mail?",
    formSubtitle: "Schreib mir die Details, ich antworte dir.",
    emailLabel: "Deine E-Mail",
    msgLabel: "Was soll ich finden?",
    replyLabel: "Antwort in",
    submit: "Schick mir die passende Lösung",
    ok: "Danke! Ich melde mich bald 👍",
    ko: "Fehler beim Senden. Bitte erneut versuchen.",
    aboutTitle: "Wer steckt hinter iFindItForYou?",
    aboutText:
      "Kleines Projekt, damit du weniger suchen musst. Du sagst, was du brauchst, ich schicke es dir. Bei Ideen oder Integration – schreib mir.",
    feedbackText: "Ideen oder Kooperation:",
  },
} as const;

export default function HomePage() {
  // lingua interfaccia
  const [lang, setLang] = useState<"it" | "en" | "fr" | "de">("it");
  const t = UI_TEXTS[lang];

  // ricerca
  const [query, setQuery] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [searchError, setSearchError] = useState("");

  // form lead
  const [email, setEmail] = useState("");
  const [leadMsg, setLeadMsg] = useState("");
  const [leadLang, setLeadLang] = useState<"it" | "en" | "fr" | "de">("it");
  const [leadLoading, setLeadLoading] = useState(false);
  const [leadOk, setLeadOk] = useState(false);
  const [leadErr, setLeadErr] = useState(false);

  // chiamata alla nostra /api/search
  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setSearchLoading(true);
    setSearchError("");
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&lang=${lang}`
      );
      if (!res.ok) throw new Error("API non disponibile");
      const data = await res.json();
      setResults(
        Array.isArray(data.results) && data.results.length > 0
          ? data.results
          : [
              `Non ho trovato molto su “${q}”, ma puoi spiegarmelo nel form sotto 👇`,
            ]
      );
    } catch (err) {
      setSearchError("Non riesco a chiamare l’AI adesso, ti lascio 3 idee io.");
      setResults([
        `1) Cerca guide pratiche su “${q}”`,
        `2) Controlla comparatori / marketplace per “${q}”`,
        `3) Se vuoi che lo faccia io per te, compila il form sotto.`,
      ]);
    } finally {
      setSearchLoading(false);
    }
  };

  // invio lead a /api/lead
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
        gap: 40,
        padding: "32px 16px 24px",
      }}
    >
      {/* HERO + RICERCA */}
      <div
        style={{
          maxWidth: 1000,
          width: "100%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p style={{ opacity: 0.7, marginBottom: 8 }}>{t.beta}</p>

        {/* titolo con stellina */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(48px, 6vw, 72px)",
              fontWeight: 700,
            }}
          >
            {t.title}
          </h1>
          <span
            style={{
              width: 30,
              height: 30,
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              background: "radial-gradient(circle, #f97316 0%, #a855f7 70%)",
              borderRadius: "9999px",
              animation: "spin 4s linear infinite",
            }}
          >
            ⭐
          </span>
        </div>

        {/* piccola animazione css */}
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg) }
            to { transform: rotate(360deg) }
          }
        `}</style>

        <p
          style={{
            fontSize: 20,
            opacity: 0.9,
            maxWidth: 700,
            margin: "0 auto 32px",
          }}
        >
          {t.subtitle}
        </p>

        {/* input + button */}
        <div
          style={{
            display: "flex",
            gap: 16,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder={t.placeholder}
            style={{
              minWidth: 280,
              width: "50%",
              background: "rgba(255,255,255,0.03)",
              border: "2px solid rgba(148,163,184,0.2)",
              borderRadius: 999,
              padding: "14px 20px",
              color: "white",
              fontSize: 16,
            }}
          />
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            style={{
              background: searchLoading ? "#7c3aed" : "#a855f7",
              border: "none",
              borderRadius: 999,
              padding: "14px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: searchLoading ? "not-allowed" : "pointer",
            }}
          >
            {searchLoading ? "Sto cercando…" : t.button}
          </button>
        </div>

        {/* select lingua interfaccia */}
        <div style={{ marginBottom: 28 }}>
          <label style={{ opacity: 0.6, marginRight: 12 }}>
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
        <div style={{ maxWidth: 850, margin: "0 auto" }}>
          <h3 style={{ fontSize: 18, marginBottom: 12 }}>
            {t.resultsTitle}
          </h3>
          {searchError && (
            <p style={{ color: "#f97316", marginBottom: 10 }}>{searchError}</p>
          )}
          {results.length === 0 ? (
            <p style={{ opacity: 0.5 }}>{t.empty}</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {results.map((r, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(148,163,184,0.2)",
                    borderRadius: 16,
                    padding: "12px 18px",
                    textAlign: "left",
                  }}
                >
                  {r}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FORM LEAD */}
      <div
        style={{
          maxWidth: 850,
          width: "100%",
          margin: "0 auto",
          background: "rgba(15,23,42,0.4)",
          border: "1px solid rgba(148,163,184,0.15)",
          borderRadius: 20,
          padding: "24px 22px 20px",
        }}
      >
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>{t.formTitle}</h2>
        <p style={{ opacity: 0.6, marginBottom: 18 }}>{t.formSubtitle}</p>

        <form
          onSubmit={handleLead}
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {t.emailLabel}
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "white",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {t.msgLabel}
            </label>
            <textarea
              rows={4}
              value={leadMsg}
              onChange={(e) => setLeadMsg(e.target.value)}
              placeholder="Es. Miglior tool per… / Voli per… / Alternative a…"
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "white",
                resize: "vertical",
              }}
            />
          </div>

          <div style={{ textAlign: "left" }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              {t.replyLabel}
            </label>
            <select
              value={leadLang}
              onChange={(e) => setLeadLang(e.target.value as any)}
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(148,163,184,0.2)",
                borderRadius: 10,
                padding: "8px 10px",
                color: "white",
              }}
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={leadLoading}
            style={{
              background: leadLoading ? "#7c3aed" : "#a855f7",
              border: "none",
              borderRadius: 10,
              padding: "12px 16px",
              fontSize: 15,
              fontWeight: 600,
              cursor: leadLoading ? "not-allowed" : "pointer",
            }}
          >
            {leadLoading ? "Invio in corso…" : t.submit}
          </button>

          {leadOk && <p style={{ color: "#22c55e" }}>{t.ok}</p>}
          {leadErr && <p style={{ color: "#f97316" }}>{t.ko}</p>}
        </form>
      </div>

      {/* ABOUT / FEEDBACK DINAMICO */}
      <div
        style={{
          maxWidth: 850,
          width: "100%",
          margin: "0 auto 40px",
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
            lineHeight: 1.6,
          }}
        >
          {t.aboutText}
        </p>

        <p style={{ fontSize: 14, opacity: 0.6, marginBottom: 6 }}>
          {t.feedbackText}
        </p>
        <a
          href="mailto:info@ifinditforyou.com"
          style={{ color: "#a855f7", textDecoration: "none", fontWeight: 500 }}
        >
          info@ifinditforyou.com
        </a>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          fontSize: 14,
          opacity: 0.7,
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


