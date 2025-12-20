 // app/fr/page.tsx  (home FR)

import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Moteur de recherche humain + IA",
  description:
    "Décrivez ce dont vous avez besoin. Un assistant humain+IA cherche à votre place et vous renvoie seulement les résultats pertinents.",
};

export default function HomePageFr() {
  const initialLang: Lang = "fr";
  return <HomePageClient initialLang={initialLang} />;
}

