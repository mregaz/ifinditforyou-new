"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Lang, normalizeLang } from "@/lib/lang";

const PRO_TEXTS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    alreadyProTitle: string;
    alreadyProText: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    priceLabel: string;
    cta: string;
    ctaLoading: string;
    backToHome: string;
    errorGeneric: string;
  }
> = {
  it: {
    title: "Passa a iFindItForYou PRO",
    subtitle:
      "Sblocca ricerche illimitate e risultati più approfonditi, senza limiti giornalieri.",
    alreadyProTitle: "Sei già PRO 🎉",
    alreadyProText:
      "Il tuo abbonamento PRO è attivo. Puoi tornare alla home e usare tutte le funzionalità senza limiti.",
    bullet1: "Ricerche illimitate, nessun blocco dopo le 2 gratuite.",
    bullet2: "Risultati più curati, con riassunti ottimizzati.",
    bullet3: "Supporto prioritario quando qualcosa non funziona.",
    priceLabel: "CHF 9.90 / mese oppure CHF 89 / anno. Disdici quando vuoi.",
    cta: "Passa a PRO",
    ctaLoading: "Reindirizzamento al pagamento...",
    backToHome: "Torna alla home",
    errorGeneric:
      "C'è stato un problema nel creare la sessione di pagamento. Riprova tra poco.",
  },
  fr: {
    title: "Passe à iFindItForYou PRO",
    subtitle:
      "Débloque des recherches illimitées et des résultats plus approfondis, sans limite quotidienne.",
    alreadyProTitle: "Tu es déjà PRO 🎉",
    alreadyProText:
      "Ton abonnement PRO est actif. Tu peux revenir à l’accueil et utiliser toutes les fonctionnalités sans limites.",
    bullet1: "Recherches illimitées, plus de blocage après 2 essais.",
    bullet2: "Résultats plus soignés, avec des résumés optimisés.",
    bullet3: "Support prioritaire en cas de problème.",
    priceLabel: "CHF 9.90 / mois ou CHF 89 / an. Résiliable à tout moment.",
    cta: "Passer en PRO",
    ctaLoading: "Redirection vers le paiement...",
    backToHome: "Retour à l’accueil",
    errorGeneric:
      "Un problème est survenu lors de la création du paiement. Réessaie dans un instant.",
  },
  en: {
    title: "Upgrade to iFindItForYou PRO",
    subtitle:
      "Unlock unlimited searches and deeper, more curated results, with no daily limits.",
    alreadyProTitle: "You’re already PRO 🎉",
    alreadyProText:
      "Your PRO subscription is active. You can go back to the homepage and use all features without limits.",
    bullet1: "Unlimited searches, no more blocking after 2 queries.",
    bullet2: "More curated results with better summaries.",
    bullet3: "Priority support when something breaks.",
    priceLabel: "CHF 9.90 / month or CHF 89 / year. Cancel anytime.",
    cta: "Go PRO",
    ctaLoading: "Redirecting to payment...",
    backToHome: "Back to homepage",
    errorGeneric:
      "There was a problem creating the checkout session. Please try again.",
  },
  de: {
    title: "Werde iFindItForYou PRO",
    subtitle:
      "Schalte unbegrenzte Suchanfragen und tiefere, kuratierte Ergebnisse frei – ohne tägliche Limits.",
    alreadyProTitle: "Du bist bereits PRO 🎉",
    alreadyProText:
      "Dein PRO-Abo ist aktiv. Du kannst zur Startseite zurückkehren und alle Funktionen ohne Limit nutzen.",
    bullet1:
      "Unbegrenzte Suchanfragen – kein Stopp mehr nach 2 Anfragen.",
    bullet2: "Besser kuratierte Ergebnisse mit optimierten Zusammenfassungen.",
    bullet3: "Priorisierter Support, wenn etwas nicht funktioniert.",
    priceLabel:
      "CHF 9.90 / Monat oder CHF 89 / Jahr. Jederzeit kündbar.",
    cta: "PRO werden",
    ctaLoading: "Weiterleitung zur Zahlung...",
    backToHome: "Zur Startseite",
    errorGeneric:
      "Beim Erstellen der Zahlungs-Session ist ein Fehler aufgetreten. Bitte versuche es später erneut.",
  },
};

export default function ProPage() {
  const searchParams = useSearchParams();
  const langFromQuery = normalizeLang(searchParams.get("lang"));
  const [lang, setLang] = useState<Lang>(langFromQuery);
  const [isPro, setIsPro] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingCheckout, setLoadingCheckout] = useState(false);

  const t = PRO_TEXTS[lang];

  // allinea lingua con localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("ifiy_lang") as Lang | null;
      if (saved && PRO_TEXTS[saved]) {
        setLang(saved);
      } else {
        localStorage.setItem("ifiy_lang", langFromQuery);
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // verifica se l’utente è già PRO
  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setIsPro(false);
          setLoadingUser(false);
          return;
        }

        const { data, error } = await supabase
          .from("User")
          .select("is_pro")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Errore is_pro /pro:", error);
          setIsPro(false);
        } else {
          setIsPro(!!data?.is_pro);
        }
      } catch (err) {
        console.error("Errore generico /pro:", err);
        setIsPro(false);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  const handleBackHome = () => {
    window.location.href = "/";
  };

  const handleGoProCheckout = async () => {
    try {
      setLoadingCheckout(true);

      // ATTENZIONE: cambia l’endpoint se nel tuo progetto il file è diverso
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
      });

      if (!res.ok) {
        console.error("Errore HTTP checkout:", res.status);
        alert(t.errorGeneric);
        setLoadingCheckout(false);
        return;
      }

      const data = await res.json();
      if (!data?.url) {
        alert(t.errorGeneric);
        setLoadingCheckout(false);
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Errore handleGoProCheckout:", err);
      alert(t.errorGeneric);
      setLoadingCheckout(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          width: "100%",
          background: "#ffffff",
          borderRadius: 16,
          padding: 24,
          boxShadow: "0 12px 30px rgba(15,23,42,0.12)",
          border: "1px solid rgba(148,163,184,0.4)",
        }}
      >
        {loadingUser ? (
          <p style={{ fontSize: 14, opacity: 0.8 }}>Loading...</p>
        ) : isPro ? (
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {t.alreadyProTitle}
            </h1>
            <p
              style={{
                fontSize: 14,
                opacity: 0.85,
                marginBottom: 20,
              }}
            >
              {t.alreadyProText}
            </p>

            <button
              type="button"
              onClick={handleBackHome}
              style={{
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.8)",
                padding: "8px 18px",
                fontSize: 14,
                background: "#0f172a",
                color: "#f9fafb",
                cursor: "pointer",
              }}
            >
              {t.backToHome}
            </button>
          </div>
        ) : (
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              {t.title}
            </h1>
            <p
              style={{
                fontSize: 14,
                opacity: 0.85,
                marginBottom: 16,
              }}
            >
              {t.subtitle}
            </p>

            <ul
              style={{
                fontSize: 14,
                paddingLeft: 18,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              <li>{t.bullet1}</li>
              <li>{t.bullet2}</li>
              <li>{t.bullet3}</li>
            </ul>

            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              {t.priceLabel}
            </p>

            <button
              type="button"
              disabled={loadingCheckout}
              onClick={handleGoProCheckout}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "10px 22px",
                fontSize: 15,
                fontWeight: 600,
                background: "#0f172a",
                color: "#f9fafb",
                cursor: loadingCheckout ? "not-allowed" : "pointer",
              }}
            >
              {loadingCheckout ? t.ctaLoading : t.cta}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
