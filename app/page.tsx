'use client';

import { useState } from 'react';

const LANGS = [
  { value: 'it', label: 'Italiano' },
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState<'it' | 'en' | 'fr'>('it');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    if (!email || !message) {
      setFeedback({ type: 'err', text: 'Compila email e cosa devo trovare.' });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message,
          lang,
          name: null, // opzionale nel tuo schema
        }),
      });

      if (!res.ok) {
        throw new Error('Errore dal server');
      }

      setFeedback({ type: 'ok', text: 'Ricevuto! Ti scrivo appena ho il link giusto 👍' });
      setMessage('');
    } catch (err) {
      setFeedback({ type: 'err', text: "C'è stato un errore nell'invio. Riprova." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* header */}
      <header className="w-full border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <p className="text-sm text-slate-400">Beta gratuita</p>
          <h1 className="text-4xl font-bold mt-1 tracking-tight">iFindItForYou</h1>
        </div>
      </header>

      {/* main */}
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
          <p className="text-lg text-slate-200">
            Ti mando direttamente il link migliore / l&apos;opzione giusta. Tu scrivi cosa cerchi, io ti rispondo per
            email.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/40 border border-slate-800 rounded-xl p-6">
            {/* email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-100">La tua email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="tu@email.com"
                required
              />
            </div>

            {/* cosa devo trovare */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-100">Cosa ti devo trovare?</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Es. Miglior tool per... / Voli per… / Alternative a… / Come faccio a…"
                required
              />
            </div>

            {/* lingua */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-100">Come vuoi che ti risponda?</label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'it' | 'en' | 'fr')}
                className="w-full md:w-60 rounded-md bg-slate-950 border border-slate-700 px-3 py-2 text-slate-50 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {LANGS.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            {/* bottone */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-violet-500 hover:bg-violet-400 disabled:opacity-70 disabled:cursor-not-allowed text-slate-950 font-semibold px-5 py-2 rounded-md transition"
              >
                {loading ? 'Invio…' : 'Contattami per la soluzione perfetta'}
              </button>
            </div>

            {/* feedback */}
            {feedback && (
              <p
                className={
                  feedback.type === 'ok'
                    ? 'text-sm text-emerald-400'
                    : 'text-sm text-rose-400'
                }
              >
                {feedback.text}
              </p>
            )}
          </form>
        </div>
      </main>

      {/* footer */}
      <footer className="w-full border-t border-slate-800 mt-8">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-wrap gap-4 items-center justify-between text-sm text-slate-400">
          <p>© 2025 iFindItForYou</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white">
              Privacy
            </a>
            <a href="/terms" className="hover:text-white">
              Termini
            </a>
            <a href="/en/privacy" className="hover:text-white">
              EN Privacy
            </a>
            <a href="/en/terms" className="hover:text-white">
              EN Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

