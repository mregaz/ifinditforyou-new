"use client";

import { useEffect, useState } from "react";

type Lang = "it" | "fr" | "de" | "en";

const UI_TEXTS = {
  it: {
    tagline: "Scrivi cosa cerchi, io lo trovo per te.",
    placeholder: "Es. iPhone 13 mini blu sotto 350 CHF in Svizzera",
    search: "Cerca",
    proCta: "Diventa PRO",
    creditsLabel: (credits: number, isPro: boolean) =>
      isPro
        ? "Piano PRO attivo: ricerche illimitate."
        : credits > 0
        ? `Hai ancora ${credits} ricerche gratuite.`
        : "Hai esaurito le 2 ricerche gratuite.",
    outOfCredits:
      "Hai esaurito le ricerche gratuite. Attiva il piano PRO per continuare.",
    sectionHowTitle: "Come funziona",
    sectionHowText:
      "Scrivi cosa ti serve, in qualsiasi lingua. L’AI analizza la richiesta, interroga i motori di ricerca e ti restituisce link già filtrati, con un breve riassunto.",
    sectionWhyTitle: "Perché non usare solo Google?",
    sectionWhyText:
      "Google ti dà milioni di risultati. iFindItForYou ti restituisce solo poche opzioni curate, spiegate in modo chiaro, con un occhio a prezzo e affidabilità.",
    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 ricerche gratuite per provare il servizio (1 senza email + 1 con email).",
    sectionProPaid:
      "Con PRO puoi fare tutte le ricerche che vuoi e ricevere risultati più approfonditi e personalizzati.",
    sectionFaqTitle: "Privacy & dati",
    sectionFaqText:
      "Le tue ricerche vengono usate solo per trovare risultati migliori. Non vendiamo i dati a terzi.",
    resultsTitle: "Risultati",
    empty: "Fai una ricerca per vedere qualche esempio 👆",
  },

  en: {
    tagline: "Write what you need, I’ll find it for you.",
    placeholder: "E.g. iPhone 13 mini blue under 350 CHF in Switzerland",
    search: "Search",
    proCta: "Go PRO",
    creditsLabel: (credits: number, isPro: boolean) =>
      isPro
        ? "PRO plan active: unlimited searches."
        : credits > 0
        ? `You have ${credits} free searches left.`
        : "You’ve used all 2 free searches.",
    outOfCredits:
      "You’ve used your free searches. Activate PRO to continue.",
    sectionHowTitle: "How it works",
    sectionHowText:
      "Describe what you need in any language. The AI analyzes your request, searches the web and returns curated results with short summaries.",
    sectionWhyTitle: "Why not just Google?",
    sectionWhyText:
      "Google gives you millions of results. iFindItForYou gives you a small set of curated answers, already filtered and explained clearly.",
    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 free searches to try the service (1 without email + 1 with email).",
    sectionProPaid:
      "With PRO you can make unlimited searches and receive deeper, more curated results.",
    sectionFaqTitle: "Privacy & data",
    sectionFaqText:
      "Your searches are used only to improve results. We do not sell data to third parties.",
    resultsTitle: "Results",
    empty: "Start a search to see how it works 👆",
  },

  fr: {
    tagline: "Écris ce que tu cherches, je le trouve pour toi.",
    placeholder: "Ex. iPhone 13 mini bleu à moins de 350 CHF en Suisse",
    search: "Rechercher",
    proCta: "Passer en PRO",
    creditsLabel: (credits: number, isPro: boolean) =>
      isPro
        ? "Abonnement PRO actif : recherches illimitées."
        : credits > 0
        ? `Il te reste ${credits} recherches gratuites.`
        : "Tu as utilisé tes 2 recherches gratuites.",
    outOfCredits:
      "Tu as utilisé toutes tes recherches gratuites. Active le plan PRO pour continuer.",
    sectionHowTitle: "Comment ça marche",
    sectionHowText:
      "Décris ce dont tu as besoin, dans n’importe quelle langue. L’IA analyse ta demande, interroge le web et te renvoie des résultats filtrés et résumés.",
    sectionWhyTitle: "Pourquoi ne pas utiliser seulement Google ?",
    sectionWhyText:
      "Google donne des millions de résultats. iFindItForYou te donne quelques options déjà filtrées, expliquées clairement et axées sur la fiabilité.",
    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 recherches gratuites pour tester le service (1 sans email + 1 avec email).",
    sectionProPaid:
      "Avec PRO, tu peux faire autant de recherches que tu veux et recevoir des résultats plus précis et personnalisés.",
    sectionFaqTitle: "Vie privée & données",
    sectionFaqText:
      "Tes recherches servent uniquement à améliorer les résultats. Nous ne vendons jamais tes données.",
    resultsTitle: "Résultats",
    empty: "Fais une recherche pour voir un exemple 👆",
  },

  de: {
    tagline: "Schreib, was du suchst – ich finde es für dich.",
    placeholder: "Z.B. iPhone 13 mini blau unter 350 CHF in der Schweiz",
    search: "Suchen",
    proCta: "PRO werden",
    creditsLabel: (credits: number, isPro: boolean) =>
      isPro
        ? "PRO-Plan aktiv: unbegrenzte Suchanfragen."
        : credits > 0
        ? `Du hast noch ${credits} kostenlose Suchanfragen.`
        : "Du hast die 2 kostenlosen Suchanfragen aufgebraucht.",
    outOfCredits:
      "Du hast deine kostenlosen Suchen aufgebraucht. Aktiviere PRO, um weiterzumachen.",
    sectionHowTitle: "So funktioniert’s",
    sectionHowText:
      "Beschreibe, was du brauchst – in jeder Sprache. Die KI analysiert deine Anfrage, durchsucht das Web und liefert gefilterte Ergebnisse mit kurzen Zusammenfassungen.",
    sectionWhyTitle: "Warum nicht einfach Google?",
    sectionWhyText:
      "Google liefert Millionen von Ergebnissen. iFindItForYou liefert dir wenige, kuratierte Antworten – klar erklärt und bereits sortiert.",
    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 kostenlose Suchanfragen zum Testen (1 ohne E-Mail + 1 mit E-Mail).",
    sectionProPaid:
      "Mit PRO kannst du unbegrenzt suchen und erhältst tiefere, besser kuratierte Ergebnisse.",
    sectionFaqTitle: "Datenschutz & Daten",
    sectionFaqText:
      "Deine Suchanfragen werden nur verwendet, um bessere Ergebnisse zu liefern. Wir verkaufen keine Daten an Dritte.",
    resultsTitle: "Ergebnisse",
    empty: "Starte eine Suche, um ein Beispiel zu sehen 👆",
  },
} as const;


// Cambia questo valore tra 1, 2, 3 per provare
const LOGO_VARIANT: 1 | 2 | 3 = 3;

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("it");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(2);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const t = UI_TEXTS[lang];

  // Carica stato da localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ifiy_lang") as Lang | null;
      if (savedLang && UI_TEXTS[savedLang]) {
        setLang(savedLang);
      }
      const savedCredits = localStorage.getItem("ifiy_credits");
      if (savedCredits !== null) {
        setCredits(parseInt(savedCredits, 10));
      }
      const savedPro = localStorage.getItem("ifiy_isPro");
      if (savedPro === "true") {
        setIsPro(true);
      }
    } catch {
      // ignore
    }
  }, []);

  // Salva stato
  useEffect(() => {
    try {
      localStorage.setItem("ifiy_credits", String(credits));
      localStorage.setItem("ifiy_isPro", isPro ? "true" : "false");
      localStorage.setItem("ifiy_lang", lang);
    } catch {
      // ignore
    }
  }, [credits, isPro, lang]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (!isPro && credits <= 0) {
      alert(t.outOfCredits);
      return;
    }

    setLoading(true);
    setResults([]);
    setSummary("");

    const plan = isPro ? "pro" : "free";

    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, lang, plan }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert("Errore nella ricerca. Riprova tra poco.");
        return;
      }

      setResults(Array.isArray(data.items) ? data.items : []);
      setSummary(typeof data.summary === "string" ? data.summary : "");

      if (!isPro) {
        setCredits((c) => (c > 0 ? c - 1 : 0));
      }
    } catch (err) {
      console.error(err);
      alert("Problema di rete. Controlla la connessione e riprova.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoPro() {
    window.location.href = "/pro";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          borderBottom: "1px solid rgba(148,163,184,0.3)",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <Logo variant={LOGO_VARIANT} />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontSize: 14,
            }}
          >
            <span
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                background: isPro ? "#0f172a" : "#f8fafc",
                color: isPro ? "#f9fafb" : "#0f172a",
                fontWeight: 500,
              }}
            >
              {isPro ? "PRO" : "Free"}
            </span>

            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.7)",
                padding: "4px 10px",
                background: "#ffffff",
              }}
            >
              <option value="it">🇮🇹 Italiano</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
              <option value="en">🇬🇧 English</option>
            </select>
          </div>
        </div>
      </header>

      {/* HERO + SEARCH */}
      <section
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "32px 16px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            width: "100%",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            iFindItForYou
          </h1>
          <p
            style={{
              fontSize: 16,
              opacity: 0.7,
              marginBottom: 24,
            }}
          >
            {t.tagline}
          </p>

          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                maxWidth: 640,
                gap: 8,
              }}
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.placeholder}
                style={{
                  flex: 1,
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.8)",
                  padding: "12px 18px",
                  fontSize: 15,
                  outline: "none",
                }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{
                  borderRadius: 999,
                  border: "none",
                  padding: "0 22px",
                  fontWeight: 600,
                  fontSize: 15,
                  background: "#0f172a",
                  color: "#f9fafb",
                  cursor: loading ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "..." : t.search}
              </button>
            </div>
          </form>

          <div
            style={{
              fontSize: 13,
              opacity: 0.7,
              marginBottom: 8,
            }}
          >
            {t.creditsLabel(credits, isPro)}
          </div>

          <button
            type="button"
            onClick={handleGoPro}
            style={{
              marginTop: 4,
              borderRadius: 999,
              border: "1px solid rgba(79,70,229,0.8)",
              padding: "8px 18px",
              fontSize: 14,
              background: "#eef2ff",
              color: "#312e81",
              cursor: "pointer",
            }}
          >
            {t.proCta}
          </button>
        </div>
      </section>

      {/* RISULTATI + SEZIONI INFO */}
      <section
        style={{
          borderTop: "1px solid rgba(148,163,184,0.25)",
          background: "#f8fafc",
          padding: "24px 16px 32px",
        }}
      >
        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1.5fr)",
            gap: 24,
          }}
        >
          {/* Colonna risultati */}
          <div>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              {t.resultsTitle}
            </h2>

            {results.length === 0 && !summary && (
              <p style={{ fontSize: 14, opacity: 0.7 }}>{t.empty}</p>
            )}

            {summary && (
              <div
                style={{
                  marginBottom: 12,
                  padding: "10px 12px",
                  borderRadius: 12,
                  background: "#e5e7eb",
                  fontSize: 14,
                }}
              >
                {summary}
              </div>
            )}

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {results.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: 12,
                    padding: "10px 12px",
                    background: "#ffffff",
                    border: "1px solid rgba(148,163,184,0.4)",
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 4,
                    }}
                  >
                    {item.title ?? "Senza titolo"}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                    }}
                  >
                    {item.source && <span>{item.source}</span>}
                    {item.price && (
                      <span>
                        {" "}
                        • <strong>{item.price}</strong>
                      </span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Colonna testo marketing */}
          <div
            style={{
              fontSize: 13,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <InfoBlock title={t.sectionHowTitle} text={t.sectionHowText} />
            <InfoBlock title={t.sectionWhyTitle} text={t.sectionWhyText} />
            <InfoBlock
              title={t.sectionProTitle}
              text={`${t.sectionProFree} ${t.sectionProPaid}`}
            />
            <InfoBlock title={t.sectionFaqTitle} text={t.sectionFaqText} />
          </div>
        </div>
      </section>
    </main>
  );
}

function Logo({ variant }: { variant: 1 | 2 | 3 }) {
  const common: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontWeight: 700,
    fontSize: 18,
    color: "#0f172a",
  };

  if (variant === 1) {
    // Minimal wordmark
    return (
      <div style={common}>
        <span style={{ fontWeight: 800 }}>iFind</span>
        <span style={{ fontWeight: 500 }}>It</span>
        <span style={{ fontWeight: 700, opacity: 0.8 }}>ForYou</span>
      </div>
    );
  }

  if (variant === 2) {
    // Piccola lente colorata
    return (
      <div style={common}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: 999,
            border: "2px solid #4f46e5",
            position: "relative",
          }}
        >
          <span
            style={{
              position: "absolute",
              width: 10,
              height: 2,
              background: "#4f46e5",
              borderRadius: 999,
              bottom: -4,
              right: -4,
              transform: "rotate(45deg)",
            }}
          />
        </span>
        <span>iFindItForYou</span>
      </div>
    );
  }

  // variant 3: piccolo quadrato “AI”
  return (
    <div style={common}>
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 6,
          background:
            "linear-gradient(135deg,#4f46e5,#6366f1,#22c55e,#f97316)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#f9fafb",
          fontSize: 10,
          fontWeight: 800,
        }}
      >
        AI
      </span>
      <span>iFindItForYou</span>
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderRadius: 12,
        padding: "10px 12px",
        border: "1px solid rgba(148,163,184,0.4)",
      }}
    >
      <div
        style={{
          fontWeight: 600,
          marginBottom: 4,
          fontSize: 13,
        }}
      >
        {title}
      </div>
      <div style={{ opacity: 0.8, lineHeight: 1.5 }}>{text}</div>
    </div>
  );
}
