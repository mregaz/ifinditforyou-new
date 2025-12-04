// app/en/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What is iFindItForYou",
  description:
    "Learn what iFindItForYou is: a human-powered AI search assistant that finds targeted information for you.",
};

export default function AboutPageEn() {
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
          What is iFindItForYou
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          iFindItForYou is an assistant that searches for information on your
          behalf.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          Instead of wasting time going through dozens of results, you simply
          describe what you need in natural language and the system does three
          things:
        </p>

        <ul style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li>analyses your request</li>
          <li>performs targeted searches</li>
          <li>returns a clear, concise answer</li>
        </ul>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          It is designed for people who rely on information to work: freelancers,
          consultants, small businesses, content creators and professionals who
          don’t have hours to spend on search engines.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          The technology combines AI with a structured research method, so you
          can get:
        </p>

        <ul style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li>more precise answers</li>
          <li>less “noise” and fewer useless pages</li>
          <li>
            more time to focus on decisions rather than on searching for
            information
          </li>
        </ul>

        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          The interface is simple, the service is multilingual and you can start
          with a Free plan, without complications.
        </p>
      </div>
    </main>
  );
}
