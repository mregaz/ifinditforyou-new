"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Lang = "it" | "fr" | "de" | "en";

const SUCCESS_TEXTS: Record<
  Lang,
  {
    title: string;
    subtitle: string;
    button: string;
    badge: string;
  }
> = {
  it: {
    title: "Pagamento completato!",
    subtitle:
      "Grazie, il tuo abbonamento IFindItForYou PRO è attivo. D’ora in poi hai ricerche illimitate e risultati migliori.",
    button: "Vai alla home",
    badge: "Ora sei PRO",
  },
  fr: {
    title: "Paiement réussi !",
    subtitle:
      "Merci, ton abonnement IFindItForYou PRO est actif. Tu as maintenant des recherches illimitées et de meilleurs résultats.",
    button: "Retour à l’accueil",
    badge: "Tu es PRO",
  },
  de: {
    title: "Zahlung erfolgreich!",
    subtitle:
      "Danke, dein IFindItForYou PRO-Abo ist aktiv. Ab jetzt hast du unbegrenzte Suchen und bessere Ergebnisse.",
    button: "Zur Startseite",
    badge: "Du bist jetzt PRO",
  },
  en: {
    title: "Payment successful!",
    subtitle:
      "Thank you, your IFindItForYou PRO subscription is now active. You now get unlimited searches and better results.",
    button: "Go to homepage",
    badge: "You’re now PRO",
  },
};

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // opzionale: potresti usare session_id per debug/log, ma per ora non serve
  const langParam = (searchParams.get("lang") as Lang) || "it";
  const lang: Lang =
    langParam === "fr" || langParam === "de" || langParam === "en"
      ? langParam
      : "it";

  const t = SUCCESS_TEXTS[lang];

  useEffect(() => {
    try {
      // segna lato client che l’utente è PRO
      localStorage.setItem("ifiy_isPro", "true");
      // mantieni anche la lingua
      localStorage.setItem("ifiy_lang", lang);
    } catch {
      // se localStorage non è disponibile, pazienza
    }
  }, [lang]);

  const handleGoHome = () => {
    router.push(`/?lang=${lang}`);
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 16,
          border: "1px solid #1f2937",
          backgroundColor: "#020617",
          padding: 24,
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            padding: "4px 10px",
            borderRadius: 999,
            backgroundColor: "#16a34a",
            color: "#022c22",
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          <span
            style={{
              padding: "2px 8px",
              borderRadius: 999,
              border: "1px solid rgba(0,0,0,0.2)",
              backgroundColor: "rgba(255,255,255,0.85)",
            }}
          >
            PRO
          </span>
          <span>{t.badge}</span>
        </div>

        <h1
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: 14,
            opacity: 0.85,
            marginBottom: 24,
          }}
        >
          {t.subtitle}
        </p>

        <button
          type="button"
          onClick={handleGoHome}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "10px 22px",
            fontSize: 15,
            fontWeight: 600,
            backgroundColor: "#22c55e",
            color: "#022c22",
            cursor: "pointer",
          }}
        >
          {t.button}
        </button>
      </div>
    </main>
  );
}



