"use client";

import { useState, useEffect } from "react";

type BillingPeriod = "monthly" | "yearly";

export default function ProPageDe() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>("monthly");
  const [isLoading, setIsLoading] = useState<BillingPeriod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

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
        throw new Error("Fehler beim Erstellen der Zahlungssitzung.");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("Keine Zahlungs-URL erhalten.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Etwas ist schiefgelaufen. Bitte versuch es später erneut."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const isMonthly = billingPeriod === "monthly";

  // --- Layout identisch wie IT/FR ---
  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    margin: 0,
    padding: "40px 16px",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const containerStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 960,
  };

  const cardsWrapperStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 24,
  };

  const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid #1f2933",
    backgroundColor: "#020617",
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const proCardStyle: React.CSSProperties = {
    ...cardStyle,
    borderColor: "#22c55e",
    boxShadow: "0 0 40px rgba(34,197,94,0.25)",
  };

  const priceStyle: React.CSSProperties = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 4,
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#1f2937",
    color: "#9ca3af",
    cursor: "not-allowed",
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: isLoading ? "#6ee7b7" : "#22c55e",
    color: "#022c22",
  };

  return (
    <main style={pageStyle}>
      <div style={containerStyle}>

        {/* --- Language Switch --- */}
        <header style={{ marginBottom: 32 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              fontSize: 12,
              color: "#9ca3af",
              marginBottom: 8,
            }}
          >
            <span>Sprache:</span>

            <a href="/pro" style={{ color: "#6ee7b7", textDecoration: "underline" }}>
              IT
            </a>
            <span>|</span>

            <a href="/fr/pro" style={{ color: "#6ee7b7", textDecoration: "underline" }}>
              FR
            </a>
            <span>|</span>

            <a href="/de/pro" style={{ color: "#6ee7b7", textDecoration: "underline" }}>
              DE
            </a>
            <span>|</span>

            <a href="/en/pro" style={{ color: "#6ee7b7", textDecoration: "underline" }}>
              EN
            </a>
          </div>

          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
              Werde <span style={{ color: "#22c55e" }}>IFindItForYou PRO</span>
            </h1>
            <p style={{ maxWidth: 600, margin: "0 auto", color: "#9ca3af" }}>
              Du beschreibst, was du suchst — wir finden für dich das Beste aus
              dem Internet: gefiltert, sortiert und zusammengefasst.
            </p>
          </div>
        </header>

        {/* --- Toggle monatlich/jährlich --- */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
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
              Monatlich
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
              Jährlich (sparen)
            </button>
          </div>
        </div>

        {/* --- Karten: FREE & PRO --- */}
        <div
          style={{
            ...cardsWrapperStyle,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {/* FREE */}
          <section style={cardStyle}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                Kostenloser Plan
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Um den Service unverbindlich auszuprobieren.
              </p>
              <p style={priceStyle}>
                0 CHF{" "}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#9ca3af" }}>
                  / für immer
                </span>
              </p>
              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• 1 kostenlose Suche ohne E-Mail</li>
                <li>• +1 kostenlose Suche mit E-Mail</li>
                <li>• Basisantworten per KI</li>
                <li>• Keine Kreditkarte erforderlich</li>
              </ul>
            </div>
            <div style={{ marginTop: 24 }}>
              <button type="button" style={disabledButtonStyle} disabled>
                Aktueller Plan
              </button>
            </div>
          </section>

          {/* PRO */}
          <section style={proCardStyle}>
            <div>
              <div style={{ position: "relative", marginBottom: 8 }}>
                <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
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
                  Empfohlen
                </span>
              </div>

              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Für alle, die bessere, schnellere und sofort nützliche Ergebnisse möchten.
              </p>

              {isMonthly ? (
                <p style={priceStyle}>
                  9.99 CHF{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9ca3af",
                    }}
                  >
                    / Monat
                  </span>
                </p>
              ) : (
                <p style={priceStyle}>
                  89 CHF{" "}
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 400,
                      color: "#9ca3af",
                    }}
                  >
                    / Jahr
                  </span>
                </p>
              )}

              <p style={{ fontSize: 12, color: "#6ee7b7", marginBottom: 12 }}>
                Sichere Zahlung mit Stripe. Du kannst jederzeit kündigen.
              </p>

              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• Unbegrenzte erweiterte Suchanfragen</li>
                <li>• Gefilterte, sortierte und zusammengefasste Ergebnisse</li>
                <li>• Priorität bei Anfragen</li>
                <li>• Früher Zugang zu neuen Funktionen</li>
                <li>• Dedizierter E-Mail-Support</li>
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
                  ? "Du bist bereits PRO"
                  : isLoading === "monthly"
                  ? "Weiterleiten zu Stripe (monatlich)..."
                  : isLoading === "yearly"
                  ? "Weiterleiten zu Stripe (jährlich)..."
                  : "Jetzt PRO werden"}
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Keine langfristige Bindung. Deine Verlängerung kannst du jederzeit in Stripe stoppen.
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

        {/* --- Vergleichstabelle Free vs PRO --- */}
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
            Schneller Vergleich: Gratis vs PRO
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
                  Funktion
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#9ca3af",
                  }}
                >
                  Gratis
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
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Anzahl der Suchanfragen
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  2 (1 + 1 mit E-Mail)
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Unbegrenzt
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Ergebnisqualität
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Basis
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Erweitert, gefiltert & zusammengefasst
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Priorität
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Normal
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Hoch
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Neue Funktionen
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Standardzugang
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Früher Zugang
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px" }}>Support</td>
                <td style={{ textAlign: "center" }}>—</td>
                <td style={{ textAlign: "center", color: "#4ade80", fontWeight: 600 }}>
                  Dedizierter E-Mail-Support
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* --- FAQ --- */}
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
            Häufige Fragen (FAQ)
          </h2>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Kann ich mein Abo jederzeit kündigen?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Ja. Du kannst die automatische Verlängerung jederzeit in deinem Stripe-Konto stoppen.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Ist die Zahlung sicher?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Wir nutzen Stripe, die weltweit führende Plattform für Onlinezahlungen.
              Deine Kartendaten werden niemals über unsere Server verarbeitet.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Was ist der Unterschied zwischen Gratis und PRO?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Die Gratis-Version bietet nur wenige Suchanfragen und Basisresultate.
              Die PRO-Version bietet unbegrenzte, bessere und priorisierte Antworten.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Funktioniert der Service auch auf dem Handy?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Ja, die gesamte Plattform ist vollständig für Smartphone und Tablet optimiert.
            </p>
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Bekomme ich eine Rechnung?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Ja. Stripe sendet nach jeder Zahlung automatisch eine Rechnung per E-Mail.
            </p>
          </div>
        </section>

        {/* --- Rechtliches --- */}
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
            <a
              href="/de/terms"
              style={{ color: "#6ee7b7", textDecoration: "underline" }}
            >
              Allgemeine Geschäftsbedingungen
            </a>{" "}
            |{" "}
            <a
              href="/de/privacy"
              style={{ color: "#6ee7b7", textDecoration: "underline" }}
            >
              Datenschutzerklärung
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

