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

useEffect(() => {
  const savedCredits = localStorage.getItem("aiCredits");
  const savedPlan = localStorage.getItem("ai_plan");

  if (savedCredits) {
    const c = parseInt(savedCredits, 10);
    setCredits(c);

    // se ha 10 crediti, allora è PRO
    if (c >= 10) setIsPro(true);
  }

  if (savedPlan === "pro") {
    setIsPro(true);
  }
}, []);


  // Salva crediti
  useEffect(() => {
    localStorage.setItem("aiCredits", credits.toString());
  }, [credits]);

  // Cerca
  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return alert("Scrivi una domanda o ricerca qualcosa!");

    if (credits <= 0) {
      alert("Hai esaurito le 3 ricerche gratuite. Attiva il piano PRO.");
      return;
    }

    setLoading(true);
    setResults([]);
    setSummary("");

    const plan = credits > 0 ? "free" : "pro";

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
        if (plan === "free") setCredits((c) => c - 1);
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

  // 🔥 Acquista piano PRO
  async function handleBuyPro() {
    try {
      setPurchasing(true);
      window.location.href = "/api/pay"; 
    } finally {
      setPurchasing(false);
    }
  }

  // Reset crediti
  function resetCredits() {
    if (confirm("Vuoi ripristinare i crediti gratuiti?")) {
      setCredits(3);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
   <div className="flex justify-center items-center gap-3 mb-6">
  <h1 className="text-3xl font-bold">🔍 IFindItForYou AI</h1>

  {isPro && (
    <span
      style={{
        background: "#a855f7",
        padding: "4px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 700,
        color: "white",
        letterSpacing: 0.5,
      }}
    >
      PRO
    </span>
  )}
</div>


        {credits <= 0 && (
          <button
            onClick={handleBuyPro}
            disabled={purchasing}
            className="bg-green-600 text-white text-xs px-3 py-1 rounded-lg hover:bg-green-700"
          >
            {purchasing ? "Reindirizzamento..." : "💳 Attiva piano PRO"}
          </button>
        )}
      </div>

      {summary && (
        <div className="bg-gray-100 p-3 rounded-lg mb-4">{summary}</div>
      )}

      {results.length > 0 && (
        <ul className="space-y-2">
          {results.map((r, i) => (
            <li
              key={i}
              className="border rounded-lg p-3 hover:bg-gray-50 transition"
            >
              <a href={r.url} target="_blank" className="font-semibold text-blue-700">
                {r.title}
              </a>
              <p className="text-sm text-gray-500">
                {r.source} — {r.price}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
