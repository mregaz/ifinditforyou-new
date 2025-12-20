// app/de/about/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

// Diese Seite ist die DE-Version von /about
const locale = "de" as const;
const path = "/about";

// Vollständige kanonische URL für diese Seite
const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

// Sprachkarte für hreflang
const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

// Metadaten der About-Seite DE
export const metadata: Metadata = {
  title: "Über uns – iFindItForYou",
  description:
    "Erfahren Sie mehr über das Team und die Vision hinter iFindItForYou, der KI-gestützten Produktsuche.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Über uns – iFindItForYou",
    description:
      "Erfahren Sie mehr über das Team und die Vision hinter iFindItForYou, der KI-gestützten Produktsuche.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Über uns – iFindItForYou",
    description:
      "Erfahren Sie mehr über das Team und die Vision hinter iFindItForYou, der KI-gestützten Produktsuche.",
  },
};

export default function AboutPage() {
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
        Über iFindItForYou
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        iFindItForYou ist ein Produktsuch-Assistent, der künstliche Intelligenz
        mit menschlicher Expertise verbindet. Die Oberfläche ist einfach, der
        Service ist mehrsprachig und Sie können mit einem kostenlosen Plan
        starten – ohne Komplikationen.
      </p>
    </main>
  );
}

