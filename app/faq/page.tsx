// app/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../lib/i18n-config";

// Versione IT di /faq
const locale = "it" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "FAQ – Domande frequenti | iFindItForYou",
  description:
    "Risposte alle domande frequenti su come funziona iFindItForYou, piani, limiti e supporto.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "FAQ – Domande frequenti | iFindItForYou",
    description:
      "Risposte alle domande frequenti su iFindItForYou: funzionamento, piani, limiti e supporto.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ – Domande frequenti | iFindItForYou",
    description:
      "Risposte alle domande frequenti su iFindItForYou: funzionamento, piani, limiti e supporto.",
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
        Domande frequenti (FAQ)
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Qui trovi le risposte alle domande più comuni su iFindItForYou: come
        funziona, quali piani sono disponibili e come viene gestita la tua
        richiesta di ricerca.
      </p>
    </main>
  );
}

