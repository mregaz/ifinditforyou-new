"use client";

import Link from "next/link";
import { toLocale } from "@/lib/lang";

type Props = { locale: string };

export default function TrustPageClient({ locale }: Props) {
  const lang = toLocale(locale);
  const isIT = lang === "it";

  const T = {
    title: isIT ? "Come ragiona iFindEV" : "How iFindEV reasons",
    subtitle: isIT
      ? "Un assistente decisionale: prima chiarisce i vincoli critici, poi dà 3 opzioni con tradeoff."
      : "A decision assistant: clarify critical constraints first, then give 3 options with tradeoffs.",
    section1: isIT ? "Cosa faccio" : "What I do",
    section2: isIT ? "Cosa NON faccio" : "What I don’t do",
    section3: isIT ? "Quali segnali pesano di più" : "What signals matter most",
    section4: isIT ? "Perché a volte faccio una domanda (gate)" : "Why I sometimes ask a question (gate)",
    cta: isIT ? "Vai alla decisione" : "Go to decision",
    bulletsDo: isIT
      ? [
          "Ti do 3 scelte: migliore / più economica / premium.",
          "Ti spiego perché e cosa stai sacrificando (tradeoff).",
          "Ti faccio domande solo quando sono davvero determinanti (es. ricarica a casa).",
        ]
      : [
          "I give 3 picks: best / cheaper / premium.",
          "I explain why and what you trade off.",
          "I ask only when the answer changes the outcome (e.g., home charging).",
        ],
    bulletsDont: isIT
      ? [
          "Non sparo modelli specifici o prezzi reali finché non collego fonti affidabili.",
          "Non ottimizzo per hype o status: ottimizzo per uso e vincoli.",
          "Non faccio finta di sapere ciò che non mi hai detto.",
        ]
      : [
          "I won’t name real models or prices until I connect reliable sources.",
          "I don’t optimize for hype/status; I optimize for usage and constraints.",
          "I won’t pretend to know what you didn’t tell me.",
        ],
    signals: isIT
      ? [
          { k: "Ricarica", v: "Casa (wallbox/garage) vs no: cambia tutto." },
          { k: "Spazio", v: "Famiglia = bagagliaio, sedili, praticità." },
          { k: "Autonomia reale", v: "Autostrada/freddo contano più della scheda tecnica." },
          { k: "Budget", v: "Massimo e ‘dolore’ sul costo totale, non solo listino." },
        ]
      : [
          { k: "Charging", v: "Home (wallbox/garage) vs none: it changes everything." },
          { k: "Space", v: "Family use = cargo, seats, practicality." },
          { k: "Real range", v: "Highway/cold matters more than brochure numbers." },
          { k: "Budget", v: "Max budget and total cost pain, not only sticker price." },
        ],
    gateText: isIT
      ? "Se manca un dato critico (es. ricarica a casa), ti fermo e te lo chiedo. È meglio di darti consigli a caso."
      : "If a critical detail is missing (e.g., home charging), I stop and ask. It’s better than guessing.",
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <header className="space-y-3">
        <div className="text-xs opacity-70">
          iFindEV <span className="opacity-40">·</span> <span className="font-mono">{lang}</span>
        </div>
        <h1 className="text-3xl font-semibold">{T.title}</h1>
        <p className="text-sm opacity-80">{T.subtitle}</p>

        <div className="pt-2">
          <Link className="rounded-xl border px-4 py-2 text-sm font-medium shadow-sm" href={`/${lang}/decide`}>
            {T.cta}
          </Link>
        </div>
      </header>

      <section className="mt-8 rounded-2xl border p-5">
        <div className="text-sm font-semibold">{T.section1}</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm opacity-90">
          {T.bulletsDo.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border p-5">
        <div className="text-sm font-semibold">{T.section2}</div>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm opacity-90">
          {T.bulletsDont.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6 rounded-2xl border p-5">
        <div className="text-sm font-semibold">{T.section3}</div>
        <div className="mt-3 grid gap-3">
          {T.signals.map((s) => (
            <div key={s.k} className="rounded-xl border p-3">
              <div className="text-sm font-semibold">{s.k}</div>
              <div className="text-sm opacity-85">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl border p-5">
        <div className="text-sm font-semibold">{T.section4}</div>
        <p className="mt-3 text-sm opacity-90">{T.gateText}</p>
      </section>

      <footer className="mt-10 text-xs opacity-60">
        {isIT ? "Suggerimento: prova un esempio rapido dalla homepage." : "Tip: try a quick example from the homepage."}
      </footer>
    </main>
  );
}
