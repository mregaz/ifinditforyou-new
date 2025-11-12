"use client";
import { useState, useEffect } from "react";

export default function FinderPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(3); 
  const [purchasing, setPurchasing] = useState(false);

  // Carica crediti salvati
  useEffect(() => {
    const saved = localStorage.getItem("aiCredits");
    if (saved) setCredits(parseInt(saved, 10));
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
      <h1 className="text-3xl font-bold text-center mb-6">
        🔍 IFindItForYou AI
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cerca un prodotto o un'informazione..."
          className="flex-1 border rounded-xl px-4 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded-xl"
        >
          {loading ? "Ricerca..." : "Cerca"}
        </button>
      </form>

      <div className="text-sm text-gray-600 mb-4 flex items-center justify-between">
        <div>
          Crediti rimanenti:{" "}
          <strong>
            {credits > 0 ? `${credits} gratuiti` : "Nessuno (attiva PRO)"}
          </strong>
          <button
            onClick={resetCredits}
            className="ml-2 underline text-blue-600 text-xs"
          >
            (reset)
          </button>
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
