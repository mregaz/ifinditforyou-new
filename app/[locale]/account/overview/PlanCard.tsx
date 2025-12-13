// app/[locale]/account/overview/PlanCard.tsx
"use client";

import { getDashboardCopy } from "@/lib/i18n/dashboard";

type Props = {
  locale: string;
  isPro: boolean;
};

export function PlanCard({ locale, isPro }: Props) {
  const t = getDashboardCopy(locale);

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

          <button
  type="button"
  onClick={async () => {
    const res = await fetch("/api/create-customer-portal", {
      method: "POST",
    });
    const data = await res.json();
    if (data?.url) window.location.href = data.url;
  }}
  className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200 hover:bg-slate-800"
>
  {locale === "it" ? "Gestisci abbonamento" : "Manage subscription"}
</button>

        </>
      ) : (
        <>
          <p className="text-sm text-slate-200">
            {locale === "it"
              ? "Il tuo piano attuale è PRO."
              : "Your current plan is PRO."}
          </p>

          <a
            href={`/${locale}/account/billing`}
            className="mt-4 inline-block text-sm text-emerald-400 underline underline-offset-4 hover:text-emerald-300"
          >
            {locale === "it"
              ? "Gestisci abbonamento"
              : "Manage subscription"}
          </a>
        </>
      )}
    </div>
  );
}
