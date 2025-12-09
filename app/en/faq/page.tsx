// app/en/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

const locale = "en" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Frequently Asked Questions – iFindItForYou",
  description:
    "Quick answers about the Free and PRO plans, response times, payments and data protection.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Frequently Asked Questions – iFindItForYou",
    description:
      "Learn how Free and PRO plans work, what response times to expect, and how your data is kept secure.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frequently Asked Questions – iFindItForYou",
    description:
      "All the answers about searches, plans and privacy on iFindItForYou.",
  },
};

export default function FaqPageEn() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Frequently Asked Questions (FAQ)</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720, marginBottom: 24 }}>
        Here you’ll find answers to the most common questions about how iFindItForYou
        works, what plans are available, and how payments and your data are handled.
      </p>

      <section style={{ maxWidth: 720, display: "grid", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1. How does iFindItForYou actually work?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            You describe the product or service you need (context, constraints, budget),
            and we combine manual research and AI to explore the web, filter out noise
            and send you a short, reasoned selection. We’re not a fully automatic price
            comparison tool: there is always a human component in the search.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2. What’s the difference between the Free and PRO plans?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            With the Free plan you can send a limited number of requests and you&apos;ll
            get a reply when there is available capacity. The PRO plan gives you more
            requests, priority in the queue, more in-depth answers and dedicated
            support. It’s designed for frequent or professional use.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3. How long does it take to receive an answer?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            It depends on the volume of requests and the complexity of your query.
            Simple requests are usually handled within a few business hours. More
            complex searches can take longer. PRO users have priority over Free users.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            4. What kind of products or services can you search for?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            We can help you find physical products (electronics, equipment, supplies,
            etc.) and in some cases online services. We don’t cover areas that require
            legal, tax or medical advice – in those cases you should always consult a
            qualified professional.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            5. How is my data handled?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            We use the information you provide only to fulfil your request and to
            improve the service in an aggregated and anonymised way. We don’t sell
            your data to third parties and we don’t use it for intrusive advertising.
            You can find all details in our Privacy Policy.
          </p>
        </div>
      </section>
    </main>
  );
}

