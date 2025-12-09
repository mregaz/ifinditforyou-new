 // app/de/page.tsx  (home DE)

import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Menschliche Suche mit KI-Unterstützung",
  description:
    "Beschreiben Sie, was Sie brauchen. Ein Assistent kombiniert menschliche Recherche und KI und schickt Ihnen nur relevante Ergebnisse.",
};

export default function HomePageDe() {
  const initialLang: Lang = "de";
  return <HomePageClient initialLang={initialLang} />;
}
