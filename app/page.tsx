"use client";

import type React from "react";
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

      const savedEmail = localStorage.getItem("ifiy_email");
      if (savedEmail) {
        setUserEmail(savedEmail);
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

      if (userEmail) {
        localStorage.setItem("ifiy_email", userEmail);
      }
    } catch {
      // ignore
    }
  }, [credits, isPro, lang, userEmail]);

  // Ricerca principale
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();

    const q = query.trim();
    if (!q) return;

    // Nuova logica crediti + email-gate
    if (!isPro) {
      // Nessun credito rimasto
      if (credits <= 0) {
        alert(t.outOfCredits);
        return;
      }

      // Seconda ricerca (credits === 1) ma ancora senza email → apri modale
      if (credits === 1 && !userEmail) {
        setShowEmailGate(true);
        return;
      }
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

  // Chiamata quando l'utente inserisce l'email nella modale
  const handleEmailCollected = async (email: string) => {
    setUserEmail(email);
    setShowEmailGate(false);

    try {
      await fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch (error) {
      console.error("Errore nel salvataggio email:", error);
    }

    // Dopo aver salvato l'email, rilanciamo la ricerca
    await handleSearch();
  };

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
          <div
            style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}
          >
            iFindItForYou
          </div>

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
<div
  style={{
    fontSize: 12,
    opacity: 0.65,
    marginBottom: 12,
  }}
>
  🎁 {lang === "it" && "Hai 2 ricerche gratuite: la prima senza email, la seconda con email."}
  {lang === "en" && "You have 2 free searches: first without email, second with email."}
  {lang === "fr" && "Tu as 2 recherches gratuites : la première sans email, la deuxième avec email."}
  {lang === "de" && "Du hast 2 kostenlose Suchanfragen: die erste ohne E-Mail, die zweite mit E-Mail."}
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
{!isPro && credits === 0 && (
  <p
    style={{
      marginTop: 12,
      fontSize: 14,
      fontWeight: 600,
      color: "#b91c1c",
    }}
  >
    Hai esaurito le 2 ricerche gratuite. Passa al piano PRO per continuare.
  </p>
)}
{!isPro && credits === 0 && (
  <button
    onClick={handleGoPro}
    style={{
      marginTop: 8,
      borderRadius: 999,
      border: "1px solid #312e81",
      padding: "8px 16px",
      fontSize: 14,
      background: "#eef2ff",
      color: "#312e81",
      cursor: "pointer",
    }}
  >
    Vai al piano PRO
  </button>
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

      {/* Modale email-gate */}
      <EmailGateModal
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onConfirm={handleEmailCollected}
      />
    </main>
  );
}

function EmailGateModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();

    if (!trimmed || !trimmed.includes("@")) {
      setError("Per favore inserisci un'email valida.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(trimmed);
    } catch (err) {
      console.error(err);
      setError("C'è stato un problema, riprova.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 24,
          maxWidth: 420,
          width: "100%",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ marginBottom: 8 }}>Sblocca la seconda ricerca gratuita</h2>
        <p style={{ marginBottom: 16, fontSize: 14, opacity: 0.9 }}>
          Ti chiediamo solo la tua email per concederti la seconda ricerca
          gratuita.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="la-tua-email@esempio.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              marginBottom: 10,
            }}
          />

          {error && (
            <p style={{ color: "red", fontSize: 13, marginBottom: 8 }}>
              {error}
            </p>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 8,
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Annulla
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {isSubmitting ? "Invio..." : "Sblocca ricerca"}
            </button>
          </div>
        </form>

        <p style={{ marginTop: 10, fontSize: 11, opacity: 0.7 }}>
          Niente spam, solo aggiornamenti importanti su iFindItForYou.
        </p>
      </div>
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
