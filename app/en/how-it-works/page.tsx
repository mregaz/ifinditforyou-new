// app/en/how-it-works/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "../../../lib/i18n-config";

// EN version of /how-it-works
const locale = "en" as const;
const path = "/how-it-works";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "How it works – iFindItForYou",
  description:
    "See how iFindItForYou works: describe what you need, a human+AI assistant filters the options and sends you only the best products.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "How it works – iFindItForYou",
    description:
      "Describe your needs, we search and filter the products and send you only the most relevant options.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How it works – iFindItForYou",
    description:
      "Describe your needs, we search and filter the products and send you only the most relevant options.",
  },
};

export default function HowItWorksPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>How it works</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 640 }}>
        With iFindItForYou you describe the product you need, how you plan to
        use it and your main constraints (budget, delivery time, etc.). A
        human+AI assistant searches across many sources, filters the noise and
        sends you a short, clear and reasoned selection of products.
      </p>
    </main>
  );
}
