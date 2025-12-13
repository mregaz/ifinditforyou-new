"use client";

import { useState } from "react";
import { proTexts } from "./proTexts";

type ProPageClientProps = {
  locale: string;
  isLoggedIn: boolean;
  isPro: boolean;
};


export default function ProPageClient({ locale, isLoggedIn, isPro }: ProPageClientProps) {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t =
    proTexts[locale as keyof typeof proTexts] ?? proTexts["en" as keyof typeof proTexts];

    const loginUrl = `/${locale}/login`;
  const registerUrl = `/${locale}/register`;
  const accountUrl = `/${locale}/account`;

  const handleUpgrade = async () => {
    // Se non è loggato → prima registrazione/login
    if (!isLoggedIn) {
      window.location.href = registerUrl;
      return;
    }

    // Se è già PRO → vai alla dashboard
    if (isPro) {
      window.location.href = accountUrl;
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const bodyText = await res.text();

      if (!res.ok) {
        let msg =
          locale === "it"
            ? "Errore nella creazione del checkout."
            : "Error creating checkout session.";
        try {
          const parsed = JSON.parse(bodyText);
          if (parsed?.error && typeof parsed.error === "string") {
            msg = parsed.error;
          }
        } catch {}
        setError(msg);
        return;
      }

      const data = JSON.parse(bodyText) as { url?: string };
      if (!data.url) {
        setError(
          locale === "it" ? "URL di checkout mancante." : "Missing checkout URL."
        );
        return;
      }

      window.location.href = data.url;
    } catch (e: any) {
      setError(
        e?.message ??
          (locale === "it"
            ? "Errore imprevisto durante il pagamento."
            : "Unexpected error during checkout.")
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 md:px-8 md:py-16">
        {/* HERO */}
        <section className="grid gap-8 md:grid-cols-[2fr,1.3fr] md:items-center">
          <div>
            <span className="text-3xl font-semibold">€9</span>

            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
  {t.heroTitle}
</h1>

<p className="mt-4 text-sm text-slate-300 md:text-base">
  {t.heroSubtitle}
</p>


            <ul className="mt-4 space-y-1 text-sm text-slate-300">
              {t.heroBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={handleUpgrade}
              disabled={loading}
              className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? locale === "it"
                  ? "Reindirizzamento..."
                  : "Redirecting..."
                : t.cta}
            </button>

            {error && (
              <p className="mt-3 text-xs text-red-400">
                {error}
              </p>
            )}

            <p className="mt-3 text-[11px] text-slate-500">
              {locale === "it"
                ? "Piano Free: 3 ricerche gratuite al mese. Registrandoti puoi sbloccarne 2 extra (totale 5) prima di passare a PRO."
                : "Free plan: 3 free searches per month. Create an account to unlock 2 extra searches (total 5) before moving to PRO."}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 shadow-lg shadow-slate-950/40">
            <h2 className="text-sm font-semibold text-emerald-300">
              PRO
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              {locale === "it"
                ? "Pensato per chi usa davvero le ricerche ogni settimana."
                : "Designed for people who use searches every week."}
            </p>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-semibold">
                
              </span>
              <span className="text-xs text-slate-400">
                {locale === "it" ? "/ mese" : "/ month"}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {locale === "it"
                ? "Nessun vincolo. Puoi annullare in qualsiasi momento dal portale Stripe."
                : "No long-term commitment. Cancel anytime from Stripe’s customer portal."}
            </p>

            <ul className="mt-4 space-y-1.5 text-xs text-slate-200">
              <li>• {locale === "it" ? "Ricerche illimitate (uso corretto)" : "Unlimited searches (fair use)"}</li>
              <li>• {locale === "it" ? "Follow-up via email illimitati" : "Unlimited email follow-ups"}</li>
              <li>• {locale === "it" ? "Priorità di elaborazione" : "Priority processing"}</li>
              <li>• {locale === "it" ? "Storico ricerche completo" : "Full search history"}</li>
              <li>• {locale === "it" ? "Download CSV + JSON" : "CSV + JSON export"}</li>
            </ul>
          </div>
        </section>

        {/* BENEFIT */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {t.benefitsTitle}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {t.benefits.map((b, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm"
              >
                <h3 className="text-sm font-semibold text-slate-50">
                  {b.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  {b.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FREE vs PRO */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {t.compareTitle}
          </h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="min-w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  {t.compare.headers.map((h, i) => (
                    <th key={i} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.compare.rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-slate-950" : "bg-slate-900/40"}
                  >
                    {row.map((cell, j) => (
                      <td key={j} className="px-4 py-3 text-slate-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {t.howItWorksTitle}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {t.howItWorks.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-xs font-semibold text-slate-950">
                  {item.step}
                </div>
                <h3 className="mt-3 text-sm font-semibold">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs text-slate-300">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-lg font-semibold tracking-tight">
            {t.faqTitle}
          </h2>
          <div className="mt-4 space-y-3">
            {t.faq.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="font-semibold text-slate-50">
                    {item.q}
                  </span>
                  <span className="text-xs text-slate-400 group-open:hidden">
                    +
                  </span>
                  <span className="hidden text-xs text-slate-400 group-open:inline">
                    –
                  </span>
                </summary>
                <p className="mt-2 text-xs text-slate-300">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA finale */}
        <section className="rounded-2xl border border-emerald-500/40 bg-emerald-500/5 p-5 text-center">
          <h2 className="text-lg font-semibold tracking-tight">
            {locale === "it"
              ? "Pronto a smettere di perdere tempo tra mille schede?"
              : "Ready to stop wasting time across endless tabs?"}
          </h2>
          <p className="mt-2 text-sm text-slate-200">
            {locale === "it"
              ? "Prova IFindItForYou PRO e lascia che ci occupiamo noi delle ricerche lunghe e noiose."
              : "Try IFindItForYou PRO and let us handle the long, boring research for you."}
          </p>
          
 
<div className="mt-6 flex flex-wrap items-center justify-center gap-3">
  <button
    type="button"
    onClick={handleUpgrade}
    disabled={loading}
    className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {isPro
      ? locale === "it"
        ? "Sei già PRO ✅ Vai alla dashboard"
        : "You are PRO ✅ Go to dashboard"
      : !isLoggedIn
      ? locale === "it"
        ? "Crea account (sblocchi +2 ricerche)"
        : "Create account (unlock +2 searches)"
      : loading
      ? locale === "it"
        ? "Reindirizzamento..."
        : "Redirecting..."
      : t.cta}
  </button>

  {!isLoggedIn ? (
    <a
      href={`/${locale}/login`}
      className="text-sm text-slate-300 underline underline-offset-4 hover:text-slate-100"
    >
      {locale === "it"
        ? "Hai già un account? Accedi"
        : "Already have an account? Log in"}
    </a>
  ) : (
    <a
      href={`/${locale}/account`}
      className="text-sm text-slate-300 underline underline-offset-4 hover:text-slate-100"
    >
      {locale === "it"
        ? "Vai al tuo account"
        : "Go to your account"}
    </a>
  )}
</div>

        </section>
      </main>
    </div>
  );
}
