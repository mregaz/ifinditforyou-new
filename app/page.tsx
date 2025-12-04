// app/page.tsx
import type { Metadata } from "next";
import HomePageClient from "@/components/homepageclient";
import { Lang } from "@/lib/lang";

export const metadata: Metadata = {
  title: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
  description:
    "Ottieni risposte personalizzate da un assistente che cerca al posto tuo. Meno rumore, più risultati utili, in più lingue.",
  openGraph: {
    title: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
    description:
      "Ottieni risposte personalizzate da un assistente che cerca al posto tuo. Meno rumore, più risultati utili, in più lingue.",
    url: "https://ifinditforyou.com",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "iFindItForYou – Il motore di ricerca umano potenziato dall’AI",
    description:
      "Ottieni risposte personalizzate da un assistente che cerca al posto tuo. Meno rumore, più risultati utili, in più lingue.",
  },
};

export default function Page() {
  const initialLang: Lang = "it";
  return <HomePageClient initialLang={initialLang} />;
}
