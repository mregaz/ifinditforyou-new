"use client";
import { useState, useMemo } from "react";

export default function Home() {
  const [query, setQuery] = useState("");
  const [lang, setLang] = useState("it");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // lead capture state
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [sendingLead, setSendingLead] = useState(false);
  const [leadSent, setLeadSent] = useState<null | "ok" | "err">(null);

  // testo UI multilingua
  const t = useMemo(() => {
    const translations: Record<string, any> = {
      it: {
        title: "I find it for you",
        subtitle:
          "Il tuo assistente personale AI. Dimmi cosa cerchi e ti propongo subito 2-3 opzioni migliori.",
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

        // lead box
        leadTitle: "Vuoi che lo trovi io per te?",
        leadDesc:
          "Ti mando direttamente il link migliore / l’opzione giusta. Gratis nella fase beta.",
        leadEmailPlaceholder: "La tua email (o WhatsApp)",
        leadDetailsPlaceholder:
          "Dettagli extra (taglia, budget, stile, ecc.) - opzionale",
        leadButtonIdle: "Contattami per la soluzione perfetta",
        leadButtonSending: "Invio...",
        leadThanks: "Perfetto! Ti conosco già 😎 Ti rispondo presto.",
        leadError: "Errore nell'invio. Riprova.",
        leadLabelHow: "Come vuoi che ti risponda?",
      },
      en: {
        title: "I find it for you",
        subtitle:
          "Your personal AI assistant. Tell me what you’re looking for and I’ll suggest the best 2–3 options right away.",
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

        leadTitle: "Want me to find it FOR you?",
        leadDesc:
          "I'll send you the single best match / link. Free while in beta.",
        leadEmailPlaceholder: "Your email (or WhatsApp)",
        leadDetailsPlaceholder:
          "Extra details (budget, style, size...) - optional",
        leadButtonIdle: "Send it to me",
        leadButtonSending: "Sending...",
        leadThanks: "Got it! I’ll get back to you 🤝",
        leadError: "Send failed. Please try again.",
        leadLabelHow: "How should I contact you?",
      },
      fr: {
        title: "Je le trouve pour toi",
        subtitle:
          "Ton assistant IA personnel. Dis-moi ce que tu cherches et je te propose 2–3 options idéales.",
        placeholder: "Que veux-tu que je trouve pour toi ?",
        button: loading ? "Je cherche..." : "Trouve-le pour moi",
        loading: "Je cherche pour toi…",
        examplesTitle: "Exemples :",
        examples: [
          "Idée cadeau pour une femme de 60 ans qui aime cuisiner",
          "Week-end romantique près de Milan",
          "Meilleur laptop léger pour voyager",
        ],
        footer: "© 2025 ifinditforyou.com — propulsé par l’IA",

        leadTitle: "Tu veux que je le trouve pour toi ?",
        leadDesc:
          "Je t’envoie directement la meilleure option / le meilleur lien. Gratuit pendant la bêta.",
        leadEmailPlaceholder: "Ton email (ou WhatsApp)",
        leadDetailsPlaceholder:
          "Détails en plus (budget, style...) - optionnel",
        leadButtonIdle: "Contacte-moi",
        leadButtonSending: "Envoi...",
        leadThanks: "Parfait 😌 Je reviens vers toi.",
        leadError: "Échec de l’envoi. Réessaie.",
        leadLabelHow: "Comment tu veux que je te réponde ?",
      },
      de: {
        title: "Ich finde es für dich",
        subtitle:
          "Dein persönlicher KI-Assistent. Sag mir, was du suchst, und ich schlage dir direkt 2–3 Top-Optionen vor.",
        placeholder: "Was soll ich für dich finden?",
        button: loading ? "Suche läuft..." : "Finde es für mich",
        loading: "Ich suche für dich…",
        examplesTitle: "Beispiele:",
        examples: [
          "Geschenkidee für eine 60-jährige Hobbyköchin",
          "Romantisches Wochenende in der Nähe von Mailand",
          "Bestes leichtes Reiselaptop",
        ],
        footer: "© 2025 ifinditforyou.com — unterstützt von KI",

        leadTitle: "Willst du, dass ICH es für dich finde?",
        leadDesc:
          "Ich schicke dir direkt den besten Treffer / Link. Kostenlos in der Beta.",
        leadEmailPlaceholder: "Deine E-Mail (oder WhatsApp)",
        leadDetailsPlaceholder:
          "Zusatzinfos (Budget, Stil...) – optional",
        leadButtonIdle: "Melde dich bei mir",
        leadButtonSending: "Sende...",
        leadThanks: "Perfekt 😎 Ich melde mich.",
        leadError: "Senden fehlgeschlagen. Bitte nochmal.",
        leadLabelHow: "Wie soll ich dich kontaktieren?",
      },
    };
    return translations[lang];
  }, [lang, loading]);

  // ---- SEARCH HANDLER ----
  const onSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setLeadSent(null);

    try {
      const url = `/api/search?q=${encodeURIComponent(
        query
      )}&lang=${encodeURIComponent(lang)}`;

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

  // ---- LEAD SENDER ----
  const sendLead = async () => {
    if (!email.trim()) {
      setLeadSent("err");
      return;
    }
    setSendingLead(true);
    setLeadSent(null);

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          details,
          lastQuery: query,
        }),
      });

      if (res.ok) {
        setLeadSent("ok");
        setEmail("");
        setDetails("");
      } else {
        setLeadSent("err");
      }
    } catch (err) {
      console.error(err);
      setLeadSent("err");
    }

    setSendingLead(false);
  };

  // ---- RENDER ----
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
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
            {t.button}
          </button>
        </div>

        {/* RISULTATI AI */}
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

        {/* LEAD CAPTURE */}
        {results.length > 0 && (
          <div
            style={{
              marginTop: 32,
              backgroundColor: "#111",
              border: "1px solid #333",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: "white",
                marginBottom: 6,
                textAlign: "center",
              }}
            >
              {t.leadTitle}
            </div>

            <div
              style={{
                fontSize: 13,
                lineHeight: 1.4,
                color: "#9ca3af",
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              {t.leadDesc}
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.leadEmailPlaceholder}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #444",
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                }}
              />

              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={t.leadDetailsPlaceholder}
                rows={3}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: 10,
                  border: "1px solid #444",
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  fontSize: 14,
                  lineHeight: 1.4,
                  outline: "none",
                  resize: "none",
                }}
              />

              <div
                style={{
                  fontSize: 12,
                  color: "#555",
                  lineHeight: 1.4,
                }}
              >
                {t.leadLabelHow}
              </div>
            </div>

            <button
              onClick={sendLead}
              disabled={sendingLead}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
                border: "none",
                color: "white",
                fontWeight: 500,
                cursor: "pointer",
                fontSize: 14,
                textAlign: "center",
                opacity: sendingLead ? 0.6 : 1,
              }}
            >
              {sendingLead ? t.leadButtonSending : t.leadButtonIdle}
            </button>

            {leadSent === "ok" && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  color: "#4ade80",
                  textAlign: "center",
                }}
              >
                {t.leadThanks}
              </div>
            )}

            {leadSent === "err" && (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  color: "#f87171",
                  textAlign: "center",
                }}
              >
                {t.leadError}
              </div>
            )}
          </div>
        )}

        {/* footer */}
        <footer
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#555",
            marginTop: 40,
            lineHeight: 1.6,
          }}
        >
          <div>{t.footer}</div>
          <a
            href="/privacy"
            style={{
              color: "#8b5cf6",
              textDecoration: "none",
              fontSize: 12,
            }}
          >
            Privacy &amp; Termini
          </a>
        </footer>
      </div>
    </main>
  );
}
