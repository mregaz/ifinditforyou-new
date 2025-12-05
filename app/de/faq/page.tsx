// app/de/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Häufige Fragen zu iFindItForYou",
  description:
    "FAQ zu iFindItForYou: Konto, unterstützte Sprachen, Zuverlässigkeit der Ergebnisse, PRO-Plan und Umgang mit Daten.",
};

type QA = {
  q: string;
  a: string;
};

const FAQ_LIST: QA[] = [
  {
    q: "Brauche ich ein Konto, um iFindItForYou zu nutzen?",
    a: "Du kannst den Dienst mit einigen kostenlosen Suchanfragen testen. Um deine Suchen zu speichern, zu exportieren und auf den PRO-Plan zu wechseln, musst du ein Konto erstellen.",
  },
  {
    q: "Welche Sprachen werden unterstützt?",
    a: "Oberfläche und Suchen funktionieren auf Italienisch, Englisch, Französisch und Deutsch. Du kannst deine Anfrage in der Sprache schreiben, die dir am liebsten ist.",
  },
  {
    q: "Sind die Ergebnisse zuverlässig?",
    a: "Die Antworten basieren auf gezielten Recherchen, kombiniert mit KI. Ziel ist nicht eine einzige absolute Wahrheit, sondern eine nachvollziehbare und konsistente Zusammenfassung der besten verfügbaren Informationen. Für kritische Entscheidungen empfehlen wir immer eine zusätzliche Überprüfung.",
  },
  {
    q: "Wie funktioniert das PRO-Abonnement?",
    a: "Der PRO-Plan bietet unbegrenzte Suchanfragen, ausführlichere Antworten und eine priorisierte Verarbeitung. Die Verwaltung des Abonnements erfolgt über Stripe – sicher und transparent.",
  },
  {
    q: "Was passiert mit meinen Daten?",
    a: "Anmeldedaten und gespeicherte Suchen werden sicher und im Einklang mit den europäischen Datenschutzvorschriften verarbeitet. Wir verkaufen deine Daten nicht an Dritte.",
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

export default function FaqPageDe() {
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
          Häufige Fragen
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Hier findest du Antworten auf die häufigsten Fragen zu
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

      {/* JSON-LD für Rich-Results der FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </main>
  );
}
