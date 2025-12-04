// app/en/how-it-works/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How iFindItForYou works",
  description:
    "Learn how iFindItForYou works: describe what you need, the AI searches, filters and returns only useful results.",
};

export default function HowItWorksPageEn() {
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
          How iFindItForYou works
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          With iFindItForYou, the flow is very simple:
        </p>

        <ol style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>1. Describe what you need</strong>
            <br />
            Use normal sentences, in English or other languages. You can ask
            questions, describe a problem, request comparisons or ideas.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>2. The system understands your request</strong>
            <br />
            Your query is broken down into key points so the assistant knows
            what to search for and what to ignore.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>3. The assistant performs the search</strong>
            <br />
            Multiple sources are consulted, compared and filtered for quality,
            coherence and usefulness.
          </li>
          <li>
            <strong>4. You receive a clear answer</strong>
            <br />
            You get a readable summary with explanations, suggestions and, when
            useful, references for further reading.
          </li>
        </ol>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 10,
            marginTop: 24,
          }}
        >
          Free plan
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          The Free plan gives you a limited number of searches per month, ideal
          for trying the service and using it occasionally.
        </p>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 10,
            marginTop: 16,
          }}
        >
          PRO plan
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          With the PRO plan you get unlimited searches, more detailed answers
          and priority processing. Subscription management is handled via Stripe
          in a simple and secure way.
        </p>
      </div>
    </main>
  );
}
