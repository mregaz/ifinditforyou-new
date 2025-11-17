"use client";

import { useState, useEffect } from "react";
import { Lang, normalizeLang } from "@/lib/lang"; // 👈 AGGIUNTO


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

const COMPARISON_ROWS = [
  {
    label: "Numero di ricerche",
    free: "2 ricerche (1 + 1 con email)",
    pro: "Illimitate",
  },
  {
    label: "Filtri sui risultati",
    free: "Base",
    pro: "Avanzati",
  },
  {
    label: "Priorità nella coda",
    free: "Normale",
    pro: "Alta",
  },
  {
    label: "Supporto",
    free: "—",
    pro: "Email prioritaria",
  },
];

const FAQ_ITEMS = [
  {
    question: "Posso annullare quando voglio?",
    answer:
      "Sì. L'abbonamento è senza vincoli: puoi annullare il rinnovo in qualsiasi momento dal tuo account Stripe.",
  },
  {
    question: "Il pagamento è sicuro?",
    answer:
      "Sì. I pagamenti sono gestiti da Stripe, uno dei principali provider di pagamenti online. IFindItForYou non memorizza i dati della tua carta.",
  },
  {
    question: "Cosa succede se annullo il PRO?",
    answer:
      "Potrai usare il piano PRO fino alla fine del periodo già pagato. Poi il tuo account tornerà automaticamente al piano Free.",
  },
  {
    question: "Serve partita IVA o fattura?",
    answer:
      "Puoi usare una carta personale o aziendale. Per requisiti fiscali specifici ti consigliamo di parlare con il tuo consulente.",
  },
];

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
    <main className="mx-auto max-w-5xl px-4 py-12">
      {/* HERO */}
      <header className="mb-10 text-center">
        <h1 className="mb-3 text-3xl font-semibold">
          IFindItForYou <span className="text-green-600">PRO</span>
        </h1>
        <p className="text-sm text-gray-700">
          La versione PRO per chi usa davvero la ricerca: illimitata, veloce e
          con più controllo sui risultati.
        </p>
      </header>

      {/* Toggle mensile / annuale */}
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

      {/* Tabella confronto Free vs PRO */}
      <section className="mb-10 rounded-lg border border-gray-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold">Confronto veloce</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-700">
            <thead>
              <tr className="border-b text-[11px] uppercase tracking-wide text-gray-500">
                <th className="py-2 pr-2">Funzionalità</th>
                <th className="py-2 px-2">Free</th>
                <th className="py-2 pl-2 text-green-700">PRO</th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b last:border-0">
                  <td className="py-2 pr-2">{row.label}</td>
                  <td className="py-2 px-2">{row.free}</td>
                  <td className="py-2 pl-2 font-medium text-green-700">
                    {row.pro}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold">
          Domande frequenti sul PRO
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {FAQ_ITEMS.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </section>

      {/* Legal: Termini & Privacy */}
      <section className="border-t border-gray-200 pt-6 text-xs text-gray-500">
        <h2 className="mb-2 text-xs font-semibold">
          Termini, condizioni e protezione dati
        </h2>
        <p className="mb-3">
          Prima di abbonarti, ti consigliamo di leggere con attenzione i termini
          del servizio e le informazioni sulla protezione dei dati.
        </p>
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <LegalCard
            title="Termini e condizioni"
            description="Descrivono come funziona il servizio, cosa è incluso e quali sono i limiti di responsabilità."
            href="/termini"
          />
          <LegalCard
            title="Protezione dati"
            description="Spiega come vengono trattati i tuoi dati personali, in linea con la normativa (es. GDPR)."
            href="/privacy"
          />
        </div>
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
        <span className="mr-1">Annuale</span>
        <span className="text-[10px] opacity-80">risparmi</span>
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

type FaqItemProps = {
  question: string;
  answer: string;
};

function FaqItem({ question, answer }: FaqItemProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 text-xs">
      <h3 className="mb-1 text-[13px] font-semibold">{question}</h3>
      <p className="text-gray-700">{answer}</p>
    </div>
  );
}

type LegalCardProps = {
  title: string;
  description: string;
  href: string;
};

function LegalCard({ title, description, href }: LegalCardProps) {
  return (
    <a
      href={href}
      className="flex-1 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-green-500 hover:shadow-sm"
    >
      <h3 className="mb-1 text-[13px] font-semibold text-gray-800">
        {title}
      </h3>
      <p className="text-[11px] text-gray-600">{description}</p>
    </a>
  );
}

