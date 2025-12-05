// app/fr/how-it-works/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../../lib/i18n-config";

// Version FR de /how-it-works
const locale = "fr" as const;
const path = "/how-it-works";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Comment ça marche – iFindItForYou",
  description:
    "Découvrez comment fonctionne iFindItForYou : décrivez ce dont vous avez besoin, un assistant humain+IA filtre les options et vous envoie seulement les meilleurs produits.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Comment ça marche – iFindItForYou",
    description:
      "Décrivez votre besoin, nous recherchons et filtrons les produits et nous vous envoyons uniquement les options les plus pertinentes.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comment ça marche – iFindItForYou",
    description:
      "Décrivez votre besoin, nous recherchons et filtrons les produits et nous vous envoyons uniquement les options les plus pertinentes.",
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
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Comment ça marche</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Avec iFindItForYou, vous décrivez le produit dont vous avez besoin,
        la façon dont vous allez l’utiliser et vos contraintes principales
        (budget, délais, etc.). Un assistant combinant IA et recherche humaine
        filtre les résultats et vous envoie une sélection courte, claire et
        argumentée.
      </p>
    </main>
  );
}
