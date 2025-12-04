// app/how-it-works/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Come funziona iFindItForYou",
  description:
    "Scopri come funziona iFindItForYou: scrivi cosa ti serve, l’AI cerca, filtra e ti restituisce solo risultati utili.",
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
          Come funziona iFindItForYou
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          Con iFindItForYou il flusso è molto semplice:
        </p>

        <ol style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 16 }}>
          <li style={{ marginBottom: 8 }}>
            <strong>1. Scrivi cosa ti serve</strong>
            <br />
            Usa frasi normali, in italiano o in altre lingue. Puoi fare
            domande, descrivere un problema, chiedere confronti o idee.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>2. Il sistema capisce la tua richiesta</strong>
            <br />
            La domanda viene “spezzata” in punti chiave, così l’assistente sa
            cosa cercare e cosa scartare.
          </li>
          <li style={{ marginBottom: 8 }}>
            <strong>3. L’assistente effettua la ricerca</strong>
            <br />
            Vengono consultate più fonti, confrontate tra loro e filtrate per
            qualità, coerenza e utilità.
          </li>
          <li>
            <strong>4. Ricevi una risposta chiara</strong>
            <br />
            Ottieni una sintesi leggibile, con spiegazioni, suggerimenti e,
            quando utile, riferimenti per approfondire.
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
          Piano Free
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 12 }}>
          Il piano Free ti offre un numero limitato di ricerche al mese, ideale
          per provare il servizio e usarlo in modo occasionale.
        </p>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 10,
            marginTop: 16,
          }}
        >
          Piano PRO
        </h2>
        <p style={{ fontSize: 15, lineHeight: 1.7 }}>
          Con il piano PRO hai ricerche illimitate, risposte più dettagliate e
          priorità di elaborazione. La gestione dell’abbonamento avviene tramite
          Stripe in modo semplice e sicuro.
        </p>
      </div>
    </main>
  );
}
