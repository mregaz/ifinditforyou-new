"use client";

import { useState, type ReactNode } from "react";

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
  yearly: "89.00 / anno",
};

const SUBTITLE_LABELS: Record<BillingPeriod, string> = {
  monthly: "Fatturazione mensile, puoi annullare quando vuoi.",
  yearly: "Fatturazione annuale, risparmi rispetto al mensile.",
};

export default function ProPageClient() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError("Errore nella creazione della sessione di pagamento.");
        return;
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError("Si è verificato un errore imprevisto. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-semibold">
          IFindItForYou <span className="text-green-600">PRO</span>
        </h1>
        <p className="text-sm text-gray-700">
          Passa alla versione PRO per ricerche illimitate e funzionalità avanzate.
        </p>
      </header>

      {/* Toggle mensile / annuale */}
      <section className="mb-8 flex justify-center">
        <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />
      </section>

      {/* Cards Free vs PRO */}
      <section className="grid gap-6 md:grid-cols-2">
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
                disabled={loading}
                className="w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Reindirizzamento in corso..." : "Passa a PRO"}
              </button>
              <p className="text-xs text-gray-500">
                Pagamenti gestiti in modo sicuro da Stripe. Puoi annullare il
                rinnovo in qualsiasi momento.
              </p>
            </div>
          }
        />
      </section>
    </main>
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
          "rounded-full px-4 py-1 " +
          (value === "monthly" ? "bg-green-600 text-white" : "text-gray-700")
        }
      >
        Mensile
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={
          "rounded-full px-4 py-1 " +
          (value === "yearly" ? "bg-green-600 text-white" : "text-gray-700")
        }
      >
        Annuale{" "}
        <span className="ml-1 text-[10px] opacity-80">risparmi</span>
      </button>
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
  highlight = false,
  footerContent,
}: PricingCardProps) {
  return (
    <article
      className={
        "flex h-full flex-col rounded-lg border bg-white p-5 text-sm " +
        (highlight ? "border-green-500 shadow-md" : "border-gray-200")
      }
    >
      <header className="mb-4">
        <h2 className="mb-1 text-lg font-semibold">{title}</h2>
        <p className="text-2xl font-bold">{price}</p>
        <p className="mt-1 text-xs text-gray-600">{subtitle}</p>
      </header>

      <ul className="mb-4 flex-1 list-disc space-y-1 pl-5 text-xs text-gray-700">
        {features.map((feature) => (
          <li key={feature}>{feature}</li>
        ))}
      </ul>

      {footerContent && <footer className="mt-2">{footerContent}</footer>}
    </article>
  );
}

