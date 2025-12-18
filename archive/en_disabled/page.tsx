 // app/en/page.tsx  (home EN)

import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Human search engine powered by AI",
  description:
    "Describe what you’re looking for. A smart assistant finds, filters and sends you only the useful results.",
};

export default function HomePageEn() {
  const initialLang: Lang = "en";
  return <HomePageClient initialLang={initialLang} />;
}
