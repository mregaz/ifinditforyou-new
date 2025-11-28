"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type UserInfo = {
  email: string;
  isPro: boolean;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AccountPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: authData, error: authError } = await supabase.auth.getUser();
        if (authError || !authData.user) {
          setError("Devi effettuare il login per vedere questa pagina.");
          setLoading(false);
          return;
        }

        const email = authData.user.email ?? "";

        // legge la tabella User (dove hai is_pro)
        const { data: userRows, error: userError } = await supabase
          .from("User")
          .select("is_pro")
          .eq("id", authData.user.id)
          .maybeSingle();

        if (userError) {
          console.error("Errore lettura User:", userError);
        }

        setUser({
          email,
          isPro: !!userRows?.is_pro,
        });
      } catch (e: any) {
        console.error(e);
        setError("Errore nel caricamento dei dati utente.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleOpenPortal = async () => {
    if (!user?.email) return;

    try {
      setPortalLoading(true);
      setError(null);

      const res = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const bodyText = await res.text();
      if (!res.ok) {
        let msg = "Errore nell'apertura del portale Stripe.";
        try {
          const parsed = JSON.parse(bodyText);
          if (parsed && typeof parsed.error === "string") {
            msg = parsed.error;
          }
        } catch {
          /* lascia il messaggio generico */
        }
        setError(msg);
        return;
      }

      const data = JSON.parse(bodyText) as { url?: string };
      if (!data.url) {
        setError("URL portale Stripe mancante nella risposta del server.");
        return;
      }

      window.location.href = data.url;
    } catch (e: any) {
      console.error(e);
      setError(
        e?.message ?? "Errore imprevisto nell'apertura del portale Stripe."
      );
    } finally {
      setPortalLoading(false);
    }
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 480,
    margin: "40px auto",
    padding: 24,
    borderRadius: 16,
    border: "1px solid #1f2937",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: 16,
    padding: "10px 16px",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: "#22c55e",
    color: "#022c22",
    width: "100%",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#1f2937",
    color: "#9ca3af",
    cursor: "not-allowed",
  };

  if (loading) {
    return <p style={{ padding: 24 }}>Caricamento account...</p>;
  }

  if (error) {
    return (
      <div style={cardStyle}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Account</h1>
        <p style={{ color: "#f87171" }}>{error}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={cardStyle}>
        <h1 style={{ fontSize: 20, marginBottom: 12 }}>Account</h1>
        <p>Devi effettuare il login per vedere questa pagina.</p>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Il tuo account</h1>
      <p style={{ marginBottom: 8 }}>
        <strong>Email:</strong> {user.email}
      </p>
      <p style={{ marginBottom: 8 }}>
        <strong>Stato piano:</strong>{" "}
        {user.isPro ? "IFindItForYou PRO" : "Free"}
      </p>

      {user.isPro ? (
        <>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
            Puoi gestire l&apos;abbonamento (carta, fatture, annullamento) dal
            portale sicuro di Stripe.
          </p>
          <button
            type="button"
            onClick={handleOpenPortal}
            style={portalLoading ? disabledButtonStyle : buttonStyle}
            disabled={portalLoading}
          >
            {portalLoading
              ? "Apertura portale Stripe..."
              : "Gestisci abbonamento"}
          </button>
        </>
      ) : (
        <>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
            Attualmente sei sul piano Free. Puoi passare a PRO dalla pagina
            dedicata.
          </p>
          <a href="/pro" style={{ ...buttonStyle, textAlign: "center" }}>
            Vai alla pagina PRO
          </a>
        </>
      )}

      {error && (
        <p style={{ marginTop: 12, color: "#f87171", fontSize: 13 }}>{error}</p>
      )}
    </div>
  );
}
