"use client";

import type React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { Lang } from "@/lib/lang";
import LanguageSwitcher from "@/components/LanguageSwitcher";

/* ============================================================================
   TEXTS MULTILINGUA
============================================================================ */

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
        ? `Hai ancora ${credits} ricerche gratuite.`
        : "Hai esaurito le ricerche gratuite.",
    outOfCredits:
      "Hai esaurito le ricerche gratuite. Attiva il piano PRO per continuare.",
    sectionHowTitle: "Come funziona",
    sectionHowText:
      "Scrivi cosa ti serve. L’AI analizza la richiesta, cerca sul web e ti mostra solo risultati filtrati.",
    sectionWhyTitle: "Perché non usare solo Google?",
    sectionWhyText:
      "Google ti dà milioni di risultati. iFindItForYou ti restituisce solo pochi risultati pertinenti, già filtrati.",
    sectionProTitle: "Free vs PRO",
    sectionProFree: "Ricerche gratuite per provare il servizio.",
    sectionProPaid:
      "Con PRO hai ricerche illimitate e risultati più approfonditi.",
    sectionFaqTitle: "Privacy & dati",
    sectionFaqText:
      "Le tue ricerche servono solo a migliorare i risultati. Non vendiamo dati.",
    resultsTitle: "Risultati",
    resultsCount: (n: number) =>
      n === 1 ? "Ho trovato 1 opzione per te." : `Ho trovato ${n} opzioni per te.`,
    empty: "Fai una ricerca per vedere qualche esempio 👆",
    recentTitle: "Le tue ultime ricerche",
    recentEmpty: "Ancora nessuna ricerca salvata.",
    savedSearchBanner: "Stai rifacendo una ricerca salvata.",

    emailGateTitle: "Sblocca la seconda ricerca gratuita",
    emailGateDescription:
      "Ti chiediamo solo la tua email per concederti la seconda ricerca gratuita.",
    emailGatePlaceholder: "la-tua-email@esempio.com",
    emailGateCancel: "Annulla",
    emailGateSubmit: "Sblocca ricerca",
    emailGateSubmitting: "Invio...",
    emailGateErrorInvalid: "Per favore inserisci un’email valida.",
    emailGateErrorGeneric: "Errore temporaneo, riprova.",
    emailGateFooter:
      "Nessuno spam. Solo aggiornamenti importanti sul servizio.",
    headerAccount: "Account",
    headerLogin: "Accedi",
    mottoShort: "Io lo cerco per te",
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
        ? `You have ${credits} free searches left.`
        : "You’ve used your free searches.",
    outOfCredits: "You’ve used your free searches. Activate PRO to continue.",
    sectionHowTitle: "How it works",
    sectionHowText:
      "Describe what you need. The AI analyzes your request, searches online and shows filtered results.",
    sectionWhyTitle: "Why not Google?",
    sectionWhyText:
      "Google gives millions of results. iFindItForYou gives a few, curated and focused ones.",
    sectionProTitle: "Free vs PRO",
    sectionProFree: "Free searches to try the service.",
    sectionProPaid:
      "With PRO you get unlimited searches and deeper results.",
    sectionFaqTitle: "Privacy & data",
    sectionFaqText:
      "Your searches are used only to improve the service. We never sell data.",
    resultsTitle: "Results",
    resultsCount: (n: number) =>
      n === 1 ? "I found 1 option for you." : `I found ${n} options for you.`,
    empty: "Start a search to see how it works 👆",
    recentTitle: "Your recent searches",
    recentEmpty: "No saved searches yet.",
    savedSearchBanner: "You are repeating a saved search.",

    emailGateTitle: "Unlock your second free search",
    emailGateDescription:
      "We only ask for your email to give you the second free search.",
    emailGatePlaceholder: "your-email@example.com",
    emailGateCancel: "Cancel",
    emailGateSubmit: "Unlock search",
    emailGateSubmitting: "Sending...",
    emailGateErrorInvalid: "Please enter a valid email.",
    emailGateErrorGeneric: "Something went wrong. Try again.",
    emailGateFooter: "No spam. Only useful updates.",
    errorSearch: "Search error. Try again soon.",
    errorNetwork: "Network problem. Check your connection.",
    headerAccount: "Account",
    headerLogin: "Log in",
    mottoShort: "I find it for you",
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
        ? `Il te reste ${c} recherches gratuites.`
        : "Tu as utilisé tes recherches gratuites.",
    outOfCredits:
      "Tu as utilisé toutes tes recherches gratuites. Active PRO pour continuer.",
    sectionHowTitle: "Comment ça marche",
    sectionHowText:
      "Décris ce dont tu as besoin. L’IA analyse ta demande, cherche en ligne et filtre les résultats.",
    sectionWhyTitle: "Pourquoi pas Google ?",
    sectionWhyText:
      "Google donne des millions de résultats. iFindItForYou en donne quelques-uns, déjà filtrés.",
    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "Recherches gratuites pour tester (1 sans email + 1 avec email).",
    sectionProPaid: "Avec PRO tu as des recherches illimitées.",
    sectionFaqTitle: "Vie privée & données",
    sectionFaqText:
      "Tes recherches servent seulement à améliorer le service.",
    resultsTitle: "Résultats",
    resultsCount: (n: number) =>
      n === 1 ? "J’ai trouvé 1 option pour toi." : `J’ai trouvé ${n} options.`,
    empty: "Fais une recherche pour voir comment ça marche 👆",
    recentTitle: "Tes dernières recherches",
    recentEmpty: "Aucune recherche enregistrée pour l’instant.",
    savedSearchBanner: "Tu relances une recherche enregistrée.",

    emailGateTitle: "Débloque ta deuxième recherche gratuite",
    emailGateDescription:
      "On te demande juste ton email pour t’offrir la deuxième recherche.",
    emailGatePlaceholder: "ton-email@exemple.com",
    emailGateCancel: "Annuler",
    emailGateSubmit: "Débloquer",
    emailGateSubmitting: "Envoi...",
    emailGateErrorInvalid: "Email invalide.",
    emailGateErrorGeneric: "Erreur. Réessaie.",
    emailGateFooter: "Pas de spam. Seulement des infos importantes.",
    errorSearch: "Erreur lors de la recherche.",
    errorNetwork: "Problème réseau.",
    headerAccount: "Compte",
    headerLogin: "Connexion",
    mottoShort: "Je le trouve pour toi",
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
        ? `Du hast noch ${c} kostenlose Suchanfragen.`
        : "Du hast deine kostenlosen Suchanfragen aufgebraucht.",
    outOfCredits:
      "Keine freien Suchanfragen mehr. Aktiviere PRO.",
    sectionHowTitle: "Wie es funktioniert",
    sectionHowText:
      "Beschreibe, was du brauchst. Die KI sucht online und filtert die besten Ergebnisse.",
    sectionWhyTitle: "Warum nicht Google?",
    sectionWhyText:
      "Google gibt Millionen Treffer. iFindItForYou gibt nur die relevanten.",
    sectionProTitle: "Free vs PRO",
    sectionProFree:
      "Kostenlose Suchanfragen zum Testen.",
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
    recentTitle: "Deine letzten Suchanfragen",
    recentEmpty: "Noch keine gespeicherten Suchanfragen.",
    savedSearchBanner: "Du wiederholst eine gespeicherte Suche.",

    emailGateTitle: "Zweite kostenlose Suche freischalten",
    emailGateDescription:
      "Wir brauchen nur deine E-Mail für die zweite Suchanfrage.",
    emailGatePlaceholder: "deine-email@beispiel.com",
    emailGateCancel: "Abbrechen",
    emailGateSubmit: "Freischalten",
    emailGateSubmitting: "Senden...",
    emailGateErrorInvalid: "Bitte gültige E-Mail eingeben.",
    emailGateErrorGeneric: "Fehler. Versuch es erneut.",
    emailGateFooter:
      "Kein Spam. Nur wichtige Updates.",
    errorSearch: "Fehler bei der Suche.",
    errorNetwork: "Netzwerkproblem.",
    headerAccount: "Konto",
    headerLogin: "Anmelden",
    mottoShort: "Ich finde es für dich",
  },
  es: {
  tagline: "Escribe lo que necesitas y lo encuentro por ti.",
  placeholder: "P. ej. iPhone 13 mini azul por menos de 350 CHF en Suiza",
  examplesLabel: "Ejemplos:",
  examples: [
    "iPhone 13 mini azul por menos de 350 CHF en Suiza",
    "Hotel de 3 estrellas en Zúrich por menos de 150 CHF",
    "Idea de regalo para un niño de 12 años fan de LEGO",
  ],

  search: "Buscar",
  proCta: "Hazte PRO",

  creditsLabel: (credits: number, isPro: boolean) =>
    isPro
      ? "Plan PRO activo: búsquedas ilimitadas."
      : credits > 0
      ? `Te quedan ${credits} búsquedas gratuitas.`
      : "Has utilizado todas tus búsquedas gratuitas.",

  outOfCredits:
    "Has utilizado todas tus búsquedas gratuitas. Activa PRO para continuar.",

  sectionHowTitle: "Cómo funciona",
  sectionHowText:
    "Describe lo que necesitas. La IA analiza tu solicitud, busca online y te muestra solo resultados filtrados.",

  sectionWhyTitle: "¿Por qué no usar Google?",
  sectionWhyText:
    "Google devuelve millones de resultados. iFindItForYou te da solo los relevantes, ya filtrados.",

  sectionProTitle: "Free vs PRO",
  sectionProFree: "Búsquedas gratuitas para probar el servicio.",
  sectionProPaid: "Con PRO tienes búsquedas ilimitadas y resultados más profundos.",

  sectionFaqTitle: "Privacidad y datos",
  sectionFaqText:
    "Tus búsquedas solo se usan para mejorar el servicio. Nunca vendemos datos.",

  resultsTitle: "Resultados",
  resultsCount: (n: number) =>
    n === 1 ? "He encontrado 1 opción para ti." : `He encontrado ${n} opciones para ti.`,

  empty: "Haz una búsqueda para ver cómo funciona 👆",

  recentTitle: "Tus últimas búsquedas",
  recentEmpty: "Todavía no hay búsquedas guardadas.",

  savedSearchBanner: "Estás repitiendo una búsqueda guardada.",

  emailGateTitle: "Desbloquea tu segunda búsqueda gratuita",
  emailGateDescription:
    "Solo te pedimos tu email para darte acceso a la segunda búsqueda gratuita.",
  emailGatePlaceholder: "tu-email@ejemplo.com",
  emailGateCancel: "Cancelar",
  emailGateSubmit: "Desbloquear búsqueda",
  emailGateSubmitting: "Enviando...",
  emailGateErrorInvalid: "Por favor introduce un email válido.",
  emailGateErrorGeneric: "Error temporal, inténtalo de nuevo.",
  emailGateFooter: "Nada de spam. Solo actualizaciones importantes sobre el servicio.",

  errorSearch: "Error en la búsqueda. Inténtalo de nuevo.",
  errorNetwork: "Problema de red. Comprueba tu conexión e inténtalo otra vez.",

  headerAccount: "Cuenta",
  headerLogin: "Iniciar sesión",

  mottoShort: "Lo encuentro por ti",
},

} as const;

/* ============================================================================
   TYPES & SMALL COMPONENTS
============================================================================ */

type ResultItem = {
  title?: string;
  url?: string;
  price?: string;
  source?: string;
};

type SearchRow = {
  query: string;
  created_at: string;
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
   HOME PAGE CLIENT
============================================================================ */

type HomePageClientProps = {
  initialLang: Lang;
};

export default function HomePageClient({ initialLang }: HomePageClientProps) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(2);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<SearchRow[]>([]);
  const [isFromSavedSearch, setIsFromSavedSearch] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = UI_TEXTS[lang] as any;


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
    } catch {
      // ignore
    }
  }, []);

  /* ----------------- LEGGE PARAMETRI URL (q, lang) PER RICERCHE SALVATE ----------------- */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const url = new URL(window.location.href);
      const qParam = url.searchParams.get("q");
      const langParam = url.searchParams.get("lang") as Lang | null;

      if (qParam) {
        setQuery(qParam);
        setIsFromSavedSearch(true);
      }

      if (langParam && UI_TEXTS[langParam]) {
        setLang(langParam);
      }
    } catch {
      // ignore
    }
  }, []);

  /* ----------------- SINCRONIZZA PRO E LOGIN DA SUPABASE ----------------- */
  useEffect(() => {
    async function syncPro() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setIsLoggedIn(false);
          setUserId(null);
          return;
        }

        setIsLoggedIn(true);
        setUserId(user.id);

        const { data } = await supabase
          .from("User")
          .select("is_pro, email")
          .eq("id", user.id)
          .single();

        if (data?.is_pro) {
          setIsPro(true);
        }
        if (data?.email) {
          setUserEmail(data.email);
        }
      } catch (e) {
        console.error("syncProFromSupabase error:", e);
      }
    }
    syncPro();
  }, []);

  /* ----------------- CARICA ULTIME RICERCHE ----------------- */
  useEffect(() => {
    async function loadRecent() {
      try {
        if (!userId) {
          setRecentSearches([]);
          return;
        }

        const { data, error } = await supabase
          .from("Search")
          .select("query, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          console.error("loadRecentSearches error:", error);
          setRecentSearches([]);
          return;
        }

        setRecentSearches((data || []) as SearchRow[]);
      } catch (e) {
        console.error("loadRecentSearches fatal:", e);
        setRecentSearches([]);
      }
    }

    loadRecent();
  }, [userId]);

  /* ----------------- SALVA SU LOCAL STORAGE ----------------- */
  useEffect(() => {
    try {
      localStorage.setItem("ifiy_credits", String(credits));
      localStorage.setItem("ifiy_isPro", isPro ? "true" : "false");
      localStorage.setItem("ifiy_lang", lang);
      if (userEmail) localStorage.setItem("ifiy_email", userEmail);
    } catch {
      // ignore
    }
  }, [credits, isPro, lang, userEmail]);

 
  

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
    setIsFromSavedSearch(false); // dopo che lanci una nuova ricerca, tolgo il banner

    const plan = isPro ? "pro" : "free";

    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q, lang, plan }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(t.errorSearch ?? "Errore nella ricerca.");
        return;
      }

      setResults(data.items || []);
      setSummary(data.summary || "");

      if (!isPro) setCredits((c) => (c > 0 ? c - 1 : 0));

      // Salva la ricerca su Supabase se l’utente è loggato
      try {
        if (userId) {
          await supabase.from("Search").insert({
            user_id: userId,
            query: q,
            lang,
            plan,
          });
          // ricarica le recenti
          const { data: recentData } = await supabase
            .from("Search")
            .select("query, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(10);
          setRecentSearches((recentData || []) as SearchRow[]);
        }
      } catch (err) {
        console.error("Errore nel salvataggio della ricerca:", err);
      }
    } catch (err) {
      alert(t.errorNetwork ?? "Errore di rete. Riprova.");
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
    } catch {
      // ignore
    }

    await handleSearch();
  };

  /* ----------------- CTA PRO ----------------- */
 function handleGoPro() {
  const href = lang === "it" ? "/pro" : `/${lang}/pro`;
  window.location.href = href;
}


  /* ----------------- CLICK SU RICERCA RECENTE ----------------- */
  const handleRecentClick = (s: SearchRow) => {
    setQuery(s.query);
    setIsFromSavedSearch(true);
    // non lancio automaticamente la ricerca: l'utente può modificare e poi premere "Cerca"
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    position: "sticky",
    top: 0,
    zIndex: 20,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(10px)",
  }}
>
  <div
    style={{
      maxWidth: 960,
      margin: "0 auto",
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
    }}
  >
    {/* Logo + motto */}
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ fontWeight: 700, fontSize: 18 }}>iFindItForYou</div>
      <span
        style={{
          fontSize: 11,
          padding: "2px 8px",
          borderRadius: 999,
          border: "1px solid rgba(148,163,184,0.6)",
          color: "#4b5563",
        }}
      >
        {t.mottoShort}
      </span>
    </div>

    {/* Free/PRO + switch lingua + login/account */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontSize: 13,
      }}
    >
      {/* Badge Free/PRO */}
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

      {/* Language switcher con bandierine */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <LanguageSwitcher />
      </div>

      {/* Login / Account */}
      <Link
        href={isLoggedIn ? "/account" : "/login"}
        style={{
          padding: "6px 12px",
          borderRadius: 999,
          border: "1px solid rgba(148,163,184,0.7)",
          textDecoration: "none",
          color: "#0f172a",
          background: "#f9fafb",
          fontWeight: 500,
          whiteSpace: "nowrap",
        }}
      >
        {isLoggedIn ? t.headerAccount : t.headerLogin}
      </Link>
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
                  whiteSpace: "nowrap",
                }}
              >
                {loading ? "..." : t.search}
              </button>
            </div>
          </form>

          {/* Banner per ricerche salvate */}
          {isFromSavedSearch && query && (
            <div
              style={{
                marginTop: 10,
                display: "inline-block",
                padding: "6px 12px",
                borderRadius: 999,
                border: "1px solid #fbbf24",
                background: "#fef3c7",
                fontSize: 13,
                color: "#92400e",
              }}
            >
              {t.savedSearchBanner}
            </div>
          )}

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
                alignItems: "center",
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
            {/* Ultime ricerche */}
            {userId && recentSearches.length === 0 && (
              <p
                style={{
                  fontSize: 13,
                  opacity: 0.7,
                  marginBottom: 12,
                }}
              >
                {t.recentEmpty}
              </p>
            )}

            {recentSearches.length > 0 && (
              <div
                style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 12,
                  background: "#e5e7eb",
                }}
              >
                <h3
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 6,
                  }}
                >
                  {t.recentTitle}
                </h3>
                <ul
                  style={{
                    fontSize: 13,
                    color: "#374151",
                    paddingLeft: 0,
                    margin: 0,
                    listStyle: "none",
                  }}
                >
                  {recentSearches.map((s, idx) => (
                    <li
                      key={idx}
                      style={{
                        marginBottom: 4,
                        cursor: "pointer",
                        padding: "4px 6px",
                        borderRadius: 6,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                      onClick={() => handleRecentClick(s)}
                    >
                      <span
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: "80%",
                        }}
                        title={s.query}
                      >
                        {s.query}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(s.created_at).toLocaleString("it-CH", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </li>
                  ))}
                </ul>
                <p
                  style={{
                    fontSize: 11,
                    color: "#4b5563",
                    marginTop: 6,
                    opacity: 0.8,
                  }}
                >
                  Clicca per riempire il campo di ricerca.
                </p>
              </div>
            )}

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

          {/* COLONNA INFO */}
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
