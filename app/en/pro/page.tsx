"use client";

import { useState, useEffect } from "react";

type BillingPeriod = "monthly" | "yearly";

export default function ProPageEn() {
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
        throw new Error("Error while creating the payment session.");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("No checkout URL received.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Something went wrong. Please try again in a few seconds."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const isMonthly = billingPeriod === "monthly";

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
        {/* Language switch */}
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
            <span>Language:</span>

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
              Upgrade to{" "}
              <span style={{ color: "#22c55e" }}>IFindItForYou PRO</span>
            </h1>
            <p style={{ maxWidth: 600, margin: "0 auto", color: "#9ca3af" }}>
              You describe what you’re looking for, we search the web for you
              and deliver filtered, structured and summarized results.
            </p>
          </div>
        </header>

        {/* Monthly / Yearly toggle */}
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
              Monthly
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
              Yearly (save money)
            </button>
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            ...cardsWrapperStyle,
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {/* FREE card */}
          <section style={cardStyle}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                Free Plan
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Perfect to test the service with no commitment.
              </p>
              <p style={priceStyle}>
                0 CHF{" "}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#9ca3af" }}>
                  / forever
                </span>
              </p>
              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• 1 free search without email</li>
                <li>• +1 extra free search with email</li>
                <li>• Basic AI-generated results</li>
                <li>• No credit card required</li>
              </ul>
            </div>
            <div style={{ marginTop: 24 }}>
              <button type="button" style={disabledButtonStyle} disabled>
                Current plan
              </button>
            </div>
          </section>

          {/* PRO card */}
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
                  Recommended
                </span>
              </div>

              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                For people who want better, faster and ready-to-use answers.
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
                    / month
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
                    / year
                  </span>
                </p>
              )}

              <p style={{ fontSize: 12, color: "#6ee7b7", marginBottom: 12 }}>
                Secure payments powered by Stripe. You can cancel any time.
              </p>

              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• Unlimited advanced searches</li>
                <li>• Filtered, sorted and summarized results</li>
                <li>• Priority in the request queue</li>
                <li>• Early access to new features</li>
                <li>• Dedicated email support</li>
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
                  ? "You’re already PRO"
                  : isLoading === "monthly"
                  ? "Redirecting to Stripe (monthly)..."
                  : isLoading === "yearly"
                  ? "Redirecting to Stripe (yearly)..."
                  : "Upgrade to PRO"}
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                No long-term contracts. You can stop the renewal any time from
                your Stripe account.
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

        {/* Comparison table */}
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
            Quick comparison: Free vs PRO
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
                  Feature
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
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Number of searches
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  2 (1 + 1 with email)
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Unlimited
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Result quality
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Basic
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Advanced, filtered & summarized
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Priority
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
                  High
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  New features
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Standard access
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Early access
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px" }}>Support</td>
                <td style={{ textAlign: "center" }}>—</td>
                <td style={{ textAlign: "center", color: "#4ade80", fontWeight: 600 }}>
                  Dedicated email support
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
            Frequently asked questions (FAQ)
          </h2>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Can I cancel my subscription any time?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Yes. You can stop the automatic renewal at any time from your Stripe
              account.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Is the payment secure?
            </p>
            <p style={{ color: "#9ca3af" }}>
              We use Stripe, the leading payment platform worldwide. Your card
              details never pass through our servers.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              What’s the difference between Free and PRO?
            </p>
            <p style={{ color: "#9ca3af" }}>
              The Free version offers a few searches and basic results. The PRO
              version gives you unlimited, higher-quality and priority answers.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Can I use the service on mobile?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Yes. The whole platform is fully optimized for smartphones and
              tablets.
            </p>
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Will I receive an invoice?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Yes, Stripe automatically sends a receipt/invoice by email after each
              payment.
            </p>
          </div>
        </section>

        {/* Legal links */}
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
              href="/en/terms"
              style={{ color: "#6ee7b7", textDecoration: "underline" }}
            >
              Terms & Conditions
            </a>{" "}
            |{" "}
            <a
              href="/en/privacy"
              style={{ color: "#6ee7b7", textDecoration: "underline" }}
            >
              Privacy Policy
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
