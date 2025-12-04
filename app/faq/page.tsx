// app/faq/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domande frequenti su iFindItForYou",
  description:
    "Domande frequenti su iFindItForYou: account, lingue supportate, affidabilità dei risultati, piano PRO e gestione dei dati.",
};

type QA = {
  q: string;
  a: string;
};

const FAQ_LIST: QA[] = [
  {
    q: "Devo creare un account per usare iFindItForYou?",
    a: "Puoi provare il servizio gratuitamente con alcune ricerche. Per salvare le tue ricerche, esportarle e passare al piano PRO è necessario creare un account.",
  },
  {
    q: "In che lingue funziona?",
    a: "L’interfaccia e le ricerche funzionano in italiano, inglese, francese e tedesco. Puoi scrivere le richieste nella lingua che preferisci.",
  },
  {
    q: "I risultati sono affidabili?",
    a: "Le risposte si basano su ricerche mirate combinate con AI. L’obiettivo non è darti una singola “verità”, ma una sintesi ragionata e coerente delle migliori informazioni disponibili. Per decisioni critiche consigliamo sempre una verifica ulteriore.",
  },
  {
    q: "Come funziona l’abbonamento PRO?",
    a: "Il piano PRO offre ricerche illimitate, risposte più approfondite e priorità di elaborazione. La gestione dell’abbonamento avviene tramite Stripe in modo sicuro e trasparente.",
  },
  {
    q: "Cosa succede ai miei dati?",
    a: "I dati di autenticazione e le ricerche salvate vengono gestiti in modo sicuro. Non vendiamo i tuoi dati a terze parti e trattiamo le informazioni nel rispetto delle normative europee sulla privacy.",
  },
];

// FAQ JSON-LD (rich snippets Google)
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": FAQ_LIST.map((item) => ({
    "@type": "Question",
    "name": item.q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": item.a,
    },
  })),
};

export default function FaqPage() {
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
          Domande frequenti
        </h1>

        <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
          Qui trovi le risposte alle domande più comuni su iFindItForYou.
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

      {/* JSON-LD per Google | Rich Snippet FAQ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
    </main>
  );
}
