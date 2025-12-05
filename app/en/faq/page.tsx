// app/en/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently asked questions about iFindItForYou",
  description:
    "FAQ about iFindItForYou: account, supported languages, reliability of results, PRO plan and data handling.",
};

type QA = {
  q: string;
  a: string;
};

const FAQ_LIST: QA[] = [
  {
    q: "Do I need an account to use iFindItForYou?",
    a: "You can try the service for free with a limited number of searches. To save your searches, export them and upgrade to the PRO plan, you need to create an account.",
  },
  {
    q: "Which languages are supported?",
    a: "The interface and searches work in Italian, English, French and German. You can write your requests in the language you prefer.",
  },
  {
    q: "Are the results reliable?",
    a: "Answers are based on targeted research combined with AI. The goal is not to provide a single absolute truth, but a reasoned and coherent synthesis of the best available information. For critical decisions, we always recommend an additional check.",
  },
  {
    q: "How does the PRO subscription work?",
    a: "The PRO plan offers unlimited searches, more in-depth answers and priority processing. Subscription management is handled via Stripe in a secure and transparent way.",
  },
  {
    q: "What happens to my data?",
    a: "Authentication data and saved searches are handled securely and in compliance with European regulations. We do not sell your data to third parties.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_LIST.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
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
      <div
        style={{
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(28px, 4vw, 36px)",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          Frequently asked questions
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Here you can find answers to the most common questions about
          iFindItForYou.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {FAQ_LIST.map((item, idx) => (
            <section
              key={idx}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid rgba(148,163,184,0.4)",
                background: "#f9fafb",
              }}
            >
              <h2
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  marginBottom: 8,
                }}
              >
                {item.q}
              </h2>
              <p style={{ fontSize: 14, lineHeight: 1.7 }}>{item.a}</p>
            </section>
          ))}
        </div>
      </div>

      {/* JSON-LD for FAQ rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </main>
  );
}

