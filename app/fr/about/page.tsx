// app/fr/about/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

// Cette page est la version FR de /about
const locale = "fr" as const;
const path = "/about";

// URL canonique complète pour cette page
const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

// Carte des langues pour hreflang
const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

// Métadonnées de la page À propos FR
export const metadata: Metadata = {
  title: "À propos – iFindItForYou",
  description:
    "Découvrez l’équipe et l’histoire derrière iFindItForYou, l’assistant de recherche produits alimenté par l’IA.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "À propos – iFindItForYou",
    description:
      "Découvrez l’équipe et l’histoire derrière iFindItForYou, l’assistant de recherche produits alimenté par l’IA.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "À propos – iFindItForYou",
    description:
      "Découvrez l’équipe et l’histoire derrière iFindItForYou, l’assistant de recherche produits alimenté par l’IA.",
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
        À propos d’iFindItForYou
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        iFindItForYou est un assistant de recherche de produits, combinant
        intelligence artificielle et expertise humaine. L’interface est
        simple, le service est multilingue et vous pouvez commencer avec une
        offre gratuite, sans complications.
      </p>
    </main>
  );
}
