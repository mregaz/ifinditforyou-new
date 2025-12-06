// app/fr/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../../lib/i18n-config";

// Version FR de /faq
const locale = "fr" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "FAQ – Questions fréquentes | iFindItForYou",
  description:
    "Réponses aux questions les plus fréquentes sur le fonctionnement d’iFindItForYou, les offres et le support.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "FAQ – Questions fréquentes | iFindItForYou",
    description:
      "Réponses aux questions les plus fréquentes sur le fonctionnement d’iFindItForYou, les offres et le support.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ – Questions fréquentes | iFindItForYou",
    description:
      "Réponses aux questions les plus fréquentes sur le fonctionnement d’iFindItForYou, les offres et le support.",
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
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Questions fréquentes</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        Ici, vous trouvez les réponses aux questions les plus fréquentes sur
        iFindItForYou&nbsp;: comment le service fonctionne, quelles offres
        sont disponibles et comment votre demande de recherche est traitée.
      </p>
    </main>
  );
}
