// app/about/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cos’è iFindItForYou",
  description:
    "Scopri cos’è iFindItForYou: un motore di ricerca umano potenziato dall’AI che trova informazioni mirate per te.",
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
          Cos’è iFindItForYou
        </h1>

        <p style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 16 }}>
          iFindItForYou è un assistente che cerca informazioni al posto tuo.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          Invece di perdere tempo tra decine di risultati, scrivi cosa ti serve
          in linguaggio naturale e il sistema fa tre cose:
        </p>

        <ul style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li>analizza la tua richiesta</li>
          <li>effettua ricerche mirate</li>
          <li>ti restituisce una risposta chiara e sintetica</li>
        </ul>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          È pensato per chi usa le informazioni per lavorare: freelance,
          consulenti, piccoli business, creatori di contenuti e professionisti
          che non hanno ore da perdere sui motori di ricerca.
        </p>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          La tecnologia unisce AI e un metodo di ricerca strutturato, così puoi
          ottenere:
        </p>

        <ul style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li>risposte più precise</li>
          <li>meno “rumore” e pagine inutili</li>
          <li>più tempo per concentrarti sulle decisioni, non sulla ricerca</li>
        </ul>

        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          L’interfaccia è semplice, il servizio è multilingua e puoi iniziare
          con un piano Free, senza complicazioni.
        </p>
      </div>
    </main>
  );
}
