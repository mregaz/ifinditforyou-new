// app/de/pro/page.tsx
import type { Metadata } from "next";
import ProPageClient from "@/app/pro/ProPageClient";
import { baseUrl, localePathname } from "@/lib/i18n-config";

const locale = "de";
const path = "/pro";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

export const metadata: Metadata = {
  title: "PRO-Tarif – iFindItForYou",
  description:
    "Mit dem PRO-Tarif erhalten Sie unbegrenzte Suchen, priorisierte Antworten und persönlichen Support.",
  alternates: {
    canonical: canonicalUrl,
  }
};

export default function Page() {
  return <ProPageClient lang="de" />;
}

