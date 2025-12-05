// app/about/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../lib/i18n-config";

// Questa pagina è la versione IT di /about
const locale = "it" as const;
const path = "/about";

// URL canonico completo per questa pagina
const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

// Mappa delle lingue per hreflang
const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

// Metadata della pagina About IT
export const metadata: Metadata = {
  title: "Chi siamo – iFindItForYou",
  description:
    "Scopri chi c’è dietro iFindItForYou, il motore di ricerca prodotti potenziato dall’AI.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Chi siamo – iFindItForYou",
    description:
      "Scopri chi c’è dietro iFindItForYou, il motore di ricerca prodotti potenziato dall’AI.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chi siamo – iFindItForYou",
    description:
      "Scopri chi c’è dietro iFindItForYou, il motore di ricerca prodotti potenziato dall’AI.",
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
        About iFindItForYou
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        iFindItForYou è un assistente di ricerca prodotti, potenziato dall’AI
        e supportato da persone reali. L’interfaccia è semplice, il servizio
        è multilingua e puoi iniziare con un piano Free, senza complicazioni.
      </p>
    </main>
  );
}


