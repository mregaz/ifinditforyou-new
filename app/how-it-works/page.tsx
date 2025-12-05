// app/how-it-works/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../lib/i18n-config";

// Versione IT di /how-it-works
const locale = "it" as const;
const path = "/how-it-works";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Come funziona – iFindItForYou",
  description:
    "Scopri come funziona iFindItForYou: descrivi cosa cerchi, un assistente umano+AI filtra i risultati e ti propone solo i prodotti migliori.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Come funziona – iFindItForYou",
    description:
      "Descrivi cosa ti serve, noi cerchiamo e filtriamo i prodotti e ti inviamo solo le opzioni davvero rilevanti.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Come funziona – iFindItForYou",
    description:
      "Descrivi cosa ti serve, noi cerchiamo e filtriamo i prodotti e ti inviamo solo le opzioni davvero rilevanti.",
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
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Come funziona</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Con iFindItForYou descrivi il prodotto che ti serve, come lo userai e
        quali sono i vincoli principali (budget, tempi di consegna, ecc.).
        Un assistente combina AI e ricerca manuale per filtrare centinaia di
        opzioni e ti propone solo una selezione breve, chiara e argomentata.
      </p>
    </main>
  );
}
