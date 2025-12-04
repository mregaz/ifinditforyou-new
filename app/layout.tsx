// app/layout.tsx
import type { ReactNode } from "react";
import type { Metadata } from "next";
import Header from "@/components/Header";

// SEO globale (fallback per tutte le pagine)
export const metadata: Metadata = {
  title: {
    default: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
    template: "%s | iFindItForYou",
  },
  description:
    "Scrivi cosa cerchi. Un assistente intelligente trova, filtra e ti mostra solo i risultati utili. Preciso, veloce, multilingua.",
  metadataBase: new URL("https://TUO-DOMINIO.com"),
  openGraph: {
    title: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
    description:
      "Scrivi cosa cerchi. Un assistente intelligente trova, filtra e ti mostra solo i risultati utili. Preciso, veloce, multilingua.",
    url: "https://ifinditforyou.com",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
    description:
      "Scrivi cosa cerchi. Un assistente intelligente trova, filtra e ti mostra solo i risultati utili.",
  },
};

const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "iFindItForYou",
  url: "https://TUO-DOMINIO.com",
  description:
    "Assistente di ricerca umano potenziato dall’AI. Scrivi ciò che cerchi e ottieni risultati filtrati e sintetizzati.",
  applicationCategory: "Productivity",
  operatingSystem: "All",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <head>
        {/* Structured data per Google */}
        <script
          type="application/ld+json"
          // JSON-LD per WebApplication
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webAppJsonLd),
          }}
        />

        {/* Stili globali che avevi già */}
        <style>{`
          body {
            margin: 0;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #0f172a;
            color: #e2e8f0;
          }
          a { color: #93c5fd; text-decoration: underline; }
        `}</style>
      </head>
      <body>
        {/* HEADER visibile su tutte le pagine */}
        <Header />

        {/* CONTENUTO DELLA PAGINA */}
        {children}
      </body>
    </html>
  );
}

