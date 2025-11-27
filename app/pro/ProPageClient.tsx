"use client";

import { useState, useEffect } from "react";

type BillingPeriod = "monthly" | "yearly";
type Lang = "it" | "fr" | "de" | "en";

const PRO_TEXTS = {
  it: {
    languageLabel: "Lingua:",
    heroTitleBefore: "Passa a",
    heroTitleHighlight: "IFindItForYou PRO",
    heroSubtitle:
      "Tu descrivi quello che cerchi, noi troviamo per te il meglio del web e te lo serviamo già filtrato e riassunto.",
    toggleMonthly: "Mensile",
    toggleYearly: "Annuale (risparmi)",
    freeTitle: "Piano Free",
    freeSubtitle: "Per provare il servizio senza impegno.",
    freePriceSuffix: "/ per sempre",
    freeBullets: [
      "1 ricerca gratuita senza email",
      "+1 ricerca gratuita con email",
      "Risultati base generati dall'AI",
      "Nessuna carta di credito richiesta",
    ],
    freeButtonCurrent: "Piano attuale",
    proTitle: "IFindItForYou PRO",
    proBadge: "Consigliato",
    proSubtitle:
      "Per chi vuole risposte migliori, più veloci e subito utilizzabili.",
    proPriceMonthlySuffix: "/ mese",
    proPriceYearlySuffix: "/ anno",
    stripeNote: "Pagamento sicuro con Stripe. Puoi disdire quando vuoi.",
    proBullets: [
      "Ricerche avanzate illimitate",
      "Risultati filtrati, ordinati e riassunti",
      "Priorità nelle richieste",
      "Accesso anticipato alle nuove funzioni",
      "Supporto via email dedicato",
    ],
    buttonAlreadyPro: "Sei già PRO",
    buttonRedirectMonthly: "Reindirizzamento a Stripe (mensile)...",
    buttonRedirectYearly: "Reindirizzamento a Stripe (annuale)...",
    buttonGoPro: "Passa a PRO",
    cancelNote:
      "Nessun vincolo lungo termine. Puoi annullare il rinnovo in qualsiasi momento dal tuo account Stripe.",
    compareTitle: "Confronto veloce: Free vs PRO",
    compFeature: "Funzionalità",
    compFree: "Free",
    compPro: "PRO",
    compRows: [
      {
        feature: "Numero di ricerche",
        free: "2 (1 + 1 con email)",
        pro: "Illimitate",
      },
      {
        feature: "Qualità risultati",
        free: "Base",
        pro: "Avanzata, filtrata e riassunta",
      },
      {
        feature: "Priorità nelle richieste",
        free: "Normale",
        pro: "Alta",
      },
      {
        feature: "Nuove funzioni",
        free: "Accesso standard",
        pro: "Accesso anticipato",
      },
      {
        feature: "Supporto",
        free: "—",
        pro: "Email dedicata",
      },
    ],
    faqTitle: "Domande frequenti (FAQ)",
    faq: [
      {
        q: "Posso annullare l'abbonamento quando voglio?",
        a: "Certo. Puoi annullare il rinnovo automatico in qualsiasi momento dal tuo account Stripe. Continuerai a usare il piano PRO fino alla scadenza già pagata.",
      },
      {
        q: "Il pagamento è sicuro?",
        a: "Usiamo Stripe, la piattaforma n°1 al mondo per pagamenti online. Nessun dato della tua carta passa dai nostri server.",
      },
      {
        q: "Cosa cambia tra la versione Free e PRO?",
        a: "La versione Free offre solo richieste limitate e risultati base. La versione PRO include ricerche illimitate, risposte avanzate, priorità e funzioni extra.",
      },
      {
        q: "Posso usare il servizio anche da mobile?",
        a: "Sì, tutta la piattaforma è ottimizzata anche per smartphone e tablet.",
      },
      {
        q: "Riceverò fattura per l'abbonamento?",
        a: "Sì, Stripe invia automaticamente la ricevuta/fattura via email dopo ogni pagamento.",
      },
    ],
    legalTextBeforeTerms: "Prima di abbonarti, puoi leggere i",
    legalTerms: "Termini e condizioni",
    legalAnd: "e l'informativa su",
    legalPrivacy: "Protezione dati / Privacy",
  },
  fr: {
    languageLabel: "Langue :",
    heroTitleBefore: "Passe à",
    heroTitleHighlight: "IFindItForYou PRO",
    heroSubtitle:
      "Tu décris ce que tu cherches, nous trouvons pour toi le meilleur du web et nous te le servons déjà filtré et résumé.",
    toggleMonthly: "Mensuel",
    toggleYearly: "Annuel (économies)",
    freeTitle: "Plan Gratuit",
    freeSubtitle: "Pour tester le service sans engagement.",
    freePriceSuffix: "/ pour toujours",
    freeBullets: [
      "1 recherche gratuite sans email",
      "+1 recherche gratuite avec email",
      "Résultats de base générés par l'IA",
      "Aucune carte de crédit requise",
    ],
    freeButtonCurrent: "Plan actuel",
    proTitle: "IFindItForYou PRO",
    proBadge: "Recommandé",
    proSubtitle:
      "Pour ceux qui veulent des réponses meilleures, plus rapides et immédiatement exploitables.",
    proPriceMonthlySuffix: "/ mois",
    proPriceYearlySuffix: "/ an",
    stripeNote:
      "Paiement sécurisé avec Stripe. Tu peux annuler quand tu veux.",
    proBullets: [
      "Recherches avancées illimitées",
      "Résultats filtrés, triés et résumés",
      "Priorité dans les demandes",
      "Accès anticipé aux nouvelles fonctionnalités",
      "Support par email dédié",
    ],
    buttonAlreadyPro: "Tu es déjà PRO",
    buttonRedirectMonthly:
      "Redirection vers Stripe (mensuel)…",
    buttonRedirectYearly:
      "Redirection vers Stripe (annuel)…",
    buttonGoPro: "Passer à PRO",
    cancelNote:
      "Pas d'engagement long terme. Tu peux annuler le renouvellement à tout moment depuis ton compte Stripe.",
    compareTitle: "Comparatif rapide : Free vs PRO",
    compFeature: "Fonctionnalité",
    compFree: "Free",
    compPro: "PRO",
    compRows: [
      {
        feature: "Nombre de recherches",
        free: "2 (1 + 1 avec email)",
        pro: "Illimitées",
      },
      {
        feature: "Qualité des résultats",
        free: "Basique",
        pro: "Avancée, filtrée et résumée",
      },
      {
        feature: "Priorité dans les demandes",
        free: "Normale",
        pro: "Haute",
      },
      {
        feature: "Nouvelles fonctionnalités",
        free: "Accès standard",
        pro: "Accès anticipé",
      },
      {
        feature: "Support",
        free: "—",
        pro: "Email dédié",
      },
    ],
    faqTitle: "Questions fréquentes (FAQ)",
    faq: [
      {
        q: "Puis-je annuler l'abonnement quand je veux ?",
        a: "Oui. Tu peux annuler le renouvellement automatique à tout moment depuis ton compte Stripe. Tu gardes l'accès PRO jusqu'à la fin de la période déjà payée.",
      },
      {
        q: "Le paiement est-il sécurisé ?",
        a: "Nous utilisons Stripe, la plateforme n°1 mondiale pour les paiements en ligne. Aucune donnée de carte ne passe par nos serveurs.",
      },
      {
        q: "Quelle est la différence entre la version Free et PRO ?",
        a: "La version Free offre seulement quelques recherches et des résultats basiques. La version PRO inclut des recherches illimitées, des réponses avancées, la priorité et des fonctionnalités supplémentaires.",
      },
      {
        q: "Puis-je utiliser le service sur mobile ?",
        a: "Oui, toute la plateforme est optimisée pour smartphone et tablette.",
      },
      {
        q: "Recevrai-je une facture pour l'abonnement ?",
        a: "Oui, Stripe envoie automatiquement un reçu / une facture par email après chaque paiement.",
      },
    ],
    legalTextBeforeTerms: "Avant de t'abonner, tu peux lire les",
    legalTerms: "Conditions générales",
    legalAnd: "et la politique de",
    legalPrivacy: "Protection des données / Privacy",
  },
  de: {
    languageLabel: "Sprache:",
    heroTitleBefore: "Wechsle zu",
    heroTitleHighlight: "IFindItForYou PRO",
    heroSubtitle:
      "Du beschreibst, was du suchst, wir finden für dich das Beste aus dem Web – bereits gefiltert und zusammengefasst.",
    toggleMonthly: "Monatlich",
    toggleYearly: "Jährlich (sparen)",
    freeTitle: "Kostenloser Plan",
    freeSubtitle: "Zum Testen des Dienstes ohne Verpflichtung.",
    freePriceSuffix: "/ für immer",
    freeBullets: [
      "1 kostenlose Suche ohne E-Mail",
      "+1 kostenlose Suche mit E-Mail",
      "Basis-Ergebnisse, von der KI erstellt",
      "Keine Kreditkarte erforderlich",
    ],
    freeButtonCurrent: "Aktueller Plan",
    proTitle: "IFindItForYou PRO",
    proBadge: "Empfohlen",
    proSubtitle:
      "Für alle, die bessere, schnellere und sofort nutzbare Antworten wollen.",
    proPriceMonthlySuffix: "/ Monat",
    proPriceYearlySuffix: "/ Jahr",
    stripeNote:
      "Sichere Zahlung mit Stripe. Du kannst jederzeit kündigen.",
    proBullets: [
      "Unbegrenzte erweiterte Suchanfragen",
      "Gefilterte, sortierte und zusammengefasste Ergebnisse",
      "Priorität bei Anfragen",
      "Frühzeitiger Zugang zu neuen Funktionen",
      "Dedizierter E-Mail-Support",
    ],
    buttonAlreadyPro: "Du bist bereits PRO",
    buttonRedirectMonthly:
      "Weiterleitung zu Stripe (monatlich)…",
    buttonRedirectYearly:
      "Weiterleitung zu Stripe (jährlich)…",
    buttonGoPro: "Zu PRO wechseln",
    cancelNote:
      "Keine langfristige Bindung. Du kannst die Verlängerung jederzeit in deinem Stripe-Konto deaktivieren.",
    compareTitle: "Schneller Vergleich: Free vs PRO",
    compFeature: "Funktion",
    compFree: "Free",
    compPro: "PRO",
    compRows: [
      {
        feature: "Anzahl der Suchanfragen",
        free: "2 (1 + 1 mit E-Mail)",
        pro: "Unbegrenzt",
      },
      {
        feature: "Qualität der Ergebnisse",
        free: "Basis",
        pro: "Erweitert, gefiltert und zusammengefasst",
      },
      {
        feature: "Priorität bei Anfragen",
        free: "Normal",
        pro: "Hoch",
      },
      {
        feature: "Neue Funktionen",
        free: "Standardzugang",
        pro: "Frühzeitiger Zugang",
      },
      {
        feature: "Support",
        free: "—",
        pro: "Dedizierte E-Mail",
      },
    ],
    faqTitle: "Häufige Fragen (FAQ)",
    faq: [
      {
        q: "Kann ich das Abonnement jederzeit kündigen?",
        a: "Ja. Du kannst die automatische Verlängerung jederzeit in deinem Stripe-Konto deaktivieren. Du behältst PRO bis zum Ende des bereits bezahlten Zeitraums.",
      },
      {
        q: "Ist die Zahlung sicher?",
        a: "Wir verwenden Stripe, die weltweit führende Plattform für Online-Zahlungen. Keine Kartendaten laufen über unsere Server.",
      },
      {
        q: "Was ist der Unterschied zwischen Free und PRO?",
        a: "Die Free-Version bietet nur wenige Anfragen und Basis-Ergebnisse. Die PRO-Version umfasst unbegrenzte Suchen, erweiterte Antworten, Priorität und zusätzliche Funktionen.",
      },
      {
        q: "Kann ich den Dienst auch mobil nutzen?",
        a: "Ja, die gesamte Plattform ist für Smartphones und Tablets optimiert.",
      },
      {
        q: "Bekomme ich eine Rechnung für das Abonnement?",
        a: "Ja, Stripe sendet nach jeder Zahlung automatisch eine Quittung/Rechnung per E-Mail.",
      },
    ],
    legalTextBeforeTerms: "Bevor du ein Abo abschließt, kannst du die",
    legalTerms: "Allgemeinen Geschäftsbedingungen",
    legalAnd: "und die Hinweise zum",
    legalPrivacy: "Datenschutz / Privacy",
  },
  en: {
    languageLabel: "Language:",
    heroTitleBefore: "Switch to",
    heroTitleHighlight: "IFindItForYou PRO",
    heroSubtitle:
      "You describe what you need, we find the best of the web for you – already filtered and summarized.",
    toggleMonthly: "Monthly",
    toggleYearly: "Yearly (save)",
    freeTitle: "Free Plan",
    freeSubtitle: "To try the service with no commitment.",
    freePriceSuffix: "/ forever",
    freeBullets: [
      "1 free search without email",
      "+1 free search with email",
      "Basic results generated by AI",
      "No credit card required",
    ],
    freeButtonCurrent: "Current plan",
    proTitle: "IFindItForYou PRO",
    proBadge: "Recommended",
    proSubtitle:
      "For those who want better, faster and ready-to-use answers.",
    proPriceMonthlySuffix: "/ month",
    proPriceYearlySuffix: "/ year",
    stripeNote:
      "Secure payment with Stripe. You can cancel any time.",
    proBullets: [
      "Unlimited advanced searches",
      "Filtered, sorted and summarized results",
      "Priority on requests",
      "Early access to new features",
      "Dedicated email support",
    ],
    buttonAlreadyPro: "You’re already PRO",
    buttonRedirectMonthly:
      "Redirecting to Stripe (monthly)…",
    buttonRedirectYearly:
      "Redirecting to Stripe (yearly)…",
    buttonGoPro: "Go PRO",
    cancelNote:
      "No long-term commitment. You can cancel renewal at any time from your Stripe account.",
    compareTitle: "Quick comparison: Free vs PRO",
    compFeature: "Feature",
    compFree: "Free",
    compPro: "PRO",
    compRows: [
      {
        feature: "Number of searches",
        free: "2 (1 + 1 with email)",
        pro: "Unlimited",
      },
      {
        feature: "Result quality",
        free: "Basic",
        pro: "Advanced, filtered and summarized",
      },
      {
        feature: "Request priority",
        free: "Normal",
        pro: "High",
      },
      {
        feature: "New features",
        free: "Standard access",
        pro: "Early access",
      },
      {
        feature: "Support",
        free: "—",
        pro: "Dedicated email",
      },
    ],
    faqTitle: "Frequently Asked Questions (FAQ)",
    faq: [
      {
        q: "Can I cancel my subscription any time?",
        a: "Yes. You can cancel automatic renewal at any time from your Stripe account. You keep PRO access until the end of the already paid period.",
      },
      {
        q: "Is the payment secure?",
        a: "We use Stripe, the world’s leading platform for online payments. None of your card data passes through our servers.",
      },
      {
        q: "What’s the difference between Free and PRO?",
        a: "The Free version offers only a few requests and basic results. PRO includes unlimited searches, advanced answers, priority and extra features.",
      },
      {
        q: "Can I use the service on mobile?",
        a: "Yes, the whole platform is optimized for smartphones and tablets.",
      },
      {
        q: "Will I receive an invoice?",
        a: "Yes, Stripe automatically sends a receipt/invoice by email after each payment.",
      },
    ],
    legalTextBeforeTerms: "Before subscribing, you can read the",
    legalTerms: "Terms and Conditions",
    legalAnd: "and the",
    legalPrivacy: "Privacy / Data protection policy",
  },
} as const;

export default function ProPageClient() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState<BillingPeriod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);
  const [lang, setLang] = useState<Lang>("it");

  const t = PRO_TEXTS[lang];

  // leggi lingua da ?lang=it|fr|de|en
  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = window.localStorage.getItem("isPro");
      setIsPro(value === "true");

      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      if (
        urlLang === "it" ||
        urlLang === "fr" ||
        urlLang === "de" ||
        urlLang === "en"
      ) {
        setLang(urlLang as Lang);
      }
    }
  }, []);

  const handleCheckout = async (period: BillingPeriod) => {
  try {
    // indichiamo quale periodo è in loading
    setIsLoading(period);
    setError(null);

    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ billingPeriod: period }),
    });

    // leggiamo SEMPRE il testo grezzo
    const bodyText = await res.text();
    console.log("checkout response:", res.status, bodyText);

    // Se la risposta NON è ok (status 4xx / 5xx)
    if (!res.ok) {
      let message = "Errore nella creazione della sessione di pagamento.";

      // 1) Proviamo a leggere error da JSON { error: "..." }
      try {
        const parsed = JSON.parse(bodyText);
        if (parsed && typeof parsed.error === "string") {
          message = parsed.error;
        }
      } catch {
        // 2) Se non è JSON, mostriamo comunque un pezzo del body
        if (bodyText) {
          message =
            message + " Dettagli: " + bodyText.slice(0, 200) + (bodyText.length > 200 ? "..." : "");
        }
      }

      setError(message);
      return;
    }

    // Se la risposta è ok, proviamo a leggere { url: "..." }
    let data: { url?: string } = {};
    try {
      data = JSON.parse(bodyText);
    } catch {
      // non è JSON: mostriamo errore
      setError(
        "Risposta inattesa dal server durante la creazione del checkout."
      );
      return;
    }

    if (!data.url) {
      setError("URL di checkout mancante nella risposta del server.");
      return;
    }

    // Tutto ok: reindirizziamo a Stripe
    window.location.href = data.url;
  } catch (err: any) {
    console.error("handleCheckout error:", err);
    setError(
      err?.message ?? "Errore imprevisto durante la creazione del checkout."
    );
  } finally {
    // resettiamo lo stato di loading
    setIsLoading(null);
  }
};


  const isMonthly = billingPeriod === "monthly";

  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  } as const;

  const containerStyle = {
    width: "100%",
    maxWidth: 960,
  } as const;

  const cardsWrapperStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
  } as const;

  const cardBaseStyle = {
    borderRadius: 16,
    border: "1px solid #1f2933",
    backgroundColor: "#020617",
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  };

  const cardStyle = {
    ...cardBaseStyle,
  };

  const proCardStyle = {
    ...cardBaseStyle,
    borderColor: "#22c55e",
    boxShadow: "0 0 40px rgba(34,197,94,0.25)",
  };

  const priceStyle = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 4,
  } as const;

  const buttonBaseStyle = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  } as const;

  const disabledButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: "#1f2937",
    color: "#9ca3af",
    cursor: "not-allowed",
  } as const;

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: isLoading ? "#6ee7b7" : "#22c55e",
    color: "#022c22",
  } as const;

  const linkStyle = {
    color: "#6ee7b7",
    textDecoration: "underline",
  } as const;

  const buildLangLinkStyle = (code: Lang) => ({
    color: lang === code ? "#bbf7d0" : "#6ee7b7",
    textDecoration: "underline",
    fontWeight: lang === code ? 700 : 400,
  });

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <header style={{ marginBottom: 32 }}>
          {/* Switch lingua in alto a destra */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              fontSize: 12,
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            <span>{t.languageLabel}</span>
            <a href="/pro?lang=it" style={buildLangLinkStyle("it")}>
              IT
            </a>
            <span>|</span>
            <a href="/pro?lang=fr" style={buildLangLinkStyle("fr")}>
              FR
            </a>
            <span>|</span>
            <a href="/pro?lang=de" style={buildLangLinkStyle("de")}>
              DE
            </a>
            <span>|</span>
            <a href="/pro?lang=en" style={buildLangLinkStyle("en")}>
              EN
            </a>
          </div>

          {/* Titolo e sottotitolo centrati */}
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
              {t.heroTitleBefore}{" "}
              <span style={{ color: "#22c55e" }}>
                {t.heroTitleHighlight}
              </span>
            </h1>
            <p style={{ maxWidth: 600, margin: "0 auto", color: "#9ca3af" }}>
              {t.heroSubtitle}
            </p>
          </div>
        </header>

        {/* Toggle mensile / annuale */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: 4,
              borderRadius: 999,
              backgroundColor: "#020617",
              border: "1px solid #1f2937",
            }}
          >
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isMonthly ? 600 : 400,
                backgroundColor: isMonthly ? "#22c55e" : "transparent",
                color: isMonthly ? "#022c22" : "#e5e7eb",
              }}
            >
              {t.toggleMonthly}
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: !isMonthly ? 600 : 400,
                backgroundColor: !isMonthly ? "#22c55e" : "transparent",
                color: !isMonthly ? "#022c22" : "#e5e7eb",
              }}
            >
              {t.toggleYearly}
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            ...cardsWrapperStyle,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {/* FREE */}
          <section style={cardStyle}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                {t.freeTitle}
              </h2>
              <p
                style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}
              >
                {t.freeSubtitle}
              </p>
              <p style={priceStyle}>
                $0{" "}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 400,
                    color: "#9ca3af",
                  }}
                >
                  {t.freePriceSuffix}
                </span>
              </p>
              <ul
                style={{
                  fontSize: 14,
                  color: "#e5e7eb",
                  paddingLeft: 16,
                }}
              >
                {t.freeBullets.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: 24 }}>
              <button type="button" style={disabledButtonStyle} disabled>
                {t.freeButtonCurrent}
              </button>
            </div>
          </section>

          {/* PRO */}
          <section style={proCardStyle}>
            <div>
              <div
                style={{
                  position: "relative",
                  marginBottom: 8,
                }}
              >
                <h2
                  style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}
                >
                  {t.proTitle}
                </h2>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 999,
                    backgroundColor: "#22c55e",
                    color: "#022c22",
                    fontWeight: 600,
                  }}
                >
                  {t.proBadge}
                </span>
              </div>
              <p
                style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}
              >
                {t.proSubtitle}
              </p>

              {isMonthly ? (
                <p style={priceStyle}>
                  $9.99{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9ca3af",
                    }}
                  >
                    {t.proPriceMonthlySuffix}
                  </span>
                </p>
              ) : (
                <p style={priceStyle}>
                  $89{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9ca3af",
                    }}
                  >
                    {t.proPriceYearlySuffix}
                  </span>
                </p>
              )}

              <p
                style={{ fontSize: 12, color: "#6ee7b7", marginBottom: 12 }}
              >
                {t.stripeNote}
              </p>

              <ul
                style={{
                  fontSize: 14,
                  color: "#e5e7eb",
                  paddingLeft: 16,
                }}
              >
                {t.proBullets.map((b, idx) => (
                  <li key={idx}>• {b}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                type="button"
                onClick={() => handleCheckout(billingPeriod)}
                disabled={isPro || isLoading !== null}
                style={
                  isPro || isLoading !== null
                    ? disabledButtonStyle
                    : primaryButtonStyle
                }
              >
                {isPro
                  ? t.buttonAlreadyPro
                  : isLoading === "monthly"
                  ? t.buttonRedirectMonthly
                  : isLoading === "yearly"
                  ? t.buttonRedirectYearly
                  : t.buttonGoPro}
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                {t.cancelNote}
              </p>

              {error && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#f87171",
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* Tabella confronto Free vs PRO */}
        <section
          style={{
            marginTop: 40,
            padding: 16,
            borderRadius: 16,
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
            overflowX: "auto",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              textAlign: "center",
              color: "#22c55e",
            }}
          >
            {t.compareTitle}
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#9ca3af",
                  }}
                >
                  {t.compFeature}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#9ca3af",
                  }}
                >
                  {t.compFree}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#bbf7d0",
                  }}
                >
                  {t.compPro}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.compRows.map((row, idx) => (
                <tr key={idx}>
                  <td
                    style={{
                      padding: "8px 4px",
                      borderBottom: "1px solid #111827",
                    }}
                  >
                    {row.feature}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      borderBottom: "1px solid #111827",
                    }}
                  >
                    {row.free}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      padding: "8px 4px",
                      borderBottom: "1px solid #111827",
                      color: "#4ade80",
                      fontWeight: 600,
                    }}
                  >
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* FAQ */}
        <section
          style={{
            marginTop: 48,
            padding: "24px 16px",
            borderRadius: 16,
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
          }}
        >
          <h2
            style={{
              fontSize: 20,
              fontWeight: 700,
              marginBottom: 16,
              textAlign: "center",
              color: "#22c55e",
            }}
          >
            {t.faqTitle}
          </h2>

          {t.faq.map((item, idx) => (
            <div key={idx} style={{ marginBottom: 16 }}>
              <p style={{ fontWeight: 600, marginBottom: 4 }}>{item.q}</p>
              <p style={{ color: "#9ca3af" }}>{item.a}</p>
            </div>
          ))}
        </section>

        {/* Legal: Termini & Privacy */}
        <section
          style={{
            marginTop: 32,
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          <p>
            {t.legalTextBeforeTerms}{" "}
            <a href="/termini" style={linkStyle}>
              {t.legalTerms}
            </a>{" "}
            {t.legalAnd}{" "}
            <a href="/privacy" style={linkStyle}>
              {t.legalPrivacy}
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
