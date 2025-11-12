"use client";
import { useState, useEffect } from "react";

export default function FinderPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(3);
  const [purchasing, setPurchasing] = useState(false);
  const [isPro, setIsPro] = useState(false);

  // Carica stato iniziale
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedCredits = localStorage.getItem("aiCredits");
    const savedPlan = localStorage.getItem("ai_plan");

    if (savedCredits) {
      const c = parseInt(savedCredits, 10);
      if (!isNaN(c)) {
        setCredits(c);
        if (c >= 10) setIsPro(true);
      }
    }

    if (savedPlan === "pro") {
      setIsPro(true);
    }
  }, []);

  // Salva crediti
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("aiCredits", credits.toString());
  }, [credits]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      alert("Scrivi una domanda o ricerca qualcosa!");
      return;
    }

    if (credits <= 0 && !isPro) {
      alert("Hai esaurito le 3 ricerche gratuite. Attiva il piano PRO per continuare.");
      return;
    }

    setLoading(true);
    setResults([]);
    setSummary("");

    const plan: "free" | "pro" = isPro ? "pro" : "free";

    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, plan }),
      });

      const data = await res.json();

      if (res.ok) {
        setResults(data.items || []);
        setSummary(data.summary || "");
        if (!isPro) {
          setCredits((c) => c - 1);
        }
      } else {
        alert("Errore nella ricerca: " + (data.error || "Server error"));
      }
    } catch (err) {
      console.error(err);
      alert("Errore di rete, riprova più tardi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleBuyPro() {
    try {
      setPurchasing(true);
      window.location.href = "/api/pay";
    } finally {
      setPurchasing(false);
    }
  }

  function resetCredits() {
    if (confirm("Vuoi ripristinare i crediti gratuiti?")) {
      setCredits(3);
      localStorage.setItem("ai_plan", "free");
      setIsPro(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        padding: "32px 16px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 720 }}>
        {/* Titolo + badge PRO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginBottom: 24,
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>🔍 iFindItForYou AI</h1>
          {isPro && (
            <span
              style={{
                background: "#a855f7",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              PRO
            </span>
          )}
        </div>

        {/* Form ricerca */}
        <form
          onSubmit={handleSearch}
          style={{ display: "flex", gap: 8, marginBottom: 12 }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cerca un prodotto o un'informazione..."
            style={{
              flex: 1,
              borderRadius: 999,
              padding: "10px 16px",
              border: "1px solid rgba(148,163,184,0.4)",
              background: "rgba(15,23,42,0.8)",
              color: "white",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              borderRadius: 999,
              padding: "10px 18px",
              border: "none",
              background: loading ? "#4b5563" : "#a855f7",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
            }}
          >
            {loading ? "Cerco..." : "Cerca"}
          </button>
        </form>

        {/* Crediti + bottone PRO */}
        <div
          style={{
            fontSize: 13,
            opacity: 0.9,
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            Crediti rimanenti:{" "}
            <strong>
              {isPro ? "PRO attivo" : `${credits} gratuiti`}
            </strong>
            <button
              onClick={resetCredits}
              style={{
                marginLeft: 8,
                textDecoration: "underline",
                background: "transparent",
                border: "none",
                color: "#60a5fa",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              reset
            </button>
          </div>

          {!isPro && credits <= 0 && (
            <button
              onClick={handleBuyPro}
              disabled={purchasing}
              style={{
                background: "#22c55e",
                color: "black",
                borderRadius: 999,
                padding: "6px 12px",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {purchasing ? "..." : "💳 Attiva PRO"}
            </button>
          )}
        </div>

        {/* Riassunto */}
        {summary && (
          <div
            style={{
              background: "rgba(15,23,42,0.9)",
              borderRadius: 12,
              padding: "12px 16px",
              border: "1px solid rgba(148,163,184,0.4)",
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {summary}
          </div>
        )}

        {/* Risultati */}
        {results.length > 0 && (
          <div style={{ display: "grid", gap: 10 }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(15,23,42,0.9)",
                  borderRadius: 12,
                  padding: "10px 14px",
                  border: "1px solid rgba(148,163,184,0.3)",
                  fontSize: 14,
                }}
              >
                {r.url ? (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: "#60a5fa", fontWeight: 600 }}
                  >
                    {r.title}
                  </a>
                ) : (
                  <div style={{ fontWeight: 600 }}>{r.title}</div>
                )}
                <div style={{ opacity: 0.8, fontSize: 12 }}>
                  {r.source} {r.price && ` — ${r.price}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
