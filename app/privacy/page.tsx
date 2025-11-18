"use client";

import { useEffect, useState } from "react";
import { Lang, normalizeLang } from "@/lib/lang";
import { PRIVACY_TEXTS, type PrivacyContent } from "@/lib/privacy";

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("it");
  const [content, setContent] = useState<PrivacyContent>(PRIVACY_TEXTS.it);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlLang = params.get("lang");
      const normalized = normalizeLang(urlLang);
      setLang(normalized);
      setContent(PRIVACY_TEXTS[normalized]);
    }
  }, []);

  const t = content;

  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    backgroundColor: "#f8fafc",
    color: "#0f172a",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  } as const;

  const containerStyle = {
    width: "100%",
    maxWidth: 800,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
    border: "1px solid rgba(148,163,184,0.4)",
  } as const;

  const langLinkStyle = (code: Lang) =>
    ({
      fontSize: 12,
      textDecoration: "underline",
      cursor: "pointer",
      color: lang === code ? "#1d4ed8" : "#64748b",
      fontWeight: lang === code ? 600 : 400,
    } as const);

  return (
    <main style={pageStyle}>
      <article style={containerStyle}>
        {/* Switch lingua in alto a destra */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
            marginBottom: 12,
            color: "#64748b",
            fontSize: 12,
          }}
        >
          <span>Lingua / Language:</span>
          <a href="/privacy?lang=it" style={langLinkStyle("it")}>
            IT
          </a>
          <span>|</span>
          <a href="/privacy?lang=fr" style={langLinkStyle("fr")}>
            FR
          </a>
          <span>|</span>
          <a href="/privacy?lang=de" style={langLinkStyle("de")}>
            DE
          </a>
          <span>|</span>
          <a href="/privacy?lang=en" style={langLinkStyle("en")}>
            EN
          </a>
        </div>

        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            marginBottom: 4,
          }}
        >
          {t.title}
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "#6b7280",
            marginBottom: 16,
          }}
        >
          {t.lastUpdated}
        </p>

        {lang !== "it" && (
          <p
            style={{
              fontSize: 12,
              fontStyle: "italic",
              padding: "8px 10px",
              borderRadius: 8,
              backgroundColor: "#eff6ff",
              color: "#1e3a8a",
              marginBottom: 16,
            }}
          >
            La versione ufficiale di riferimento è quella in italiano. Questa è
            una traduzione fornita a scopo informativo.
          </p>
        )}

        {t.sections.map((section, idx) => (
          <section key={idx} style={{ marginBottom: 16 }}>
            <h2
              style={{
                fontSize: 16,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              {section.heading}
            </h2>
            {section.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  fontSize: 14,
                  color: "#111827",
                  marginBottom: 6,
                  lineHeight: 1.6,
                }}
              >
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>
    </main>
  );
}

