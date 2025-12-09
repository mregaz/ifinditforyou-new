// app/fr/pro/page.tsx
import type { Metadata } from "next";
import ProPageClient from "@/app/pro/ProPageClient";
import { baseUrl, localePathname } from "@/lib/i18n-config";

const locale = "fr";
const path = "/pro";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

export const metadata: Metadata = {
  title: "Offre PRO – iFindItForYou",
  description:
    "Passez au plan PRO : recherches illimitées, réponses prioritaires et support dédié.",
  alternates: {
    canonical: canonicalUrl,
  }
};

export default function Page() {
  return <ProPageClient lang="fr" />;
}
