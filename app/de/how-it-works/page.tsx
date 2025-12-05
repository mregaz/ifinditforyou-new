// app/de/how-it-works/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../../lib/i18n-config";

// DE-Version von /how-it-works
const locale = "de" as const;
const path = "/how-it-works";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "So funktioniert es – iFindItForYou",
  description:
    "Erfahren Sie, wie iFindItForYou funktioniert: Beschreiben Sie, was Sie brauchen, ein Human+KI-Assistent filtert die Optionen und sendet Ihnen nur die besten Produkte.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "So funktioniert es – iFindItForYou",
    description:
      "Beschreiben Sie Ihren Bedarf, wir recherchieren und filtern Produkte und senden Ihnen nur die wirklich relevanten Optionen.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "So funktioniert es – iFindItForYou",
    description:
      "Beschreiben Sie Ihren Bedarf, wir recherchieren und filtern Produkte und senden Ihnen nur die wirklich relevanten Optionen.",
  },
};

export default function HowItWorksPage() {
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
        So funktioniert iFindItForYou
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Mit iFindItForYou beschreiben Sie das Produkt, das Sie suchen, wie Sie
        es verwenden möchten und welche Rahmenbedingungen wichtig sind
        (Budget, Lieferzeiten usw.). Ein Assistent aus KI und menschlicher
        Recherche filtert die Ergebnisse und liefert Ihnen eine kurze, klare
        und begründete Produktauswahl.
      </p>
    </main>
  );
}
