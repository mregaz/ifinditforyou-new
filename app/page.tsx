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
        padding: "32px 16px 60px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 820 }}>
        {/* HERO: titolo + badge PRO */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <h1 style={{ fontSize: 32, fontWeight: 700 }}>
            Trovo per te quello che il resto del web non vede.
          </h1>
          {isPro && (
            <span
              style={{
                background: "#a855f7",
                padding: "4px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: 0.5,
              }}
            >
              PRO
            </span>
          )}
        </div>

        <p
          style={{
            textAlign: "center",
            opacity: 0.8,
            marginBottom: 24,
            fontSize: 15,
          }}
        >
          Prodotti rari, occasioni nascoste, alternative intelligenti. <br />
          Scrivi cosa cerchi, io e l’AI facciamo il lavoro sporco per te.
        </p>

        {/* Form ricerca */}
        <form
          onSubmit={handleSearch}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 8,
            justifyContent: "center",
          }}
        >
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Es. Nikon analogica anni 80 sotto 200 CHF in Europa"
            style={{
              flex: 1,
              minWidth: 0,
              borderRadius: 999,
              padding: "12px 18px",
              border: "1px solid rgba(148,163,184,0.4)",
              background: "rgba(15,23,42,0.9)",
              color: "white",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              borderRadius: 999,
              padding: "12px 20px",
              border: "none",
              background: loading ? "#4b5563" : "#a855f7",
              color: "white",
              fontWeight: 600,
              cursor: loading ? "default" : "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {loading ? "Cerco..." : "Cerca"}
          </button>
        </form>

        <p
          style={{
            fontSize: 12,
            opacity: 0.7,
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          ✨ Hai <strong>{isPro ? "Ricerca PRO attiva" : "3 ricerche gratuite"}</strong>. <br />
          Quando hai una ricerca importante puoi attivare il piano PRO.
        </p>

        {/* Crediti + bottone PRO */}
        <div
          style={{
            fontSize: 13,
            opacity: 0.9,
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            Crediti rimanenti:{" "}
            <strong>{isPro ? "PRO attivo (10 crediti)" : `${credits} gratuiti`}</strong>
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
                padding: "6px 14px",
                border: "none",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {purchasing ? "..." : "💳 Attiva piano PRO"}
            </button>
          )}
        </div>

        {/* Riassunto */}
        {summary && (
          <div
            style={{
              background: "rgba(15,23,42,0.95)",
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
          <div style={{ display: "grid", gap: 10, marginBottom: 28 }}>
            {results.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(15,23,42,0.95)",
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

        {/* --- SEZIONI MARKETING SOTTO --- */}

        {/* Non è l'ennesimo motore IA */}
        <section
          style={{
            marginTop: 16,
            marginBottom: 24,
            padding: "18px 18px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            🔎 Non è l’ennesimo motore di ricerca IA
          </h2>
          <p style={{ opacity: 0.85, fontSize: 14, marginBottom: 10 }}>
            Google, Gemini, ChatGPT… trovano un po’ di tutto.
            <br />
            <strong>iFindItForYou</strong> invece è pensato per:
          </p>
          <ul style={{ fontSize: 14, opacity: 0.9, paddingLeft: 18 }}>
            <li>• cose davvero difficili da trovare</li>
            <li>• offerte nascoste in altri paesi o marketplace minori</li>
            <li>• alternative furbe quando il prodotto che vuoi non esiste più</li>
          </ul>
        </section>

        {/* Come funziona */}
        <section
          style={{
            marginBottom: 24,
            padding: "18px 18px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>⚙️ Come funziona</h2>
          <ol style={{ fontSize: 14, opacity: 0.9, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>
              <strong>1. Scrivi cosa ti serve</strong> — più dettagli dai
              (budget, colore, paese…), meglio posso aiutarti.
            </li>
            <li>
              <strong>2. L’AI fa una prima ricerca intelligente</strong> — filtra
              marketplace, siti di nicchia, comparatori.
            </li>
            <li>
              <strong>3. Se non basta, entro in gioco io</strong> — con il piano
              PRO cerco manualmente e ti mando i migliori risultati.
            </li>
          </ol>
        </section>

        {/* Free vs PRO */}
        <section
          style={{
            marginBottom: 24,
            padding: "18px 18px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>
            💳 Free o PRO? Decidi tu quanto tempo vuoi risparmiare.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
              fontSize: 14,
            }}
          >
            <div
              style={{
                borderRadius: 14,
                padding: "12px 14px",
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(148,163,184,0.4)",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: 6 }}>Free (3 ricerche)</h3>
              <ul style={{ opacity: 0.9, paddingLeft: 18 }}>
                <li>• 3 ricerche AI base</li>
                <li>• Suggerimenti di prodotti / link utili</li>
                <li>• Nessuna ricerca manuale dedicata</li>
                <li>• Nessun supporto via email</li>
              </ul>
            </div>

            <div
              style={{
                borderRadius: 14,
                padding: "12px 14px",
                background: "rgba(30,64,175,0.4)",
                border: "1px solid rgba(129,140,248,0.7)",
              }}
            >
              <h3 style={{ fontWeight: 600, marginBottom: 6 }}>PRO (10 crediti)</h3>
              <ul style={{ opacity: 0.95, paddingLeft: 18 }}>
                <li>• Ricerca IA potenziata</li>
                <li>• Ricerca manuale personalizzata sui casi complessi</li>
                <li>• Risposta curata via email</li>
                <li>• Priorità sulle richieste</li>
              </ul>
              <p style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>
                Ideale per prodotti rari, grossi acquisti o quando non hai tempo
                di cercare da solo.
              </p>
            </div>
          </div>
        </section>

        {/* Cosa ricevi */}
        <section
          style={{
            marginBottom: 24,
            padding: "18px 18px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>
            📦 Cosa ricevi quando fai una richiesta?
          </h2>
          <ul style={{ fontSize: 14, opacity: 0.9, paddingLeft: 18, lineHeight: 1.6 }}>
            <li>• Una lista di link con prodotti che rispettano i tuoi criteri</li>
            <li>• Note su pro e contro delle varie opzioni</li>
            <li>• Alternative creative se il prodotto non esiste o è introvabile</li>
            <li>• Con il piano PRO, una email riassuntiva con la mia raccomandazione</li>
          </ul>
        </section>

        {/* Chi c'è dietro */}
        <section
          style={{
            padding: "18px 18px",
            borderRadius: 16,
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(148,163,184,0.35)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 10 }}>👋 Chi c’è dietro iFindItForYou</h2>
          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 8, lineHeight: 1.6 }}>
            Sono Mauro, vivo in Svizzera e per lavoro e passione passo ore a cercare
            prodotti, occasioni e soluzioni furbe online.
          </p>
          <p style={{ fontSize: 14, opacity: 0.9, lineHeight: 1.6 }}>
            Ho creato <strong>iFindItForYou</strong> per mettere questa “ossessione da
            ricerca” al servizio di chi non ha tempo o voglia di sbattersi.
            <br />
            Obiettivo: farti risparmiare <strong>tempo</strong> e <strong>soldi</strong>,
            non solo mostrarti la prima pagina di Google.
          </p>
        </section>
      </div>
    </main>
  );
}
