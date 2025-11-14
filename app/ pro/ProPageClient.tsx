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
          La versione PRO per chi usa davvero la ricerca: illimitata, veloce e con più controllo sui risultati.
        </p>
      </header>

      {/


