"use client";

import { useState } from "react";
import Link from "next/link";
import { Lang } from "@/lib/lang";

type BillingPeriod = "monthly" | "yearly";

type ProTexts = {
  languageLabel: string;
  heroTitle: string;
  heroSubtitle: string;
  toggleMonthly: string;
  toggleYearly: string;
  priceMonthly: string;
  priceYearly: string;
  bullet1: string;
  bullet2: string;
  bullet3: string;
  primaryCta: string;
  secondaryCta: string;
};

const PRO_TEXTS: Record<Lang, ProTexts> = {
  it: {
    languageLabel: "Lingua:",
    heroTitle: "Piano PRO – ricerche illimitate, priorità e supporto dedicato",
    heroSubtitle:
      "Per chi fa molte richieste ogni mese e vuole risposte più rapide e approfondite.",
    toggleMonthly: "Mensile",
    toggleYearly: "Annuale (Risparmi oltre il 25%)",
    priceMonthly: "9,99 $ / mese",
    priceYearly: "89 $ / anno",
    bullet1: "Ricerche illimitate ogni mese",
    bullet2: "Risposte prioritarie rispetto al piano Free",
    bullet3: "Supporto dedicato via email",
    primaryCta: "Attiva il piano PRO",
    secondaryCta: "Continua con il piano Free",
  },
  en: {
    languageLabel: "Language:",
    heroTitle: "PRO plan – unlimited searches, priority and dedicated support",
    heroSubtitle:
      "For frequent users who need faster and more in-depth answers every month.",
    toggleMonthly: "Monthly",
    toggleYearly: "Yearly (Save over 25%)",
    priceMonthly: "$9.99 / month",
    priceYearly: "$89 / year",
    bullet1: "Unlimited searches every month",
    bullet2: "Priority responses over Free users",
    bullet3: "Dedicated email support",
    primaryCta: "Upgrade to PRO",
    secondaryCta: "Stay on Free plan",
  },
  fr: {
    languageLabel: "Langue :",
    heroTitle:
      "Offre PRO – recherches illimitées, priorité et support dédié",
    heroSubtitle:
      "Pour ceux qui font beaucoup de demandes chaque mois et veulent des réponses plus rapides.",
    toggleMonthly: "Mensuel",
    toggleYearly: "Annuel (Économisez plus de 25 %)",
    priceMonthly: "9,99 $ / mois",
    priceYearly: "89 $ / an",
    bullet1: "Recherches illimitées chaque mois",
    bullet2: "Réponses prioritaires par rapport au plan gratuit",
    bullet3: "Support dédié par e-mail",
    primaryCta: "Passer au plan PRO",
    secondaryCta: "Rester sur le plan gratuit",
  },
  de: {
    languageLabel: "Sprache:",
    heroTitle:
      "PRO-Tarif – unbegrenzte Suchen, Priorität und persönlicher Support",
    heroSubtitle:
      "Für Nutzer mit vielen Anfragen pro Monat, die schnellere und tiefere Antworten möchten.",
    toggleMonthly: "Monatlich",
    toggleYearly: "Jährlich (Über 25 % Ersparnis)",
    priceMonthly: "9,99 $ / Monat",
    priceYearly: "89 $ / Jahr",
    bullet1: "Unbegrenzte Suchen pro Monat",
    bullet2: "Priorisierte Antworten gegenüber Free-Nutzern",
    bullet3: "Persönlicher E-Mail-Support",
    primaryCta: "PRO-Tarif aktivieren",
    secondaryCta: "Beim Free-Tarif bleiben",
  },
  es: {
    languageLabel: "Idioma:",
    heroTitle: "Plan PRO – búsquedas ilimitadas, prioridad y soporte dedicado",
    heroSubtitle:
      "Para quienes hacen muchas solicitudes al mes y quieren respuestas más rápidas y detalladas.",
    toggleMonthly: "Mensual",
    toggleYearly: "Anual (Ahorra más del 25 %)",
    priceMonthly: "9,99 $ / mes",
    priceYearly: "89 $ / año",
    bullet1: "Búsquedas ilimitadas cada mes",
    bullet2: "Respuestas prioritarias frente al plan gratuito",
    bullet3: "Soporte dedicado por correo electrónico",
    primaryCta: "Activar plan PRO",
    secondaryCta: "Seguir con el plan gratuito",
  },
};

type ProPageClientProps = {
  lang: Lang; // dalla route
};

export default function ProPageClient({ lang }: ProPageClientProps) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = PRO_TEXTS[lang];
  const price = billing === "monthly" ? t.priceMonthly : t.priceYearly;

  // Link alla home della lingua corrente
  const freeHref = lang === "it" ? "/" : `/${lang}`;

  const handleLangChange = (next: Lang) => {
    const href = next === "it" ? "/pro" : `/${next}/pro`;
    window.location.href = href;
  };

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billingPeriod: billing,
          lang, // passiamo la lingua a Stripe
        }),
      });

      if (!res.ok) {
        throw new Error("Errore nella creazione della sessione di pagamento.");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL di checkout non ricevuto.");
      }
    } catch (err: any) {
      console.error("Stripe checkout error", err);
      setError(err.message ?? "Errore imprevisto, riprova più tardi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-10">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Selettore lingua */}
        <div className="flex items-center gap-3 text-sm">
          <span className="font-medium">{t.languageLabel}</span>
          <select
            value={lang}
            onChange={(e) => handleLangChange(e.target.value as Lang)}
            className="border rounded-md px-2 py-1 text-sm"
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="es">Español</option>
          </select>
        </div>

        {/* Hero */}
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">{t.heroTitle}</h1>
          <p className="text-sm leading-relaxed text-slate-700">
            {t.heroSubtitle}
          </p>
        </section>

        {/* Toggle mensile / annuale */}
        <section className="border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-4 text-sm">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={
                "px-3 py-1 rounded-full border text-xs " +
                (billing === "monthly"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900")
              }
            >
              {t.toggleMonthly}
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={
                "px-3 py-1 rounded-full border text-xs " +
                (billing === "yearly"
                  ? "bg-slate-900 text-white"
                  : "bg-white text-slate-900")
              }
            >
              {t.toggleYearly}
            </button>
          </div>

          {/* Prezzo */}
          <div className="text-2xl font-semibold mt-2">{price}</div>

          {/* Bullet points */}
          <ul className="list-disc pl-5 text-sm space-y-1 text-slate-700 mt-3">
            <li>{t.bullet1}</li>
            <li>{t.bullet2}</li>
            <li>{t.bullet3}</li>
          </ul>

          {/* CTA PRO + Free */}
          <div className="flex flex-wrap gap-3 pt-3">
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold disabled:opacity-70"
            >
              {isLoading ? "Reindirizzamento..." : t.primaryCta}
            </button>

            <Link
              href={freeHref}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full border text-sm font-medium text-slate-900"
            >
              {t.secondaryCta}
            </Link>
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-700">{error}</p>
          )}
        </section>
      </div>
    </main>
  );
}
