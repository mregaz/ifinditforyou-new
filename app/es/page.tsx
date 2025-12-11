// app/es/page.tsx (home ES)

import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Búsqueda humana asistida por IA",
  description:
    "Describe lo que necesitas. Un asistente combina investigación humana e IA para enviarte solo resultados realmente relevantes.",
};

export default function HomePageEs() {
  const initialLang: Lang = "es";
  return <HomePageClient initialLang={initialLang} />;
}
