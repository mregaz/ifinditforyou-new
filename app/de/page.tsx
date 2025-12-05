// app/de/page.tsx
import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "iFindItForYou – KI-Suchassistent mit menschlicher Kontrolle",
  description:
    "Schreib, was du brauchst. Ein KI-gestützter Suchassistent filtert die Ergebnisse und zeigt dir nur das Relevante.",
};

export default function Page() {
  return <HomePageClient initialLang="de" />;
}

