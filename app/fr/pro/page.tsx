"use client";

import { useState, useEffect } from "react";

type BillingPeriod = "monthly" | "yearly";

export default function ProPageFr() {
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
        throw new Error("Erreur lors de la création de la session de paiement.");
      }

      const data = await res.json();

      if (!data.url) {
        throw new Error("URL de paiement non reçue.");
      }

      window.location.href = data.url;
    } catch (err: any) {
      console.error(err);
      setError(
        err?.message || "Une erreur est survenue. Réessaie dans quelques secondes."
      );
    } finally {
      setIsLoading(null);
    }
  };

  const isMonthly = billingPeriod === "monthly";

  // --- Styles identiques à la version ITA ---
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

        {/* --- Switch langue --- */}
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
            <span>Langue:</span>

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
              Passe à <span style={{ color: "#22c55e" }}>IFindItForYou PRO</span>
            </h1>
            <p style={{ maxWidth: 600, margin: "0 auto", color: "#9ca3af" }}>
              Tu décris ce que tu recherches, nous trouvons le meilleur du web pour toi — filtré, trié et résumé.
            </p>
          </div>
        </header>

        {/* --- Toggle mensuel/annuel --- */}
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
              Mensuel
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
              Annuel (économise)
            </button>
          </div>
        </div>

        {/* --- CARTES Free & PRO --- */}
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
                Plan Gratuit
              </h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Pour tester le service sans engagement.
              </p>
              <p style={priceStyle}>
                0 CHF{" "}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#9ca3af" }}>
                  / pour toujours
                </span>
              </p>
              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• 1 recherche gratuite sans email</li>
                <li>• +1 recherche gratuite avec email</li>
                <li>• Résultats basiques générés par l’IA</li>
                <li>• Pas de carte de crédit requise</li>
              </ul>
            </div>
            <div style={{ marginTop: 24 }}>
              <button type="button" style={disabledButtonStyle} disabled>
                Plan actuel
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
                  Recommandé
                </span>
              </div>

              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 16 }}>
                Pour ceux qui veulent des réponses meilleures, plus rapides et directement utiles.
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
                    / mois
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
                    / an
                  </span>
                </p>
              )}

              <p style={{ fontSize: 12, color: "#6ee7b7", marginBottom: 12 }}>
                Paiement sécurisé avec Stripe. Tu peux annuler quand tu veux.
              </p>

              <ul style={{ fontSize: 14, color: "#e5e7eb", paddingLeft: 16 }}>
                <li>• Recherches avancées illimitées</li>
                <li>• Résultats filtrés, triés et résumés</li>
                <li>• Priorité dans les demandes</li>
                <li>• Accès anticipé aux nouvelles fonctions</li>
                <li>• Support email dédié</li>
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
                  ? "Tu es déjà PRO"
                  : isLoading === "monthly"
                  ? "Redirection vers Stripe (mensuel)..."
                  : isLoading === "yearly"
                  ? "Redirection vers Stripe (annuel)..."
                  : "Passer à PRO"}
              </button>

              <p
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                  marginTop: 8,
                  textAlign: "center",
                }}
              >
                Aucun engagement. Tu peux arrêter le renouvellement automatique quand tu veux.
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

        {/* --- Tableau Free vs PRO --- */}
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
            Comparaison rapide : Gratuit vs PRO
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
                  Fonctionnalité
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "8px 4px",
                    borderBottom: "1px solid #1f2937",
                    color: "#9ca3af",
                  }}
                >
                  Gratuit
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
                  Nombre de recherches
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  2 (1 + 1 avec email)
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Illimitées
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Qualité des résultats
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Basique
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Avancée, filtrée et résumée
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Priorité
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Normale
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Haute
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px", borderBottom: "1px solid #111827" }}>
                  Nouvelles fonctions
                </td>
                <td style={{ textAlign: "center", borderBottom: "1px solid #111827" }}>
                  Accès standard
                </td>
                <td
                  style={{
                    textAlign: "center",
                    borderBottom: "1px solid #111827",
                    color: "#4ade80",
                    fontWeight: 600,
                  }}
                >
                  Accès anticipé
                </td>
              </tr>

              <tr>
                <td style={{ padding: "8px 4px" }}>Support</td>
                <td style={{ textAlign: "center" }}>—</td>
                <td style={{ textAlign: "center", color: "#4ade80", fontWeight: 600 }}>
                  Email dédié
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
            Questions fréquentes (FAQ)
          </h2>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Puis-je annuler mon abonnement quand je veux ?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Oui. Tu peux annuler le renouvellement automatique depuis ton
              compte Stripe à tout moment.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Le paiement est-il sécurisé ?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Nous utilisons Stripe, la plateforme leader mondiale pour les paiements en ligne.
              Tes données bancaires ne passent jamais par nos serveurs.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Quelle est la différence entre la version gratuite et PRO ?
            </p>
            <p style={{ color: "#9ca3af" }}>
              La version gratuite offre quelques recherches et des résultats basiques. La version PRO
              propose des réponses avancées, illimitées et prioritaires.
            </p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Est-ce que je peux utiliser le service sur mobile ?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Oui. La plateforme est entièrement optimisée pour smartphone et tablette.
            </p>
          </div>

          <div>
            <p style={{ fontWeight: 600, marginBottom: 4 }}>
              Vais-je recevoir une facture ?
            </p>
            <p style={{ color: "#9ca3af" }}>
              Oui, Stripe envoie automatiquement une facture par email après chaque paiement.
            </p>
          </div>
        </section>

        {/* --- Liens légaux --- */}
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
              href="/fr/termines"
              style={{ color: "#6ee7b7", textDecoration: "underline" }}
            >
              Termes et conditions
            </a>{" "}
            |{" "}
            <a
              href="/fr/privacy"
              style={{ color: "#6ee7b7", textDecoration: "underline" }}
            >
              Politique de confidentialité
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}
