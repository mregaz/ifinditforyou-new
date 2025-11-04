"use client";

import { useState } from "react";

type Lang = "it" | "en" | "fr" | "de";

const TEXTS: Record<Lang, {
  badge: string;
  title: string;
  subtitle: string;
  placeholder: string;
  button: string;
  langLabel: string;
  privacy: string;
  terms: string;
}> = {
  it: {
    badge: "Beta gratuita",
    title: "iFindItForYou",
    subtitle: "Tu scrivi cosa cerchi, io ti mando il link/opzione giusta per email.",
    placeholder: "Cosa vuoi che trovi per te?",
    button: "Trovalo per me",
    langLabel: "Lingua dell’interfaccia",
    privacy: "Privacy",
    terms: "Termini",
  },
  en: {
    badge: "Free beta",
    title: "iFindItForYou",
    subtitle: "Tell me what you need, I’ll send you the right link/option by email.",
    placeholder: "What do you want me to find for you?",
    button: "Find it for me",
    langLabel: "Interface language",
    privacy: "Privacy",
    terms: "Terms",
  },
  fr: {
    badge: "Bêta gratuite",
    title: "iFindItForYou",
    subtitle: "Tu écris ce que tu cherches, je t’envoie le bon lien / la bonne option par email.",
    placeholder: "Qu’est-ce que tu veux que je trouve pour toi ?",
    button: "Trouve-le pour moi",
    langLabel: "Langue de l’interface",
    privacy: "Confidentialité",
    terms: "Conditions",
  },
  de: {
    badge: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle: "Du schreibst, was du suchst, ich schicke dir den passenden Link per E-Mail.",
    placeholder: "Was soll ich für dich finden?",
    button: "Finde es für mich",
    langLabel: "Sprache der Oberfläche",
    privacy: "Datenschutz",
    terms: "AGB",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("it");
  const [query, setQuery] = useState("");
  const t = TEXTS[lang];

  const handleSubmit = () => {
    // qui in futuro potrai:
    // - aprire un form
    // - chiamare /api/lead
    // per ora lasciamo solo un log
    console.log("Richiesta:", { query, lang });
  };

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col">
      {/* contenuto */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl">
          {/* badge */}
          <p className="text-sm text-slate-200 mb-3">{t.badge}</p>

          {/* title */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4">
            {t.title}
          </h1>

          {/* subtitle */}
          <p className="text-lg md:text-2xl text-slate-200 mb-10 max-w-3xl">
            {t.subtitle}
          </p>

          {/* input + button */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder={t.placeholder}
              className="flex-1 bg-[#0b1120] border border-slate-700/80 rounded-full px-6 py-4 text-base focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              onClick={handleSubmit}
              className="bg-[#a855f7] hover:bg-[#9d46ef] transition text-white font-semibold px-10 py-4 rounded-full text-base shadow-lg shadow-purple-500/20"
            >
              {t.button}
            </button>
          </div>

          {/* language selector */}
          <div className="mb-10">
            <label className="block text-sm text-slate-200 mb-2">
              {t.langLabel}
            </label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="bg-[#0b1120] border border-slate-700/80 rounded-lg px-4 py-2 text-sm"
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
          </div>
        </div>
      </div>

      {/* footer */}
      <footer className="w-full py-6 border-t border-slate-800 px-4">
        <div className="max-w-5xl mx-auto flex flex-wrap gap-4 items-center justify-between text-sm text-slate-300">
          <p>© {new Date().getFullYear()} iFindItForYou</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white">
              {t.privacy}
            </a>
            <a href="/terms" className="hover:text-white">
              {t.terms}
            </a>
            {/* versioni inglesi già pronte se le vuoi mantenere */}
            <a href="/en/privacy" className="hover:text-white">
              EN {t.privacy}
            </a>
            <a href="/en/terms" className="hover:text-white">
              EN {t.terms}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}

