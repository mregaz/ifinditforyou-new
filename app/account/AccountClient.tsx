"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserInfo = {
  email: string;
  isPro: boolean;
};

type Search = {
  id: string;
  query: string;
  lang: string;
  plan: string;
  created_at: string;
};

type Props = {
  user: UserInfo;
};

export default function AccountClient({ user }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const [searches, setSearches] = useState<Search[]>([]);
  const [searchesLoading, setSearchesLoading] = useState(false);

  const router = useRouter();

  // Carica le ricerche alla prima render
  useEffect(() => {
    const loadSearches = async () => {
      try {
        setSearchesLoading(true);
        setError(null);

        const res = await fetch("/api/my-searches?limit=100");
        const bodyText = await res.text();

        if (!res.ok) {
          let msg = "Errore nel caricamento delle ricerche.";
          try {
            const parsed = JSON.parse(bodyText);
            if (parsed && typeof parsed.error === "string") {
              msg = parsed.error;
            }
          } catch {
            /* lascia msg generico */
          }
          setError(msg);
          return;
        }

        const json = JSON.parse(bodyText) as {
          searches?: Search[];
        };

        setSearches(json.searches ?? []);
      } catch (e: any) {
        console.error(e);
        setError("Errore imprevisto nel caricamento delle ricerche.");
      } finally {
        setSearchesLoading(false);
      }
    };

    loadSearches();
  }, []);

  const handleOpenPortal = async () => {
    if (!user.email) return;

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

  const handleRepeatSearch = (s: Search) => {
    const params = new URLSearchParams();
    params.set("q", s.query);
    if (s.lang) {
      params.set("lang", s.lang);
    }
    router.push(`/?${params.toString()}`);
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(searches, null, 2)], {
      type: "application/json",
    });
    downloadBlob(blob, "my-searches.json");
  };

  const handleDownloadCsv = () => {
    const header = ["id", "query", "lang", "plan", "created_at"];
    const lines = [
      header.join(","),
      ...searches.map((s) =>
        [
          s.id,
          JSON.stringify(s.query), // per gestire virgole/virgolette
          s.lang,
          s.plan,
          s.created_at,
        ].join(",")
      ),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    downloadBlob(blob, "my-searches.csv");
  };

  const cardStyle: React.CSSProperties = {
    maxWidth: 800,
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

  const secondaryButtonStyle: React.CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #374151",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 12,
    backgroundColor: "#020617",
    color: "#e5e7eb",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#1f2937",
    color: "#9ca3af",
    cursor: "not-allowed",
  };

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

      <hr
        style={{
          borderColor: "#111827",
          margin: "24px 0 16px",
        }}
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Le tue ricerche</h2>
        {searches.length > 0 && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={handleDownloadJson}
              style={secondaryButtonStyle}
            >
              Scarica JSON
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              style={secondaryButtonStyle}
            >
              Scarica CSV
            </button>
          </div>
        )}
      </div>

      {searchesLoading && (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Caricamento ricerche...
        </p>
      )}

      {!searchesLoading && searches.length === 0 && (
        <p style={{ fontSize: 13, color: "#9ca3af" }}>
          Nessuna ricerca salvata al momento.
        </p>
      )}

      {!searchesLoading && searches.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            marginTop: 8,
            maxHeight: 320,
            overflowY: "auto",
          }}
        >
          {searches.map((s) => (
            <li
              key={s.id}
              style={{
                borderTop: "1px solid #111827",
                padding: "8px 0",
                fontSize: 13,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontWeight: 500,
                  }}
                  title={s.query}
                >
                  {s.query}
                </div>
                <div style={{ color: "#9ca3af", fontSize: 12 }}>
                  {s.lang} · {s.plan} ·{" "}
                  {new Date(s.created_at).toLocaleString("it-CH", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => handleRepeatSearch(s)}
                  style={secondaryButtonStyle}
                >
                  Rifai ricerca
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p style={{ marginTop: 12, color: "#f87171", fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}



