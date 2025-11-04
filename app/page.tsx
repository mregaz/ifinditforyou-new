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
  },
  de: {
    beta: "Kostenlose Beta",
    title: "iFindItForYou",
    subtitle:
      "Du schreibst, was du suchst, ich schicke dir den richtigen Link per E-Mail.",
    placeholder: "Was soll ich für dich finden?",
    button: "Finde es für mich",
    langLabel: "Sprache der Oberfläche",
    footerPrivacy: "Datenschutz",
    footerTerms: "AGB",
  },
};

export default function HomePage() {
  const [lang, setLang] = useState<"it" | "en" | "fr" | "de">("it");
  const t = TEXTS[lang];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 16px 24px",
        gap: 32,
      }}
    >
      {/* top */}
      <div style={{ width: "min(1100px, 100%)" }}>
        <p
          style={{
            fontSize: 14,
            opacity: 0.7,
            marginBottom: 24,
          }}
        >
          {t.beta}
        </p>

        <h1
          style={{
            fontSize: "clamp(42px, 5vw, 62px)",
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {t.title}
        </h1>

        <p
          style={{
            fontSize: 20,
            maxWidth: 900,
            lineHeight: 1.4,
            opacity: 0.9,
            marginBottom: 32,
          }}
        >
          {t.subtitle}
        </p>

        {/* barra + bottone */}
        <div
          style={{
            display: "flex",
            gap: 16,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder={t.placeholder}
            style={{
              flex: 1,
              minWidth: 260,
              background: "rgba(15,23,42,0.5)",
              border: "2px solid rgba(148,163,184,0.3)",
              borderRadius: 999,
              padding: "15px 20px",
              fontSize: 16,
              color: "white",
              outline: "none",
            }}
          />
          <button
            style={{
              background: "#a855f7",
              border: "none",
              borderRadius: 999,
              padding: "15px 32px",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.button}
          </button>
        </div>

        {/* selettore lingua */}
        <div style={{ marginTop: 24 }}>
          <label style={{ fontSize: 14, opacity: 0.7, marginRight: 12 }}>
            {t.langLabel}
          </label>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as any)}
            style={{
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.3)",
              color: "white",
              padding: "6px 12px",
              borderRadius: 8,
            }}
          >
            <option value="it">Italiano</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* footer */}
      <footer
        style={{
          marginTop: "auto",
          width: "min(1100px, 100%)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          fontSize: 14,
          opacity: 0.75,
        }}
      >
        <p>© 2025 iFindItForYou</p>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/privacy" style={{ color: "white" }}>
            {t.footerPrivacy}
          </a>
          <a href="/terms" style={{ color: "white" }}>
            {t.footerTerms}
          </a>
          <a href="/en/privacy" style={{ color: "white" }}>
            EN Privacy
          </a>
          <a href="/en/terms" style={{ color: "white" }}>
            EN Terms
          </a>
        </div>
      </footer>
    </main>
  );
}

