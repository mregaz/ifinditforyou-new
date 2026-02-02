"use client";

import Link from "next/link";
import { toLocale } from "@/lib/lang";

type Props = { locale: string };

export default function HomeLandingClient({ locale }: Props) {
  const lang = toLocale(locale);
  const isIT = lang === "it";

  const T = {
    brandLine: "iFindEV — by iFindItForYou",
    title: isIT ? "Scegli l’auto elettrica giusta" : "Choose the right EV",
    subtitle: isIT
      ? "3 scelte ragionate: migliore, più economica, premium. Niente hype."
      : "3 reasoned picks: best, cheaper, premium. No hype.",
    cta: isIT ? "Inizia la decisione" : "Start decision",
    trust: isIT ? "Come ragiono (Trust)" : "How I reason (Trust)",
    howTitle: isIT ? "Come funziona" : "How it works",
    bullets: isIT
      ? [
          "Domande minime, solo quando serve.",
          "Risultato leggibile (3 scelte + tradeoff).",
          "Pensato per casi reali: famiglia, budget, ricarica.",
        ]
      : [
          "Minimal questions, only when needed.",
          "Readable output (3 picks + tradeoffs).",
          "Built for real cases: family, budget, charging.",
        ],
    note: isIT
      ? "MVP: le scelte sono ancora “esempio” finché non colleghiamo dati affidabili."
      : "MVP: picks are still “examples” until we connect reliable data.",
    examplesTitle: isIT ? "Esempi rapidi" : "Quick examples",
    examplesHint: isIT
      ? "Apri /decide con la query precompilata e avvia automaticamente."
      : "Opens /decide prefilled and runs automatically.",
    examples: isIT
      ? [
          {
            label: "Famiglia · < 60k CHF · wallbox",
            q: "auto elettrica per famiglia sotto 60000 CHF, ho wallbox a casa",
          },
          {
            label: "Famiglia · < 60k CHF · no wallbox",
            q: "auto elettrica per famiglia sotto 60000 CHF, non posso caricare a casa",
          },
          {
            label: "Commuting · < 45k CHF",
            q: "auto elettrica per commuting quotidiano sotto 45000 CHF, vivo in Svizzera",
          },
        ]
      : [
          { label: "Family · < 60k CHF · wallbox", q: "family EV under 60000 CHF, I have a wallbox at home" },
          { label: "Family · < 60k CHF · no home charging", q: "family EV under 60000 CHF, I can’t charge at home" },
          { label: "Commuting · < 45k CHF", q: "EV for daily commuting under 45000 CHF, Switzerland" },
        ],
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-14">
      <header className="space-y-4">
        <div className="text-xs opacity-70">
          {T.brandLine} <span className="opacity-40">·</span>{" "}
          <span className="font-mono">{lang}</span>
        </div>

        <h1 className="text-4xl font-semibold leading-tight">{T.title}</h1>
        <p className="text-base opacity-80">{T.subtitle}</p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link className="rounded-xl border px-4 py-2 font-medium shadow-sm" href={`/${lang}/decide`}>
            {T.cta}
          </Link>

          <Link className="text-sm underline opacity-80 hover:opacity-100" href={`/${lang}/trust`}>
            {T.trust}
          </Link>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border p-5">
        <div className="text-sm font-semibold opacity-90">{T.examplesTitle}</div>

        <div className="mt-3 flex flex-wrap gap-2">
          {T.examples.map((ex: any) => (
            <Link
              key={ex.label}
              className="rounded-full border px-3 py-1.5 text-xs opacity-90 hover:opacity-100"
              href={`/${lang}/decide?q=${encodeURIComponent(ex.q)}&auto=1`}
              title={ex.q}
            >
              {ex.label}
            </Link>
          ))}
        </div>

        <div className="mt-3 text-xs opacity-60">{T.examplesHint}</div>
      </section>

      <section className="mt-6 rounded-2xl border p-5">
        <div className="text-sm font-semibold opacity-90">{T.howTitle}</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm opacity-85">
          {T.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>

        <div className="mt-4 rounded-xl border p-3 text-xs opacity-75">{T.note}</div>
      </section>

      <footer className="mt-10 text-xs opacity-60">
        Tip: prova un esempio rapido sopra. Poi modifica la query e rifai “Decidi”.
      </footer>
    </main>
  );
}

