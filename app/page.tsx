// app/page.tsx
"use client";

import { useState } from "react";

export default function HomePage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [lang, setLang] = useState<"it" | "en">("it");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, message, lang }),
      });

      if (res.ok) {
        setStatus("ok");
        setMessage("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* top bar */}
      <header className="border-b border-slate-800/60 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="text-sm text-slate-300">Beta gratuita</div>
        </div>
      </header>

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            iFindItForYou
          </h1>
          <p className="mt-4 text-lg text-slate-300 max-w-2xl">
            Ti mando direttamente il link migliore / l’opzione giusta. Tu scrivi
            cosa cerchi, io ti rispondo per email.
          </p>

          <div className="mt-10 bg-slate-900/40 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-lg max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  La tua email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/40 border border-slate-700 px-3 py-2 outline-none focus:border-indigo-400"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cosa ti devo trovare?
                </label>
                <textarea
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/40 border border-slate-700 px-3 py-2 outline-none focus:border-indigo-400 min-h-[110px]"
                  placeholder="Es. Miglior tool per… / Voli per… / Alternative a…"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Come vuoi che ti risponda?
                </label>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as "it" | "en")}
                  className="w-full rounded-lg bg-slate-950/40 border border-slate-700 px-3 py-2 outline-none focus:border-indigo-400"
                >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex items-center justify-center rounded-full bg-indigo-500 hover:bg-indigo-400 transition px-6 py-2 font-semibold disabled:opacity-60"
              >
                {status === "loading"
                  ? "Invio in corso..."
                  : "Contattami per la soluzione perfetta"}
              </button>

              {status === "ok" && (
                <p className="text-sm text-emerald-400">
                  ✅ Messaggio ricevuto! Ti scrivo appena possibile.
                </p>
              )}
              {status === "error" && (
                <p className="text-sm text-rose-400">
                  C’è stato un errore nell’invio. Riprova.
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 mt-10">
        <div className="mx-auto max-w-6xl px-4 py-6 text-sm flex items-center gap-4 text-slate-400">
          <span>© {new Date().getFullYear()} iFindItForYou</span>
          <a href="/privacy" className="hover:text-slate-100 underline">
            Privacy
          </a>
          <a href="/terms" className="hover:text-slate-100 underline">
            Termini
          </a>
          <a href="/en/privacy" className="hover:text-slate-100 underline ml-auto">
            EN Privacy
          </a>
          <a href="/en/terms" className="hover:text-slate-100 underline">
            EN Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
