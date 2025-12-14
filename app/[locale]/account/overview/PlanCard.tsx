"use client";

import { useState } from "react";
import { getDashboardCopy } from "@/lib/i18n/dashboard";

type Props = {
  locale: string;
  isPro: boolean;
};

export function PlanCard({ locale, isPro }: Props) {
  const t = getDashboardCopy(locale);
  const [loading, setLoading] = useState(false);

  const goCheckout = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  const goPortal = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/create-customer-portal", { method: "POST" });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
    } finally {
      setLoading(false);
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
            onClick={goCheckout}
            disabled={loading}
            className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? (locale === "it" ? "Caricamento..." : "Loading...") : (locale === "it" ? "Passa a PRO" : "Upgrade to PRO")}
          </button>
        </>
      ) : (
        <>
          <p className="text-sm text-slate-200">
            {locale === "it" ? "Il tuo piano attuale è PRO." : "Your current plan is PRO."}
          </p>

          <button
            type="button"
            onClick={goPortal}
            disabled={loading}
            className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-700 px-5 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
          >
            {loading ? (locale === "it" ? "Apro il portale..." : "Opening portal...") : (locale === "it" ? "Gestisci abbonamento" : "Manage subscription")}
          </button>
        </>
      )}
    </div>
  );
}

