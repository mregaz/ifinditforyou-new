 // app/page.tsx  (home IT)

import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
  description:
    "Scrivi cosa cerchi. Un assistente intelligente trova, filtra e ti mostra solo i risultati utili. Preciso, veloce, multilingua.",
};

export default function HomePageIt() {
  const initialLang: Lang = "it";
  return <HomePageClient initialLang={initialLang} />;
}

