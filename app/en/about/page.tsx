// app/en/about/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

// This page is the EN version of /about
const locale = "en" as const;
const path = "/about";

// Canonical URL for this page
const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

// Languages map for hreflang
const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

// Metadata for About EN
export const metadata: Metadata = {
  title: "About us – iFindItForYou",
  description:
    "Learn more about the team and story behind iFindItForYou.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "About us – iFindItForYou",
    description:
      "Learn more about the team and story behind iFindItForYou.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About us – iFindItForYou",
    description:
      "Learn more about the team and story behind iFindItForYou.",
  },
};

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>
        About iFindItForYou
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        iFindItForYou is a human-powered AI search assistant that finds the
        best products for you. The interface is simple, the service is
        multilingual and you can start with a Free plan, without
        complications.
      </p>
    </main>
  );
}

