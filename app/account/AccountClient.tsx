"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserInfo = {
  email: string;
  isPro: boolean;
  preferredLanguage?: string | null;
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

type SubscriptionStatus =
  | { plan: "free" }
  | { plan: "pro"; status?: string; renewsAt?: number };

export default function AccountClient({ user }: Props) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [searches, setSearches] = useState<Search[]>([]);
  const [searchesLoading, setSearchesLoading] = useState(false);

  // nuovo: piano da Stripe
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(
    null
  );

  // nuovo: lingua preferita
  const [preferredLanguage, setPreferredLanguage] = useState<string>(
    user.preferredLanguage ?? "auto"
  );
  const [savingLanguage, setSavingLanguage] = useState(false);

  // nuovo: cancellazione account
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // 1) Carica ricerche (tuo codice)
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

  // 2) Carica stato abbonamento da /api/subscription-status
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const res = await fetch("/api/subscription-status");
        if (!res.ok) {
          console.error("Errore nel caricamento del piano");
          return;
        }
        const data = (await res.json()) as SubscriptionStatus;
        setSubscription(data);
      } catch (e) {
        console.error("Errore subscription-status", e);
      }
    };

    loadSubscription();
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

  const handleDeleteSearch = async (id: string) => {
    try {
      setError(null);
      const res = await fetch("/api/my-searches/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const bodyText = await res.text();
      if (!res.ok) {
        let msg = "Errore nella cancellazione della ricerca.";
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
      setSearches((prev) => prev.filter((s) => s.id !== id));
    } catch (e: any) {
      console.error(e);
      setError(
        e?.message ?? "Errore imprevisto nella cancellazione della ricerca."
      );
    }
  };

  // download JSON/CSV (tuo codice)
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
          JSON.stringify(s.query),
          s.lang,
          s.plan,
          s.created_at,
        ].join(",")
      ),
    ];
    const csv = lines.join("\n");
    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });
    downloadBlob(blob, "my-searches.csv");
  };

  // lingua preferita
  const handleChangeLanguage = async (newValue: string) => {
    try {
      setSavingLanguage(true);
      setError(null);

      const res = await fetch("/api/user/update-preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferredLanguage: newValue === "auto" ? null : newValue,
        }),
      });

      if (!res.ok) {
        setError("Errore nel salvataggio della lingua preferita.");
        return;
      }

      setPreferredLanguage(newValue);
    } catch (e) {
      console.error(e);
      setError("Errore nel salvataggio della lingua preferita.");
    } finally {
      setSavingLanguage(false);
    }
  };

  // cancellazione account
  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") {
      setError('Per confermare devi scrivere "DELETE" nel campo di testo.');
      return;
    }

    try {
      setDeletingAccount(true);
      setError(null);

      const res = await fetch("/api/account/delete", {
        method: "POST",
      });

      if (!res.ok) {
        setError("Errore nella cancellazione definitiva dell'account.");
        return;
      }

      // dopo la cancellazione, torna alla home
      window.location.href = "/";
    } catch (e) {
      console.error(e);
      setError("Errore imprevisto nella cancellazione dell'account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  // stili originali
  const cardStyle: React.CSSProperties = {
    maxWidth: 800,
    margin: "40px auto",
    padding: 24,
    borderRadius: 16,
    border: "1px solid #1f2937",
    backgroundColor: "#020617",
    color: "#e5e7eb",
    fontFamily:
      "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
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

  const dangerButtonStyle: React.CSSProperties = {
    ...secondaryButtonStyle,
    borderColor: "#b91c1c",
    color: "#fecaca",
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#1f2937",
    color: "#9ca3af",
    cursor: "not-allowed",
  };

  const isProEffective =
    (subscription && subscription.plan === "pro") || user.isPro;

  const renewDate =
    subscription &&
    subscription.plan === "pro" &&
    subscription.renewsAt
      ? new Date(subscription.renewsAt).toLocaleDateString("it-CH", {
          dateStyle: "short",
        })
      : null;

  return (
    <div style={cardStyle}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Il tuo account</h1>

      <p style={{ marginBottom: 8 }}>
        <strong>Email:</strong> {user.email}
      </p>

      <p style={{ marginBottom: 8 }}>
        <strong>Stato piano:</strong>{" "}
        {isProEffective ? "IFindItForYou PRO" : "Free"}
      </p>

      {renewDate && (
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
          Rinnovo: {renewDate}
        </p>
      )}

      {isProEffective ? (
        <>
          <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 8 }}>
            Puoi gestire l&apos;abbonamento (carta, fatture, annullamento)
            dal portale sicuro di Stripe.
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
          <a
            href="/pro"
            style={{ ...buttonStyle, textAlign: "center" }}
          >
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

      {/* Ricerche */}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  whiteSpace: "nowrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => handleRepeatSearch(s)}
                  style={secondaryButtonStyle}
                >
                  Rifai ricerca
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteSearch(s.id)}
                  style={dangerButtonStyle}
                >
                  Elimina
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* LINGUA PREFERITA */}
      <hr
        style={{
          borderColor: "#111827",
          margin: "24px 0 16px",
        }}
      />

      <h2 style={{ fontSize: 16, marginBottom: 8 }}>Lingua preferita</h2>
      <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 8 }}>
        Puoi forzare una lingua per l&apos;interfaccia. Se lasci
        &quot;Automatica&quot; useremo le impostazioni del browser.
      </p>

      <select
        value={preferredLanguage}
        onChange={(e) => handleChangeLanguage(e.target.value)}
        style={{
          padding: "8px",
          borderRadius: 8,
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
        }}
      >
        <option value="auto">Automatica</option>
        <option value="it">Italiano</option>
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="es">Español</option>
      </select>

      {savingLanguage && (
        <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
          Salvataggio della lingua in corso...
        </p>
      )}

      {/* ELIMINAZIONE ACCOUNT */}
      <hr
        style={{
          borderColor: "#111827",
          margin: "24px 0 16px",
        }}
      />

      <h2 style={{ fontSize: 16, marginBottom: 8, color: "#fecaca" }}>
        Elimina account
      </h2>
      <p style={{ fontSize: 13, color: "#fca5a5", marginBottom: 8 }}>
        Questa azione è definitiva. Verranno cancellate tutte le tue ricerche
        e i dati associati.
      </p>

      <input
        type="text"
        placeholder='Scrivi "DELETE" per confermare'
        value={deleteConfirm}
        onChange={(e) => setDeleteConfirm(e.target.value)}
        style={{
          marginTop: 4,
          padding: "8px",
          borderRadius: 8,
          border: "1px solid #374151",
          backgroundColor: "#020617",
          color: "#e5e7eb",
          width: "100%",
        }}
      />

      <button
        type="button"
        onClick={handleDeleteAccount}
        disabled={deletingAccount}
        style={{
          ...dangerButtonStyle,
          marginTop: 12,
          width: "100%",
          opacity: deletingAccount ? 0.6 : 1,
        }}
      >
        {deletingAccount
          ? "Eliminazione in corso..."
          : "Elimina definitivamente"}
      </button>

      {error && (
        <p style={{ marginTop: 12, color: "#f87171", fontSize: 13 }}>
          {error}
        </p>
      )}
    </div>
  );
}

