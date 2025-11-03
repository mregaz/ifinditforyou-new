"use client";

import { useState } from "react";

const texts = {
  it: {
    badge: "Beta gratuita",
    title: "iFindItForYou",
    subtitle:
      "Tu scrivi cosa cerchi, io ti mando il link/opzione giusta per email.",
    placeholder: "Cosa vuoi che trovi per te?",
    button: "Trovalo per me",
    langLabel: "Lingua dell’interfaccia",
  },
  en: {
    badge: "Free beta",
    title: "iFindItForYou",
    subtitle:
      "You tell me what you need, I send you the right link/option by email.",
    placeholder: "What do you want me to find?",
    button: "Find it for me",
    langLabel: "Interface language",
  },
  fr: {
    badge: "Bêta gratuite",
    title: "iFindItForYou",
    subtitle:
      "Tu écris ce que tu cherches, je t’envoie le bon lien / la bonne option par email.",
    placeholder: "Qu’est-ce que tu veux que je trouve ?",
    button: "Trouve-le pour moi",
    langLabel: "Langue de l’interface",
  },
  de: {
    badge: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle:
      "Du schreibst, was du suchst, ich schicke dir den passenden Link per E-Mail.",
    placeholder: "Was soll ich für dich finden?",
    button: "Finde es für mich",
    langLabel: "Sprache der Oberfläche",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<"it" | "en" | "fr" | "de">("it");
  const t = texts[lang];

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4">
      <div className="w-full max-w-5xl flex flex-col items-center gap-8">
        {/* badge */}
        <div className="text-sm text-slate-200">{t.badge}</div>

        {/* title */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-center">
          {t.title}
        </h1>

        {/* subtitle */}
        <p className="text-lg md:text-xl text-slate-200 text-center max-w-3xl">
          {t.subtitle}
        </p>

        {/* search bar + button */}
        <div className="w-full flex flex-col md:flex-row gap-4 mt-2">
          <input
            type="text"
            placeholder={t.placeholder}
            className="flex-1 rounded-full bg-transparent border border-slate-500/60 px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button className="rounded-full bg-purple-500 hover:bg-purple-600 px-10 py-4 font-medium text-base transition">
            {t.button}
          </button>
        </div>

        {/* language selector under the button */}
        <div className="w-full md:w-auto mt-2 flex flex-col gap-1 items-start md:items-center">
          <label className="text-xs uppercase tracking-wide text-slate-300">
            {t.langLabel}
          </label>
          <select
            value={lang}
            onChange={(e) =>
              setLang(e.target.value as "it" | "en" | "fr" | "de")
            }
            className="bg-[#0f172a] border border-slate-600 rounded-md px-3 py-1 text-sm"
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>

        {/* footer links (se li vuoi già qui) */}
        <footer className="mt-10 flex gap-4 text-sm text-slate-400">
          <a href="/privacy" className="hover:text-white">
            Privacy
          </a>
          <a href="/terms" className="hover:text-white">
            Termini
          </a>
          <a href="/en/privacy" className="hover:text-white">
            EN Privacy
          </a>
          <a href="/en/terms" className="hover:text-white">
            EN Terms
          </a>
        </footer>
      </div>
    </main>
  );
}
