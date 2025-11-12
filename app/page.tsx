"use client";

import { useState } from "react";

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [summary, setSummary] = useState("");

  const handleSearch = async (plan: "free" | "pro") => {
    if (!query.trim()) return;
    setLoading(true);
    setResults([]);
    setSummary("");

    try {
      const res = await fetch("/api/finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, plan }),
      });
      const data = await res.json();
      setResults(data.items || []);
      setSummary(data.summary || "");
    } catch (err) {
      setSummary("⚠️ Errore nella ricerca. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-start gap-16 py-20 px-6">
      {/* HERO */}
      <section className="max-w-4xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-600 bg-clip-text text-transparent">
          Trova l’introvabile
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8">
          L’IA che scova ciò che gli altri non vedono. <br />
          Scrivi cosa cerchi — noi interroghiamo motori specializzati, IA private e marketplace nascosti per trovartelo prima di chiunque altro.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Es. orologio Casio vintage blu 1990"
            className="w-full md:w-2/3 px-5 py-3 rounded-full bg-slate-900 border border-slate-700 focus:border-fuchsia-500 outline-none text-slate-100"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleSearch("free")}
              disabled={loading}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 px-5 py-3 rounded-full font-semibold disabled:opacity-50"
            >
              {loading ? "Cerco..." : "🔍 Cerca gratis"}
            </button>
            <button
              onClick={() => handleSearch("pro")}
              disabled={loading}
              className="bg-slate-800 border border-fuchsia-500 hover:bg-fuchsia-800 px-5 py-3 rounded-full font-semibold disabled:opacity-50"
            >
              ⚡ Ricerca Pro
            </button>
          </div>
        </div>

        <p className="text-sm text-slate-400 mt-4">
          ⏱️ Vuoi guadagnare tempo? Lascia che l’AI Pro cerchi per te.
        </p>
      </section>

      {/* RISULTATI */}
      <section className="max-w-3xl w-full">
        {loading && <p className="text-center text-slate-400">Ricerca in corso...</p>}
        {!loading && results.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xl font-semibold mb-3">Ecco cosa ho trovato:</h3>
            {results.map((r, i) => (
              <a
                key={i}
                href={r.url}
                target="_blank"
                className="block bg-slate-900 border border-slate-700 hover:border-fuchsia-500 transition rounded-xl p-4"
              >
                <div className="font-semibold text-fuchsia-400">{r.title}</div>
                <div className="text-slate-400 text-sm mt-1">
                  {r.price} • {r.source}
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && summary && (
          <p className="mt-6 text-slate-300 text-center whitespace-pre-line">{summary}</p>
        )}
      </section>

      {/* COME FUNZIONA */}
      <section className="max-w-4xl w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-fuchsia-400">Come funziona</h2>
        <div className="grid md:grid-cols-3 gap-8 text-slate-300">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-3xl mb-2">1️⃣</p>
            Scrivi cosa vuoi trovare
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-3xl mb-2">2️⃣</p>
            L’IA esplora marketplace e motori specializzati
          </div>
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
            <p className="text-3xl mb-2">3️⃣</p>
            Ti mostra dove acquistarlo (o ti avvisa appena compare)
          </div>
        </div>
      </section>

      {/* PIANI */}
      <section className="max-w-5xl w-full text-center">
        <h2 className="text-2xl font-bold mb-6 text-fuchsia-400">Piani di ricerca</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">🔹 Free</h3>
            <p className="text-slate-400 text-sm">3 ricerche al giorno su fonti pubbliche</p>
            <p className="mt-4 font-bold">Gratis</p>
          </div>
          <div className="p-6 bg-gradient-to-br from-fuchsia-700 to-purple-800 border border-fuchsia-500 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">⚡ Pro</h3>
            <p className="text-slate-100 text-sm">
              Accesso ai motori IA professionali e ricerca più rapida
            </p>
            <p className="mt-4 font-bold text-white">5 €/mese</p>
          </div>
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-2xl">
            <h3 className="text-lg font-semibold mb-2">💎 Ricerca su misura</h3>
            <p className="text-slate-400 text-sm">
              Lavoro manuale con risposta via email
            </p>
            <p className="mt-4 font-bold">da 3 €</p>
          </div>
        </div>
      </section>

      {/* CTA FINALE */}
      <section className="text-center max-w-3xl mt-10">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-fuchsia-600 bg-clip-text text-transparent">
          Non tutto è perso. Alcune cose vanno solo ritrovate.
        </h2>
        <a
          href="#"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="inline-block mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 px-8 py-3 rounded-full font-semibold"
        >
          🔎 Inizia la tua ricerca
        </a>
      </section>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} iFindItForYou — Tutti i diritti riservati
      </footer>
    </main>
  );
}
