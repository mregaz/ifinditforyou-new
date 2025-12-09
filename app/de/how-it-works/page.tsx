import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

// Deutsche Version von /how-it-works
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
    "Erfahren Sie, wie iFindItForYou funktioniert: Beschreiben Sie, was Sie suchen, ein Human+KI-Assistent filtert die Ergebnisse und liefert nur die besten Optionen.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "So funktioniert es – iFindItForYou",
    description:
      "Beschreiben Sie, was Sie brauchen, wir durchsuchen und filtern Produkte für Sie und senden Ihnen eine kurze Liste wirklich relevanter Optionen.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "So funktioniert es – iFindItForYou",
    description:
      "Beschreiben Sie, was Sie brauchen, wir durchsuchen und filtern Produkte für Sie und senden Ihnen eine kurze Liste wirklich relevanter Optionen.",
  },
};

export default function HowItWorksDePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>So funktioniert es</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Mit iFindItForYou beschreiben Sie das Produkt, das Sie benötigen, wie
        Sie es einsetzen wollen und welche Rahmenbedingungen wichtig sind
        (Budget, Lieferzeiten usw.). Ein Assistent kombiniert KI und manuelle
        Recherche, um hunderte Optionen zu filtern und Ihnen nur eine kurze,
        klare und gut begründete Auswahl vorzuschlagen.
      </p>
    </main>
  );
}
