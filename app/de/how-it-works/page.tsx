// app/de/how-it-works/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wie funktioniert iFindItForYou",
  description:
    "Erfahre, wie iFindItForYou funktioniert: du beschreibst deinen Bedarf, die KI sucht, filtert und liefert dir nur die relevanten Ergebnisse.",
};

export default function HowItWorksPageDe() {
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
          Wie funktioniert iFindItForYou?
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          Der Ablauf ist bewusst einfach gehalten:
        </p>

        <ol style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>1. Du beschreibst, was du brauchst</strong>
            <br />
            Du kannst auf Deutsch, Italienisch, Englisch oder Französisch
            schreiben. Stelle Fragen, beschreibe ein Problem oder bitte um
            Ideen.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>2. Das System versteht deine Anfrage</strong>
            <br />
            Die Anfrage wird in Schlüsselpunkte zerlegt, um zu wissen, was
            gesucht werden soll und was nicht.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>3. Der Assistent führt die Suche aus</strong>
            <br />
            Mehrere Quellen werden konsultiert, verglichen und nach Relevanz
            und Qualität gefiltert.
          </li>
          <li>
            <strong>4. Du erhältst eine verständliche Antwort</strong>
            <br />
            Du bekommst eine klare Zusammenfassung mit Erklärungen,
            Vorschlägen und – falls sinnvoll – Links zum Vertiefen.
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
          Free-Plan
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          Mit dem Free-Plan kannst du den Dienst mit einer begrenzten Anzahl
          von Suchanfragen pro Monat testen – ideal für gelegentliche Nutzung.
        </p>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 10,
            marginTop: 16,
          }}
        >
          PRO-Plan
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          Mit dem PRO-Plan erhältst du unbegrenzte Suchanfragen, ausführlichere
          Antworten und eine bevorzugte Verarbeitung. Die Verwaltung des
          Abonnements erfolgt einfach und sicher über Stripe.
        </p>
      </div>
    </main>
  );
}
