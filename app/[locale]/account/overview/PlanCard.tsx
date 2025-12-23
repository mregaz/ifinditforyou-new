"use client";

import { ACCOUNT_COPY, toLocale, type Locale } from "@/lib/ui-copy";

type Props = {
  locale: string; // arriva dalla page server
  isPro: boolean;
};

const PLAN_TEXT: Record<Locale, string> = {
  it: "Sblocca ricerche illimitate, storico completo e priorità.",
  en: "Unlock unlimited searches, full history and priority.",
  fr: "Débloquez des recherches illimitées, l’historique complet et la priorité.",
  de: "Schalte unbegrenzte Suchen, vollständigen Verlauf und Priorität frei.",
  es: "Desbloquea búsquedas ilimitadas, historial completo y prioridad.",
};

const UPGRADE_LABEL: Record<Locale, string> = {
  it: "Passa a PRO",
  en: "Upgrade to PRO",
  fr: "Passer à PRO",
  de: "Auf PRO upgraden",
  es: "Pasar a PRO",
};

export default function PlanCard({ locale: rawLocale, isPro }: Props) {
  const locale = toLocale(rawLocale);
  const t = ACCOUNT_COPY[locale];

  const handleUpgrade = async () => {
  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      billingPeriod: "monthly", // cambia in "yearly" dove serve
      lang: locale,
    }),
  });

  if (!res.ok) {
    console.error("Errore checkout", await res.text());
    return;
  }

  const data = await res.json();
  if (data?.url) {
    window.location.href = data.url;
  }
};


  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      {!isPro ? (
        <>
          <p className="text-sm text-slate-200">{PLAN_TEXT[locale]}</p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="text-sm text-slate-200">
              <span className="mr-2 font-semibold">{t.planLabel}:</span>
              <span className="rounded bg-slate-800 px-2 py-1 text-xs">
                {t.freeLabel}
              </span>
            </div>

            <button
              onClick={handleUpgrade}
              className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              type="button"
            >
              {UPGRADE_LABEL[locale]}
            </button>
          </div>
        </>
      ) : (
        <div className="text-sm text-slate-200">
          <span className="mr-2 font-semibold">{t.planLabel}:</span>
          <span className="rounded bg-emerald-700 px-2 py-1 text-xs text-white">
            {t.proLabel}
          </span>
        </div>
      )}
    </div>
  );
}
