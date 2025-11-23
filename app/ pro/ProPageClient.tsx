"use client";

import { useState, useEffect } from "react";
import type { ReactNode } from "react";

import { Lang, normalizeLang } from "@/lib/lang";

type BillingPeriod = "monthly" | "yearly";

const FEATURES_FREE: string[] = [
  "1 ricerca senza email",
  "+1 ricerca aggiuntiva lasciando l'email",
  "Risultati base",
];

const FEATURES_PRO: string[] = [
  "Ricerche illimitate",
  "Filtri avanzati sui risultati",
  "Priorità nella coda delle richieste",
  "Supporto via email",
];

const PRICE_LABELS: Record<BillingPeriod, string> = {
  monthly: "9.99 / mese",
  yearly: "89 / anno",
};

const SUBTITLE_LABELS: Record<BillingPeriod, string> = {
  monthly: "Per chi vuole risposte migliori, più veloci e subito utilizzabili.",
  yearly: "2 mesi scontati rispetto al piano mensile.",
};

type ProPageClientProps = {
  initialLang?: Lang;
};

export default function ProPageClient({ initialLang }: ProPageClientProps) {
  const [lang, setLang] = useState<Lang>(initialLang ?? "it");
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Legge lingua da querystring e stato PRO da localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get("lang");
    const normalized = normalizeLang(urlLang);

    if (normalized) {
      setLang(normalized);
    }

    const storedIsPro = window.localStorage.getItem("isPro");
    setIsPro(storedIsPro === "true");
  }, []);

  // ---------------------------------------------------------------------------
  // FUNZIONE CHE LANCIA IL CHECKOUT STRIPE
  // ---------------------------------------------------------------------------
  async function handleSubscribe() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });

      // Teniamo il parsing del JSON "soft" per non esplodere se qualcosa va storto
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Errore API /api/create-checkout-session:", data);
        setError(
          (data && typeof data.error === "string" && data.error) ||
            "Errore nella creazione della sessione di pagamento."
        );
        return;
      }

      if (!data || !data.url) {
        console.error("Risposta API senza url di checkout:", data);
        setError("URL di checkout non ricevuto da Stripe.");
        return;
      }

      // Redirect a Stripe
      window.location.href = data.url;
    } catch (err) {
      console.error("Errore generico in handleSubscribe:", err);
      setError(
        "Si è verificato un errore imprevisto. Riprova fra qualche secondo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* HERO */}
      <header className="mb-10 text-center">
        {/* Switch lingua */}
        <div className="mb-4 flex justify-end text-xs text-gray-400">
          <span className="mr-2">Lingua:</span>
          <LangSwitch current={lang} />
        </div>

        <h1 className="mb-3 text-3xl font-bold text-white">
          Passa a{" "}
          <span className="text-emerald-400">IFindItForYou PRO</span>
        </h1>
        <p className="mx-auto max-w-xl text-sm text-gray-300">
          Tu descrivi quello che cerchi, noi troviamo per te il meglio del web e
          te lo serviamo già filtrato e riassunto.
        </p>
      </header>

      {/* Toggle billing period */}
      <section className="mb-8 flex justify-center">
        <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />
      </section>

      {/* Cards Free vs PRO */}
      <section className="mb-10 grid gap-6 md:grid-cols-2">
        <PricingCard
          title="Piano Free"
          price="0 €"
          subtitle="Per sempre."
          features={FEATURES_FREE}
          highlight={false}
          footerContent={
            <p className="text-xs text-gray-500">
              Ideale per provare IFindItForYou con qualche ricerca di base.
            </p>
          }
        />

        <PricingCard
          title="IFindItForYou PRO"
          price={PRICE_LABELS[billingPeriod]}
          subtitle={SUBTITLE_LABELS[billingPeriod]}
          features={FEATURES_PRO}
          highlight
          footerContent={
            <div className="flex flex-col gap-2">
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="button"
                onClick={handleSubscribe}
                disabled={isPro || loading}
                className={`w-full rounded-full px-4 py-2 text-sm font-semibold text-slate-900 ${
                  isPro || loading
                    ? "cursor-not-allowed bg-slate-400"
                    : "bg-emerald-400 hover:bg-emerald-300"
                }`}
              >
                {isPro
                  ? "Sei già PRO"
                  : loading
                  ? "Reindirizzamento a Stripe..."
                  : "Passa a PRO"}
              </button>
              <p className="text-center text-[11px] text-gray-400">
                Nessun vincolo lungo termine. Puoi annullare il rinnovo in
                qualsiasi momento dal tuo account Stripe.
              </p>
            </div>
          }
        />
      </section>

      {/* Confronto Free vs PRO */}
      <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-gray-200">
        <h2 className="mb-3 text-center text-sm font-semibold text-emerald-400">
          Confronto veloce: Free vs PRO
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr>
                <th className="border-b border-slate-800 px-2 py-1 text-left text-gray-400">
                  Funzionalità
                </th>
                <th className="border-b border-slate-800 px-2 py-1 text-center text-gray-400">
                  Free
                </th>
                <th className="border-b border-slate-800 px-2 py-1 text-center text-emerald-300">
                  PRO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border-b border-slate-900 px-2 py-1">
                  Numero di ricerche
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center">
                  2 (1 + 1 con email)
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center font-semibold text-emerald-300">
                  Illimitate
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-900 px-2 py-1">
                  Qualità risultati
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center">
                  Base
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center font-semibold text-emerald-300">
                  Avanzata, filtrata e riassunta
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-900 px-2 py-1">
                  Priorità nelle richieste
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center">
                  Normale
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center font-semibold text-emerald-300">
                  Alta
                </td>
              </tr>
              <tr>
                <td className="border-b border-slate-900 px-2 py-1">
                  Nuove funzioni
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center">
                  Accesso standard
                </td>
                <td className="border-b border-slate-900 px-2 py-1 text-center font-semibold text-emerald-300">
                  Accesso anticipato
                </td>
              </tr>
              <tr>
                <td className="px-2 py-1">Supporto</td>
                <td className="px-2 py-1 text-center">—</td>
                <td className="px-2 py-1 text-center font-semibold text-emerald-300">
                  Email dedicata
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Legal / Termini */}
      <section className="mt-6 text-center text-[11px] text-gray-400">
        <p>
          Prima di abbonarti, puoi leggere i{" "}
          <a href="/termini" className="text-emerald-300 underline">
            Termini e condizioni
          </a>{" "}
          e l&apos;informativa su{" "}
          <a href="/privacy" className="text-emerald-300 underline">
            Protezione dati / Privacy
          </a>
          .
        </p>
      </section>
    </main>
  );
}

type LangSwitchProps = {
  current: Lang;
};

function LangSwitch({ current }: LangSwitchProps) {
  const langs: Lang[] = ["it", "fr", "de", "en"];

  return (
    <div className="flex gap-2">
      {langs.map((l) => (
        <a
          key={l}
          href={`/pro?lang=${l}`}
          className={`underline ${
            current === l ? "font-semibold text-emerald-300" : "text-emerald-500"
          }`}
        >
          {l.toUpperCase()}
        </a>
      ))}
    </div>
  );
}

type PricingCardProps = {
  title: string;
  price: string;
  subtitle: string;
  features: string[];
  highlight?: boolean;
  footerContent?: ReactNode;
};

function PricingCard({
  title,
  price,
  subtitle,
  features,
  highlight,
  footerContent,
}: PricingCardProps) {
  return (
    <article
      className={`flex h-full flex-col justify-between rounded-2xl border p-4 ${
        highlight
          ? "border-emerald-500/80 bg-slate-950/40 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
          : "border-slate-800 bg-slate-950/60"
      }`}
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {highlight && (
            <span className="rounded-full bg-emerald-400 px-2 py-0.5 text-[10px] font-semibold text-slate-900">
              Consigliato
            </span>
          )}
        </div>
        <p className="mb-4 text-xs text-gray-300">{subtitle}</p>
        <p className="mb-2 text-2xl font-bold text-white">{price}</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-gray-200">
          {features.map((f, idx) => (
            <li key={idx}>{f}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">{footerContent}</div>
    </article>
  );
}

type BillingToggleProps = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
};

function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-gray-300 bg-white p-1 text-xs">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={
          "rounded-full px-3 py-1 " +
          (value === "monthly"
            ? "bg-emerald-500 text-slate-900"
            : "text-slate-800")
        }
      >
        Mensile
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={
          "rounded-full px-3 py-1 " +
          (value === "yearly"
            ? "bg-emerald-500 text-slate-900"
            : "text-slate-800")
        }
      >
        Annuale (risparmi)
      </button>
    </div>
  );
}
