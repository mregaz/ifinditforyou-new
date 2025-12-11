// app/es/page.tsx
import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import type { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Búsqueda humana con ayuda de IA",
  description:
    "Describe lo que necesitas. Un asistente combina búsqueda humana e IA y te muestra solo resultados realmente útiles.",
};

export default function HomePageEs() {
  const initialLang: Lang = "es";
  return <HomePageClient initialLang={initialLang} />;
}
