"use client";

import { useState, useEffect } from "react";

type BillingPeriod = "monthly" | "yearly";

export default function ProPageClient() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState<BillingPeriod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Se hai già un flag "isPro" nel localStorage lo leggiamo
  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = window.localStorage.getItem("isPro");
      setIsPro(value === "true");
    }
  }, []);

  const handleCheckout = async (period: BillingPeriod) => {
    try {
      setIsLoading(period);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingPeriod: period }),
      });

      if (!res.ok) {
        throw new Error("Errore nella creazione della sessione di pagamento.");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("URL di checkout non ricevuto da Stripe.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Qualcosa è andato storto. Riprova fra qualche secondo."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const isMonthly = billingPeriod === "monthly";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Passa a <span className="text-emerald-400">IFindItForYou PRO</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto">
            Lascia che l’AI faccia le ricerche complicate al posto tuo.  
            Tu scrivi cosa ti serve, noi troviamo il meglio del web.
          </p>
        </header>

        {/* Toggle mensile / annuale */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center rounded-full bg-slate-900 p-1 border border-slate-700">
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              className={`px-4 py-1 text-sm rounded-full transition ${
                isMonthly
                  ? "bg-emerald-500 text-slate-900 font-semibold"
                  : "text-slate-300"
              }`}
            >
              Mensile
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              className={`px-4 py-1 text-sm rounded-full transition ${
                !isMonthly
                  ? "bg-emerald-500 text-slate-900 font-semibold"
                  : "text-slate-300"
              }`}
            >
              Annuale <span className="ml-1 text-xs text-emerald-200">- risparmia</span>
            </button>
          </div>
        </div>

        {/* Cards Free / PRO */}
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          {/* FREE */}
          <section className="border border-slate-800 bg-slate-900/60 rounded-2xl p-6 flex flex-col">
            <h2 className="text-lg font-semibold mb-1">Piano Free</h2>
            <p className="text-sm text-slate-300 mb-4">
              Per provare il servizio senza impegno.
            </p>
            <p className="text-3xl font-bold mb-1">
              $0{" "}
              <span className="text-sm font-normal text-slate-400">
                / per sempre
              </span>
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• 1 ricerca gratuita senza email</li>
              <li>• +1 ricerca gratuita con email</li>
              <li>• Risultati base generati dall&apos;AI</li>
              <li>• Nessun obbligo di carta di credito</li>
            </ul>
            <div className="mt-auto pt-6">
              <button
                type="button"
                disabled
                className="w-full rounded-xl border border-slate-700 bg-slate-800 py-2 text-sm text-slate-400 cursor-not-allowed"
              >
                Piano attuale
              </button>
            </div>
          </section>

          {/* PRO */}
          <section className="border border-emerald-400/60 bg-slate-900 rounded-2xl p-6 shadow-xl shadow-emerald-500/20 flex flex-col relative overflow-hidden">
            <span className="absolute right-4 top-4 text-xs px-2 py-1 rounded-full bg-emerald-500 text-slate-900 font-semibold">
              Consigliato
            </span>

            <h2 className="text-lg font-semibold mb-1">IFindItForYou PRO</h2>
            <p className="text-sm text-slate-300 mb-4">
              Per chi vuole risposte migliori, più veloci e pronte da usare.
            </p>

            {isMonthly ? (
              <p className="text-3xl font-bold mb-1">
                $9.99{" "}
                <span className="text-sm font-normal text-slate-400">
                  / mese
                </span>
              </p>
            ) : (
              <p className="text-3xl font-bold mb-1">
                $89{" "}
                <span className="text-sm font-normal text-slate-400">
                  / anno
                </span>
              </p>
            )}

            <p className="text-xs text-emerald-300 mb-4">
              Pagamento sicuro con Stripe. Disdici quando vuoi.
            </p>

            <ul className="mt-2 space-y-2 text-sm text-slate-100">
              <li>• Ricerche avanzate illimitate</li>
              <li>• Risultati filtrati, ordinati e riassunti per te</li>
              <li>• Priorità nelle code di elaborazione</li>
              <li>• Accesso prima alle nuove funzioni</li>
              <li>• Supporto via email dedicato</li>
            </ul>

            <div className="mt-auto pt-6 space-y-2">
              <button
                type="button"
                onClick={() => handleCheckout(billingPeriod)}
                disabled={isPro || isLoading !== null}
                className={`w-full rounded-xl py-2 text-sm font-semibold transition ${
                  isPro
                    ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                    : isLoading
                    ? "bg-emerald-400/70 text-slate-900 cursor-wait"
                    : "bg-emerald-500 hover:bg-emerald-400 text-slate-900"
                }`}
              >
                {isPro
                  ? "Sei già PRO"
                  : isLoading === "monthly"
                  ? "Reindirizzamento a Stripe (mensile)..."
                  : isLoading === "yearly"
                  ? "Reindirizzamento a Stripe (annuale)..."
                  : "Passa a PRO"}
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Nessun vincolo lungo termine. Puoi annullare il rinnovo in
                qualsiasi momento dal tuo account Stripe.
              </p>
            </div>

            {error && (
              <p className="mt-3 text-xs text-red-400 text-center">
                {error}
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

