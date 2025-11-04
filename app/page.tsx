"use client";

import { useState } from "react";

const TEXTS: Record<
  string,
  {
    beta: string;
    title: string;
    subtitle: string;
    placeholder: string;
    button: string;
    langLabel: string;
    footerPrivacy: string;
    footerTerms: string;
    resultsTitle: string;
    empty: string;
  }
> = {
  it: {
    beta: "Beta gratuita",
    title: "iFindItForYou",
    subtitle:
      "Tu scrivi cosa cerchi, io ti mando il link/opzione giusta per email.",
    placeholder: "Cosa vuoi che trovi per te?",
    button: "Trovalo per me",
    langLabel: "Lingua dell’interfaccia",
    footerPrivacy: "Privacy",
    footerTerms: "Termini",
    resultsTitle: "Ecco alcune opzioni:",
    empty: "Scrivi cosa cerchi sopra 👆",
  },
  en: {
    beta: "Free beta",
    title: "iFindItForYou",
    subtitle:
      "You tell me what you need, I send you the best link/option by email.",
    placeholder: "What do you want me to find?",
    button: "Find it for me",
    langLabel: "Interface language",
    footerPrivacy: "Privacy",
    footerTerms: "Terms",
    resultsTitle: "Here are some options:",
    empty: "Tell me what you’re looking for 👆",
  },
  fr: {
    beta: "Bêta gratuite",
    title: "iFindItForYou",
    subtitle:
      "Tu écris ce que tu cherches, je t’envoie le bon lien / la bonne option par email.",
    placeholder: "Qu’est-ce que tu veux que je trouve ?",
    button: "Trouve-le pour moi",
    langLabel: "Langue de l’interface",
    footerPrivacy: "Confidentialité",
    footerTerms: "Conditions",
    resultsTitle: "Quelques options :",
    empty: "Écris ce que tu cherches 👆",
  },
  de: {
    beta: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle:
      "Du schreibst, was du suchst, ich schicke dir den richtigen Link per E-Mail.",
    placeholder: "Was soll ich für dich finden?",
    button: "Finde es für mich",
    langLabel: "Sprache",
    footerPrivacy: "Datenschutz",
    footerTerms: "AGB",
    resultsTitle: "Einige Vorschläge:",
    empty: "Schreib oben, was du suchst 👆",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<"it" | "en" | "fr" | "de">("it");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState("");
  const t = TEXTS[lang];

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&lang=${lang}`
      );
      if (!res.ok) throw new Err

