"use client";
"use client";

import React, { useEffect, useState } from "react";

const UI_TEXTS = {
  it: {
    tagline: "Scrivi cosa cerchi, io lo trovo per te.",
    placeholder: "Es. iPhone 13 mini blu sotto 350 CHF in Svizzera",
    examplesLabel: "Esempi:",
    examples: [
      "iPhone 13 mini blu sotto 350 CHF in Svizzera",
      "Hotel 3 stelle a Zurigo sotto 150 CHF",
      "Idea regalo per 12enne appassionato di Lego",
    ],
    errorSearch: "Errore nella ricerca. Riprova tra poco.",
    errorNetwork: "Problema di rete. Controlla la connessione e riprova.",
    search: "Cerca",
    proCta: "Diventa PRO",

    creditsLabel: (credits: number, isPro: boolean) =>
      isPro
        ? "Piano PRO attivo: ricerche illimitate."
        : credits > 0
        ? `Hai ancora ${credits} ricerca gratuita (totale: 1 senza email + 1 con email).`
        : "Hai esaurito le ricerche gratuite (1 senza email + 1 con email).",

    outOfCredits:
      "Hai esaurito le ricerche gratuite. Attiva il piano PRO per continuare.",

    sectionHowTitle: "Come funziona",
    sectionHowText:
      "Scrivi cosa ti serve. L’AI analizza la richiesta, cerca sul web e ti mostra solo risultati filtrati.",
    sectionWhyTitle: "Perché non usare solo Google?",
    sectionWhyText:
      "Google ti dà milioni di risultati. iFindItForYou ti restituisce solo pochi risultati pertinenti, già filtrati.",

    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 ricerche gratuite per provare il servizio (1 senza email + 1 con email).",
    sectionProPaid:
      "Con PRO hai ricerche illimitate e risultati più approfonditi.",

    sectionFaqTitle: "Privacy & dati",
    sectionFaqText:
      "Le tue ricerche servono solo a migliorare i risultati. Non vendiamo dati.",

    resultsTitle: "Risultati",
    resultsCount: (n: number) =>
      n === 1 ? "Ho trovato 1 opzione per te." : `Ho trovato ${n} opzioni per te.`,
    empty: "Fai una ricerca per vedere qualche esempio 👆",

    // Email gate
    emailGateTitle: "Sblocca la seconda ricerca gratuita",
    emailGateDescription:
      "Ti chiediamo solo la tua email per darti la seconda ricerca gratuita.",
    emailGatePlaceholder: "la-tua-email@esempio.com",
    emailGateCancel: "Annulla",
    emailGateSubmit: "Sblocca ricerca",
    emailGateSubmitting: "Invio...",
    emailGateErrorInvalid: "Per favore inserisci un’email valida.",
    emailGateErrorGeneric: "Errore temporaneo, riprova.",
    emailGateFooter:
      "Nessuno spam. Solo aggiornamenti importanti sul servizio.",
  },

  en: {
    tagline: "Write what you need, I’ll find it for you.",
    placeholder: "E.g. iPhone 13 mini blue under 350 CHF in Switzerland",
    examplesLabel: "Examples:",
    examples: [
      "iPhone 13 mini blue under 350 CHF in Switzerland",
      "3-star hotel in Zurich under 150 CHF",
      "Gift idea for a 12-year-old who loves LEGO",
    ],
    search: "Search",
    proCta: "Go PRO",

    creditsLabel: (credits: number, isPro: boolean) =>
      isPro
        ? "PRO plan active: unlimited searches."
        : credits > 0
        ? `You have ${credits} free search left (total: 1 anonymous + 1 with email).`
        : "You’ve used all your free searches (1 anonymous + 1 with email).",

    outOfCredits: "You’ve used your free searches. Activate PRO to continue.",

    sectionHowTitle: "How it works",
    sectionHowText:
      "Describe what you need. The AI analyzes your request, searches online and shows filtered results.",
    sectionWhyTitle: "Why not Google?",
    sectionWhyText:
      "Google gives millions of results. iFindItForYou gives a few curated ones.",

    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 free searches to try the service (1 anonymous + 1 with email).",
    sectionProPaid:
      "With PRO you get unlimited searches and deeper results.",

    sectionFaqTitle: "Privacy & data",
    sectionFaqText:
      "Your searches are used only to improve the service. We never sell data.",

    resultsTitle: "Results",
    resultsCount: (n: number) =>
      n === 1 ? "I found 1 option for you." : `I found ${n} options for you.`,
    empty: "Start a search to see how it works 👆",

    // Email gate
    emailGateTitle: "Unlock your second free search",
    emailGateDescription:
      "We ask only for your email to give you the second free search.",
    emailGatePlaceholder: "your-email@example.com",
    emailGateCancel: "Cancel",
    emailGateSubmit: "Unlock search",
    emailGateSubmitting: "Sending...",
    emailGateErrorInvalid: "Please enter a valid email.",
    emailGateErrorGeneric: "Something went wrong. Try again.",
    emailGateFooter: "No spam. Only important updates.",
    errorSearch: "Search error. Try again soon.",
    errorNetwork: "Network problem. Check your connection.",
  },

  fr: {
    tagline: "Écris ce que tu cherches, je le trouve pour toi.",
    placeholder: "Ex. iPhone 13 mini bleu sous 350 CHF en Suisse",
    examplesLabel: "Exemples :",
    examples: [
      "iPhone 13 mini bleu sous 350 CHF en Suisse",
      "Hôtel 3 étoiles à Zurich sous 150 CHF",
      "Idée cadeau pour un fan de LEGO de 12 ans",
    ],
    search: "Rechercher",
    proCta: "Passer PRO",

    creditsLabel: (c: number, isPro: boolean) =>
      isPro
        ? "Abonnement PRO actif : recherches illimitées."
        : c > 0
        ? `Il te reste ${c} recherche gratuite (total : 1 sans email + 1 avec email).`
        : "Tu as utilisé toutes tes recherches gratuites (1 sans email + 1 avec email).",

    outOfCredits:
      "Tu as utilisé toutes tes recherches gratuites. Active PRO pour continuer.",

    sectionHowTitle: "Comment ça marche",
    sectionHowText:
      "Décris ce dont tu as besoin. L’IA analyse ta demande, cherche en ligne et filtre les meilleurs résultats.",
    sectionWhyTitle: "Pourquoi pas Google ?",
    sectionWhyText:
      "Google donne des millions de résultats. iFindItForYou en donne quelques-uns, déjà filtrés.",

    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 recherches gratuites pour tester (1 sans email + 1 avec email).",
    sectionProPaid:
      "Avec PRO tu as des recherches illimitées.",

    sectionFaqTitle: "Vie privée & données",
    sectionFaqText:
      "Tes recherches sont utilisées uniquement pour améliorer le service.",

    resultsTitle: "Résultats",
    resultsCount: (n: number) =>
      n === 1 ? "J’ai trouvé 1 option pour toi." : `J’ai trouvé ${n} options.`,

    empty: "Fais une recherche pour voir comment ça marche 👆",

    // Email gate
    emailGateTitle: "Débloque ta deuxième recherche gratuite",
    emailGateDescription:
      "On te demande juste ton email pour t’offrir la deuxième recherche.",
    emailGatePlaceholder: "ton-email@exemple.com",
    emailGateCancel: "Annuler",
    emailGateSubmit: "Débloquer",
    emailGateSubmitting: "Envoi...",
    emailGateErrorInvalid: "Email invalide.",
    emailGateErrorGeneric: "Erreur. Réessaie.",
    emailGateFooter: "Pas de spam. Seulement des infos utiles.",

    errorSearch: "Erreur lors de la recherche.",
    errorNetwork: "Problème réseau.",
  },

  de: {
    tagline: "Schreib, was du suchst – ich finde es.",
    placeholder: "Z.B. iPhone 13 mini blau unter 350 CHF in der Schweiz",
    examplesLabel: "Beispiele:",
    examples: [
      "iPhone 13 mini blau unter 350 CHF in der Schweiz",
      "3-Sterne-Hotel in Zürich unter 150 CHF",
      "Geschenkidee für LEGO-Fan (12 Jahre)",
    ],
    search: "Suchen",
    proCta: "PRO werden",

    creditsLabel: (c: number, isPro: boolean) =>
      isPro
        ? "PRO aktiv: unbegrenzte Suchen."
        : c > 0
        ? `Du hast noch ${c} kostenlose Suchanfrage (insgesamt: 1 ohne E-Mail + 1 mit E-Mail).`
        : "Du hast deine kostenlosen Suchanfragen aufgebraucht (1 ohne E-Mail + 1 mit E-Mail).",

    outOfCredits:
      "Keine kostenlosen Suchanfragen mehr. Aktiviere PRO, um fortzufahren.",

    sectionHowTitle: "Wie es funktioniert",
    sectionHowText:
      "Beschreibe, was du brauchst. Die KI sucht online und filtert die besten Ergebnisse.",
    sectionWhyTitle: "Warum nicht Google?",
    sectionWhyText:
      "Google gibt Millionen Treffer. iFindItForYou gibt nur die relevanten.",

    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "2 kostenlose Suchanfragen zum Testen (1 ohne E-Mail + 1 mit E-Mail).",
    sectionProPaid:
      "Mit PRO hast du unbegrenzte Suchen.",

    sectionFaqTitle: "Datenschutz",
    sectionFaqText:
      "Deine Suchanfragen werden nicht verkauft.",

    resultsTitle: "Ergebnisse",
    resultsCount: (n: number) =>
      n === 1
        ? "Ich habe 1 Option gefunden."
        : `Ich habe ${n} Optionen gefunden.`,

    empty: "Starte eine Suche 👆",

    // Email gate
    emailGateTitle: "Zweite kostenlose Suche freischalten",
    emailGateDescription:
      "Wir brauchen nur deine E-Mail, um die zweite Suche freizuschalten.",
    emailGatePlaceholder: "deine-email@beispiel.com",
    emailGateCancel: "Abbrechen",
    emailGateSubmit: "Freischalten",
    emailGateSubmitting: "Senden...",
    emailGateErrorInvalid: "Bitte gültige E-Mail eingeben.",
    emailGateErrorGeneric: "Fehler. Versuch es erneut.",
    emailGateFooter: "Kein Spam. Nur wichtige Updates.",

    errorSearch: "Fehler bei der Suche.",
    errorNetwork: "Netzwerkproblem.",
  },
} as const;


/* ============================================================================
   COMPONENTE INFO BLOCK
============================================================================ */

type ResultItem = {
  title?: string;
  url?: string;
  price?: string;
  source?: string;
};

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <section
      style={{
        padding: "10px 12px",
        borderRadius: 12,
        background: "#ffffff",
        border: "1px solid rgba(148,163,184,0.4)",
        fontSize: 13,
      }}
    >
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{title}</h3>
      <p style={{ opacity: 0.85 }}>{text}</p>
    </section>
  );
}

/* ============================================================================
   HOME PAGE
============================================================================ */

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("it");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(2);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const t = UI_TEXTS[lang];

  /* ----------------- CARICA STATO DA LOCALSTORAGE ----------------- */
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("ifiy_lang") as Lang | null;
      if (savedLang && UI_TEXTS[savedLang]) setLang(savedLang);

      const savedCredits = localStorage.getItem("ifiy_credits");
      if (savedCredits !== null) setCredits(parseInt(savedCredits, 10));

      const savedPro = localStorage.getItem("ifiy_isPro");
      if (savedPro === "true") setIsPro(true);

      const savedEmail = localStorage.getItem("ifiy_email");
      if (savedEmail) setUserEmail(savedEmail);
    } catch {}
  }, []);

  /* ----------------- SINCRONIZZA PRO DA SUPABASE ----------------- */
  useEffect(() => {
    async function syncPro() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("User")
          .select("is_pro, email")
          .eq("id", user.id)
          .single();

        if (data?.is_pro) {
          setIsPro(true);
          if (data.email) setUserEmail(data.email);
        }
      } catch (e) {
        console.error("syncProFromSupabase error:", e);
      }
    }
    syncPro();
  }, []);

  /* ----------------- SALVA SU LOCAL STORAGE ----------------- */
  useEffect(() => {
    try {
      localStorage.setItem("ifiy_credits", String(credits));
      localStorage.setItem("ifiy_isPro", isPro ? "true" : "false");
      localStorage.setItem("ifiy_lang", lang);
      if (userEmail) localStorage.setItem("ifiy_email", userEmail);
    } catch {}
  }, [credits, isPro, lang, userEmail]);

  /* ----------------- CAMBIO LINGUA ----------------- */
  const handleChangeLang = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Lang;
    setLang(newLang);

    localStorage.setItem("ifiy_lang", newLang);
    window.location.reload();
  };

  /* ----------------- SEARCH ----------------- */
  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const q = query.trim();
    if (!q) return;

    if (!isPro) {
      if (credits <= 0) return alert(t.outOfCredits);
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
        alert(t.errorSearch);
        return;
      }

      setResults(data.items || []);
      setSummary(data.summary || "");

      if (!isPro) setCredits((c) => (c > 0 ? c - 1 : 0));
    } catch (err) {
      alert(t.errorNetwork);
    } finally {
      setLoading(false);
    }
  }

  /* ----------------- EMAIL 2a RICERCA ----------------- */
  const handleEmailCollected = async (email: string) => {
    setUserEmail(email);
    setShowEmailGate(false);

    try {
      await fetch("/api/collect-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {}

    await handleSearch();
  };

  /* ----------------- CTA PRO ----------------- */
  function handleGoPro() {
    window.location.href = `/pro?lang=${lang}`;
  }

  /* ----------------- RENDER ----------------- */

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
          <div style={{ fontWeight: 700, fontSize: 18 }}>iFindItForYou</div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                background: isPro ? "#0f172a" : "#f8fafc",
                color: isPro ? "#f9fafb" : "#0f172a",
                fontWeight: 500,
                fontSize: 14,
              }}
            >
              {isPro ? "PRO" : "Free"}
            </span>

            <select
              value={lang}
              onChange={handleChangeLang}
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
        <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 44px)",
              marginBottom: 8,
              fontWeight: 700,
            }}
          >
            iFindItForYou
          </h1>

          <p style={{ fontSize: 16, opacity: 0.7, marginBottom: 24 }}>
            {t.tagline}
          </p>

          <form
            onSubmit={handleSearch}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", width: "100%", maxWidth: 640, gap: 8 }}>
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
                }}
              >
                {loading ? "..." : t.search}
              </button>
            </div>
          </form>

          {/* Crediti / PRO */}
          {isPro ? (
            <div
              style={{
                marginTop: 12,
                padding: "10px 16px",
                borderRadius: 12,
                background: "#16a34a",
                color: "#f9fafb",
                fontWeight: 700,
                display: "inline-flex",
                gap: 8,
              }}
            >
              <span
                style={{
                  padding: "2px 10px",
                  borderRadius: 999,
                  border: "1px solid #fff",
                  fontSize: 12,
                }}
              >
                PRO
              </span>
              <span>{t.creditsLabel(credits, true)}</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, opacity: 0.7, marginTop: 12 }}>
                {t.creditsLabel(credits, false)}
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
            </>
          )}
        </div>
      </section>

      {/* RISULTATI + INFO */}
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
          {/* RISULTATI */}
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
              {t.resultsTitle}
            </h2>

            {results.length > 0 && (
              <p style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>
                {t.resultsCount(results.length)}
              </p>
            )}

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

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {results.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url || "#"}
                  target="_blank"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    borderRadius: 12,
                    padding: "10px 12px",
                    background: "#ffffff",
                    border: "1px solid rgba(148,163,184,0.4)",
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                    {item.title || "Senza titolo"}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.7 }}>
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

          {/* COLUMNA INFO */}
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

      {/* MODALE EMAIL */}
      <EmailGateModal
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onConfirm={handleEmailCollected}
        t={t}
      />
    </main>
  );
}

/* ============================================================================
   EMAIL GATE MODAL
============================================================================ */

function EmailGateModal({
  isOpen,
  onClose,
  onConfirm,
  t,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (email: string) => void;
  t: any;
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
      setError(t.emailGateErrorInvalid);
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirm(trimmed);
    } catch {
      setError(t.emailGateErrorGeneric);
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
        <h2 style={{ marginBottom: 8 }}>{t.emailGateTitle}</h2>

        <p style={{ marginBottom: 16, opacity: 0.9 }}>
          {t.emailGateDescription}
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder={t.emailGatePlaceholder}
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
              {t.emailGateCancel}
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                fontWeight: 600,
                cursor: "pointer",
                background: "#0f172a",
                color: "#fff",
              }}
            >
              {isSubmitting ? t.emailGateSubmitting : t.emailGateSubmit}
            </button>
          </div>
        </form>

        <p style={{ marginTop: 10, fontSize: 11, opacity: 0.7 }}>
          {t.emailGateFooter}
        </p>
      </div>
    </div>
  );
}
