// app/de/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../../lib/i18n-config";

// DE-Version von /faq
const locale = "de" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "FAQ – Häufig gestellte Fragen | iFindItForYou",
  description:
    "Antworten auf häufig gestellte Fragen zu Funktionsweise, Plänen und Support von iFindItForYou.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "FAQ – Häufig gestellte Fragen | iFindItForYou",
    description:
      "Antworten auf häufig gestellte Fragen zu Funktionsweise, Plänen und Support von iFindItForYou.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ – Häufig gestellte Fragen | iFindItForYou",
    description:
      "Antworten auf häufig gestellte Fragen zu Funktionsweise, Plänen und Support von iFindItForYou.",
  },
};

export default function FaqPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        Häufig gestellte Fragen (FAQ)
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Hier finden Sie Antworten auf die häufigsten Fragen zu iFindItForYou:
        wie der Dienst funktioniert, welche Pläne verfügbar sind und wie Ihre
        Produktsuche bearbeitet wird.
      </p>
    </main>
  );
}
