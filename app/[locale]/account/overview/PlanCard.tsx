"use client";

import { getDashboardCopy } from "@/lib/i18n/dashboard";
import { ACCOUNT_COPY, toLocale, type Locale } from "@/lib/ui-copy";

type Props = {
  locale: string; // arriva dalla page server
  isPro: boolean;
};

export default function PlanCard({ locale: rawLocale, isPro }: Props) {
  const locale = toLocale(rawLocale);
  const t = ACCOUNT_COPY[locale];

  // Se vuoi usare ancora getDashboardCopy per altri testi “lunghi”, tienilo:
  // (lo lascio perché nel tuo codice sotto lo usi già)
  const d = getDashboardCopy(locale);

  const handleUpgrade = async () => {
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      {!isPro ? (
        <>
          <p className="text-sm text-slate-200">
            {locale === "it"
              ? "Sblocca ricerche illimitate, storico completo e priorità."
              : "Unlock unlimited searches, full history and priority."}
          </p>

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
              {locale === "it" ? "Passa a PRO" : "Upgrade to PRO"}
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
