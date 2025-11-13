"use client";

import { useEffect, useState } from "react";

type BillingPeriod = "monthly" | "yearly";

export default function ProPageClient() {
  const [isPro, setIsPro] = useState<boolean | null>(null);
  const [freeSearches, setFreeSearches] = useState<number | null>(null);
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Legge lo stato dal browser
  useEffect(() => {
    try {
      const isProRaw = localStorage.getItem("isPro");
      const freeRaw = localStorage.getItem("freeSearches");

      if (isProRaw !== null) {
        setIsPro(isProRaw === "true");
      } else {
        setIsPro(false);
      }

      if (freeRaw !== null) {
        const parsed = parseInt(freeRaw, 10);
        setFreeSearches(Number.isNaN(parsed) ? 0 : parsed);
      } else {
        setFreeSearches(0);
      }
    } catch (err) {
      console.error("Errore lettura localStorage", err);
      setIsPro(false);
      setFreeSearches(0);
    }
  }, []);

  const handleCheckout = async () => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingPeriod: billing }),
      });

      if (!res.ok) {
        throw new Error("Errore nella creazione della sessione di pagamento.");
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL di checkout non trovato.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(
        err.message || "Si è verificato un errore. Riprova più tardi."
      );
      setIsLoading(false);
    }
  };

  const isLoaded = isPro !== null && freeSearches !== null;

  return (
    <div className="space-y-8">
      {/* HERO */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1 text-xs font-medium text-blue-700">
          <span>✨ Nuovo</span>
          <span>IFindItForYou PRO</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
          Ricerche intelligenti, <span className="text-blue-600">illimitate</span>.
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dimentica pagine di risultati inutili. Con PRO hai ricerche illimitate,
          risultati più completi e priorità nelle risposte.
        </p>

        {isLoaded && (
          <p className="text-sm text-gray-500">
            {isPro
              ? "Hai già un abbonamento PRO attivo su questo dispositivo."
              : freeSearches && freeSearches > 0
              ? `Ti restano ancora ${freeSearches} ricerca${
                  freeSearches > 1 ? "e" : ""
                } gratuita${freeSearches > 1 ? "e" : ""}.`
              : "Hai esaurito le ricerche gratuite su questo dispositivo."}
          </p>
        )}
      </section>

      {/* TOGGLE MENSILE / ANNUALE */}
      <section className="flex justify-center">
        <div className="inline-flex items-center rounded-full bg-gray-100 p-1 text-xs">
          <button
            className={`px-3 py-1 rounded-full transition ${
              billing === "monthly"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
            onClick={() => setBilling("monthly")}
          >
            Mensile
          </button>
          <button
            className={`px-3 py-1 rounded-full transition ${
              billing === "yearly"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500"
            }`}
            onClick={() => setBilling("yearly")}
          >
            Annuale{" "}
            <span className="ml-1 text-green-600 font-semibold">-20%</span>
          </button>
        </div>
      </section>

      {/* CARTE FREE vs PRO */}
      <section className="grid gap-6 md:grid-cols-2">
        {/* FREE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col justify-between">
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Piano Free</h2>
            <p className="text-sm text-gray-500">
              Ideale per provare IFindItForYou e fare le prime ricerche.
            </p>
            <p className="text-3xl font-semibold text-gray-900">
              0 CHF{" "}
              <span className="text-sm font-normal text-gray-500">
                / per sempre
              </span>
            </p>

            <ul className="mt-4 space-y-2 text-sm text-gray-600">
              <li>• 1 ricerca gratuita iniziale</li>
              <li>• +1 ricerca extra con email</li>
              <li>• Risultati di base</li>
              <li>• Nessuna priorità di risposta</li>
            </ul>
          </div>

          <button
            className="mt-6 w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            Torna alle ricerche
          </button>
        </div>

        {/* PRO */}
        <div className="relative rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50 to-white p-6 flex flex-col justify-between">
          <div className="absolute right-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow">
            Più scelto
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-900">Piano PRO</h2>
            <p className="text-sm text-gray-500">
              Per chi vuole risparmiare tempo e trovare subito quello che cerca.
            </p>

            {billing === "monthly" ? (
              <p className="text-3xl font-semibold text-gray-900">
                7.90 CHF{" "}
                <span className="text-sm font-normal text-gray-500">
                  / mese
                </span>
              </p>
            ) : (
              <p className="text-3xl font-semibold text-gray-900">
                75 CHF{" "}
                <span className="text-sm font-normal text-gray-500">
                  / anno
                </span>
              </p>
            )}

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              <li>• Ricerche illimitate</li>
              <li>• Priorità nelle richieste API</li>
              <li>• Risultati più completi e approfonditi</li>
              <li>• Nessun limite giornaliero</li>
              <li>• Accesso immediato dopo il pagamento</li>
            </ul>
          </div>

          <div className="mt-6 space-y-2">
            <button
              className={`w-full rounded-xl px-4 py-2 text-sm font-medium text-white transition ${
                isPro
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={isPro ? undefined : handleCheckout}
              disabled={isPro || isLoading}
            >
              {isPro
                ? "Sei già PRO"
                : isLoading
                ? "Reindirizzamento al pagamento..."
                : "Passa a PRO"}
            </button>

            {errorMsg && (
              <p className="text-xs text-red-600 text-center">{errorMsg}</p>
            )}

            <p className="text-[11px] text-gray-500 text-center">
              Pagamenti sicuri gestiti da Stripe. Puoi annullare in qualsiasi
              momento.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ / BENEFICI */}
      <section className="mt-8 grid gap-6 md:grid-cols-3 text-sm text-gray-700">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Perché passare a PRO?
          </h3>
          <p>
            Perché smetti di perdere tempo tra mille risultati inutili. PRO è
            pensato per chi vuole una risposta chiara, subito, senza dover
            cercare per ore.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Come funziona il pagamento?
          </h3>
          <p>
            Clicchi su “Passa a PRO”, vieni reindirizzato su Stripe, completi il
            pagamento e torni sul sito con l’accesso PRO attivo.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Posso usare PRO da più dispositivi?
          </h3>
          <p>
            Il piano PRO è legato al tuo account/email. Puoi usarlo da più
            dispositivi accedendo con le stesse credenziali (da agganciare alla
            tua logica di login quando sarà pronta).
          </p>
        </div>
      </section>
    </div>
  );
}

