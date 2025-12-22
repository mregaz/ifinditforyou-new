"use client";
const PRO_COPY = {
  it: {
    title: "Pro",
    subtitle: "Attiva Pro per sbloccare funzionalità avanzate e gestire il tuo abbonamento.",
    choose: "Scegli un piano",
    redirectHint: "Verrai reindirizzato al checkout Stripe.",
  },
  en: {
    title: "Pro",
    subtitle: "Activate Pro to unlock advanced features and manage your subscription.",
    choose: "Choose a plan",
    redirectHint: "You will be redirected to Stripe Checkout.",
  },
  fr: {
    title: "Pro",
    subtitle: "Activez Pro pour débloquer des fonctionnalités avancées et gérer votre abonnement.",
    choose: "Choisir une offre",
    redirectHint: "Vous serez redirigé vers Stripe Checkout.",
  },
  de: {
    title: "Pro",
    subtitle: "Aktiviere Pro, um erweiterte Funktionen freizuschalten und dein Abo zu verwalten.",
    choose: "Plan wählen",
    redirectHint: "Du wirst zu Stripe Checkout weitergeleitet.",
  },
  es: {
    title: "Pro",
    subtitle: "Activa Pro para desbloquear funciones avanzadas y gestionar tu suscripción.",
    choose: "Elige un plan",
    redirectHint: "Serás redirigido a Stripe Checkout.",
  },
} as const;

const labels: Record<string, { monthly: string; yearly: string }> = {
  it: { monthly: "Attiva Mensile", yearly: "Attiva Annuale" },
  en: { monthly: "Start Monthly", yearly: "Start Yearly" },
  fr: { monthly: "Mensuel", yearly: "Annuel" },
  de: { monthly: "Monatlich", yearly: "Jährlich" },
  es: { monthly: "Mensual", yearly: "Anual" },
};

export function ProCheckoutButtons({ locale }: { locale: string }) {
  const t = labels[locale] ?? labels.it;

  async function startCheckout(billingPeriod: "monthly" | "yearly") {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ billingPeriod, lang: locale }),
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-3">
      <button onClick={() => startCheckout("monthly")} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
        {t.monthly}
      </button>
      <button onClick={() => startCheckout("yearly")} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50">
        {t.yearly}
      </button>
    </div>
  );
}
