// app/en/pro/page.tsx
import type { Metadata } from "next";
import ProPageClient from "@/app/pro/ProPageClient";
import { baseUrl, localePathname } from "@/lib/i18n-config";

const locale = "en";
const path = "/pro";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

export const metadata: Metadata = {
  title: "PRO Plan – iFindItForYou",
  description:
    "Upgrade to the PRO plan: unlimited searches, priority responses and dedicated support.",
  alternates: {
    canonical: canonicalUrl,
  }
};

export default function Page() {
  return <ProPageClient initialLang="en" />;
}

