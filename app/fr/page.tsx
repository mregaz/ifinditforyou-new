// app/fr/page.tsx
import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "iFindItForYou – Le moteur de recherche humain assisté par l’IA",
  description:
    "Écris ce que tu cherches. L’IA analyse, recherche et filtre pour te fournir uniquement les résultats pertinents.",
};

export default function Page() {
  return <HomePageClient initialLang="fr" />;
}
