// app/de/page.tsx
import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: "iFindItForYou – Die menschliche, KI-gestützte Suchmaschine",
  description:
    "Beschreibe, was du brauchst. Eine KI-gestützte Suchmaschine findet und filtert die besten Ergebnisse für dich.",
};

export default function Page() {
  return <HomePageClient initialLang="de" />;
}
