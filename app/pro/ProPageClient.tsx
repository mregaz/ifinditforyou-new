"use client";

import { useState, useEffect } from "react";

type BillingPeriod = "monthly" | "yearly";

export default function ProPageClient() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState<BillingPeriod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

  // Se un giorno salverai lo stato PRO in localStorage lo leggiamo qui
  useEffect(() => {
    if (typeof window !== "undefined") {
      const value = window.localStorage.getItem("isPro");
      setIsPro(value === "true");
    }
  }, []);

  const handleCheckout = async (period: BillingPeriod) => {
    try {
      setIsLoading(period);
      setError(null);

      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ billingPeriod: period }),
      });

      if (!res.ok) {
        throw new Error("Errore nella creazione della sessione di pagamento.");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("URL di checkout non ricevuto da Stripe.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Qualcosa è andato storto. Riprova fra qualche secondo."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const isMonthly = billingPeriod === "monthly";

  // Stili super semplici in-line, senza tipi TS complicati
  const pageStyle = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    backgroundColor: "#020617", // blu notte
    color: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  } as const;

  const containerStyle = {
    width: "100%",
    maxWidth: 960,
  } as const;

  const cardsWrapperStyle = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
  } as const;

  const cardBaseStyle = {
    borderRadius: 16,
    border: "1px solid #1f2933",
    backgroundColor: "#020617",
    padding: 24,
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between",
  };

  const cardStyle = {
    ...cardBaseStyle,
  };

  const proCardStyle = {
    ...cardBaseStyle,
    borderColor: "#22c55e",
    boxShadow: "0 0 40px rgba(34,197,94,0.25)",
  };

  const priceStyle = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 4,
  } as const;

  const buttonBaseStyle = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  } as const;

  const disabledButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: "#1f2937",
    color: "#9ca3af",
    cursor: "not-allowed",
  } as const;

  const primaryButtonStyle = {
    ...buttonBaseStyle,
    backgroundColor: isLoading ? "#6ee7b7" : "#22c55e",
    color: "#022c22",
  } as const;

  const linkStyle = {
    color: "#6ee7b7",
    textDecoration: "underline",
  } as const;

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>
        {/* Header */}
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Passa a <span style={{ color: "#22c55e" }}>IFindItForYou PRO</span>
          </h1>
          <p style={{ maxWidth: 600, margin: "0 auto", color: "#9ca3af" }}>
            Tu descrivi quello che cerchi, noi troviamo per te il meglio del web
            e te lo serviamo già filtrato e riassunto.
          </p>
        </header>

        {/* Toggle mensile / annuale */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              padding: 4,
              borderRadius: 999,
              backgroundColor: "#020617",
              border: "1px solid #1f2937",
            }}
          >
            <button
              type="button"
              onClick={() => setBillingPeriod("monthly")}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: isMonthly ? 600 : 400,
                backgroundColor: isMonthly ? "#22c55e" : "transparent",
                color: isMonthly ? "#022c22" : "#e5e7eb",
              }}
            >
              Mensile
            </button>
            <button
              type="button"
              onClick={() => setBillingPeriod("yearly")}
              style={{
                padding: "6px 16px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: !isMonthly ? 600 : 400,
                backgroundColor: !isMonthly ? "#22c55e" : "transparent",
                color: !isMonthly ? "#022c22" : "#e5e7eb",
              }}
            >
              Annuale (risparmi)
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            ...cardsWrapperStyle,
            // su schermi larghi diventano 2 colonne
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {/* FREE */}
          <section style={cardStyle}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                Piano Free
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Per provare il servizio senza impegno.
              </p>
              <p style={priceStyle}>
                $0{" "}
                <span
                  style={{ fontSize: 14, fontWeight: 400, color: "#9ca3af" }}
                >
                  / per sempre
                </span>
              </p>
              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• 1 ricerca gratuita senza email</li>
                <li>• +1 ricerca gratuita con email</li>
                <li>• Risultati base generati dall&apos;AI</li>
                <li>• Nessuna carta di credito richiesta</li>
              </ul>
            </div>
            <div style={{ marginTop: 24 }}>
              <button type="button" style={disabledButtonStyle} disabled>
                Piano attuale
              </button>
            </div>
          </section>

          {/* PRO */}
          <section style={proCardStyle}>
            <div>
              <div
                style={{
                  position: "relative",
                  marginBottom: 8,
                }}
              >
                <h2
                  style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}
                >
                  IFindItForYou PRO
                </h2>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    fontSize: 11,
                    padding: "2px 8px",
                    borderRadius: 999,
                    backgroundColor: "#22c55e",
                    color: "#022c22",
                    fontWeight: 600,
                  }}
                >
                  Consigliato
                </span>
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Per chi vuole risposte migliori, più veloci e subito utilizzabili.
              </p>

              {isMonthly ? (
                <p style={priceStyle}>
                  $9.99{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9ca3af",
                    }}
                  >
                    / mese
                  </span>
                </p>
              ) : (
                <p style={priceStyle}>
                  $89{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9ca3af",
                    }}
                  >
                    / anno
                  </span>
                </p>
              )}

              <p style={{ fontSize: 12, color: "#6ee7b7", marginBottom: 12 }}>
                Pagamento sicuro con Stripe. Puoi disdire quando vuoi.
              </p>

              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• Ricerche avanzate illimitate</li>
                <li>• Risultati filtrati, ordinati e riassunti</li>
                <li>• Priorità nelle richieste</li>
                <li>• Accesso anticipato alle nuove funzioni</li>
                <li>• Supporto via email dedicato</li>
              </ul>
            </div>

            <div style={{ marginTop: 24 }}>
              <button
                type="button"
                onClick={() => handleCheckout(billingPeriod)}
                disabled={isPro || isLoading !== null}
                style={
                  isPro || isLoading !== null
                    ? disabledButtonStyle
                    : primaryButtonStyle
                }
              >
                {isPro
                  ? "Sei già PRO"
                  : isLoading === "monthly"
                  ? "Reindirizzamento a Stripe (mensile)..."
                  : isLoading === "yearly"
                  ? "Reindirizzamento a Stripe (annuale)..."
                  : "Passa a PRO"}
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Nessun vincolo lungo termine. Puoi annullare il rinnovo in
                qualsiasi momento dal tuo account Stripe.
              </p>

              {error && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#f87171",
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  {error}
                </p>
              )}
            </div>
          </section>
        </div>
                {/* Tabella confronto Free vs PRO */}
        <section
          style={{
            marginTop: 40,
            padding: 16,
            borderRadius: 16,
            backgroundColor: "#020617",
            border: "1px solid #1f2937",
            overflowX: "auto",
          }}
        >
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 12,
              textAlign: "center",
              color: "#22c55e",
            }}
          >
            Confronto veloce: Free vs PRO
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 13,
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: "left",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#9ca3af",
                  }}
                >
                  Funzionalità
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#9ca3af",
                  }}
                >
                  Free
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#bbf7d0",
                  }}
                >
                  PRO
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Numero di ricerche
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  2 (1 + 1 con email)
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Illimitate
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Qualità risultati
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Base
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Avanzata, filtrata e riassunta
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Priorità nelle richieste
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Normale
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Alta
                </td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Nuove funzioni
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                  }}
                >
                  Accesso standard
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Accesso anticipato
                </td>
              </tr>
              <tr>
                <td style={{ padding: "8px 4px" }}>Supporto</td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                  }}
                >
                  —
                </td>
                <td
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Email dedicata
                </td>
              </tr>
            </tbody>
          </table>
        </section>

{/* FAQ */}
<section
  style={{
    marginTop: 48,
    padding: "24px 16px",
    borderRadius: 16,
    backgroundColor: "#0f172a",
    border: "1px solid #1e293b",
  }}
>
  <h2
    style={{
      fontSize: 20,
      fontWeight: 700,
      marginBottom: 16,
      textAlign: "center",
      color: "#22c55e",
    }}
  >
    Domande frequenti (FAQ)
  </h2>

  <div style={{ marginBottom: 16 }}>
    <p style={{ fontWeight: 600, marginBottom: 4 }}>
      Posso annullare l&apos;abbonamento quando voglio?
    </p>
    <p style={{ color: "#9ca3af" }}>
      Certo. Puoi annullare il rinnovo automatico in qualsiasi momento dal tuo
      account Stripe. Continuerai a usare il piano PRO fino alla scadenza già pagata.
    </p>
  </div>

  <div style={{ marginBottom: 16 }}>
    <p style={{ fontWeight: 600, marginBottom: 4 }}>
      Il pagamento è sicuro?
    </p>
    <p style={{ color: "#9ca3af" }}>
      Usiamo Stripe, la piattaforma n°1 al mondo per pagamenti online. Nessun
      dato della tua carta passa dai nostri server.
    </p>
  </div>

  <div style={{ marginBottom: 16 }}>
    <p style={{ fontWeight: 600, marginBottom: 4 }}>
      Cosa cambia tra la versione Free e PRO?
    </p>
    <p style={{ color: "#9ca3af" }}>
      La versione Free offre solo richieste limitate e risultati base. La versione
      PRO include ricerche illimitate, risposte avanzate, priorità e funzioni extra.
    </p>
  </div>

  <div style={{ marginBottom: 16 }}>
    <p style={{ fontWeight: 600, marginBottom: 4 }}>
      Posso usare il servizio anche da mobile?
    </p>
    <p style={{ color: "#9ca3af" }}>
      Sì, tutta la piattaforma è ottimizzata anche per smartphone e tablet.
    </p>
  </div>

  <div>
    <p style={{ fontWeight: 600, marginBottom: 4 }}>
      Riceverò fattura per l&apos;abbonamento?
    </p>
    <p style={{ color: "#9ca3af" }}>
      Sì, Stripe invia automaticamente la ricevuta/fattura via email dopo ogni pagamento.
    </p>
  </div>
</section>

        {/* Legal: Termini & Privacy */}
        <section
          style={{
            marginTop: 32,
            fontSize: 12,
            color: "#9ca3af",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          <p>
            Prima di abbonarti, puoi leggere i{" "}
            <a href="/termini" style={linkStyle}>
              Termini e condizioni
            </a>{" "}
            e l&apos;informativa su{" "}
            <a href="/privacy" style={linkStyle}>
              Protezione dati / Privacy
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

