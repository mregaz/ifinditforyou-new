// app/pro/page.tsx
import type { Metadata } from "next";
import ProPageClient from "@/app/pro/ProPageClient";
import { baseUrl, localePathname } from "@/lib/i18n-config";

const locale = "it";
const path = "/pro";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

export const metadata: Metadata = {
  title: "Piano PRO – iFindItForYou",
  description:
    "Con il piano PRO ottieni ricerche illimitate, risposte più rapide e assistenza dedicata.",
  alternates: {
    canonical: canonicalUrl,
  }
};

export default function Page() {
  return <ProPageClient lang="it" />;
}
