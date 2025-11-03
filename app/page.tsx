// app/page.tsx
'use client';

import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState<'it' | 'en'>('it');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
          lang,
        }),
      });

      if (!res.ok) {
        throw new Error('Request failed');
      }

      setStatus('success');
      setMessage('');
    } catch (err) {
      setStatus('error');
    } finally {
      setTimeout(() => setStatus('idle'), 4000);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      {/* contenuto */}
      <div className="flex-1 w-full max-w-3xl mx-auto px-4 py-12">
        <p className="text-sm text-slate-400 mb-4">Beta gratuita</p>
        <h1 className="text-4xl font-bold tracking-tight mb-4">iFindItForYou</h1>
        <p className="text-slate-200 mb-10 leading-relaxed">
          Ti mando direttamente il link migliore / l&apos;opzione giusta.
          <br />
          Tu scrivi cosa cerchi, io ti rispondo per email.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-slate-900/40 border border-slate-800 rounded-2xl p-6"
        >
          {/* email */}
          <div>
            <label className="block text-sm mb-2">La tua email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* cosa devo trovare */}
          <div>
            <label className="block text-sm mb-2">Cosa ti devo trovare?</label>
            <textarea
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Es. Miglior tool per… / Voli per… / Alternative a…"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-50 outline-none focus:ring-2 focus:ring-indigo-500 resize-y"
            />
          </div>

          {/* lingua */}
          <div>
            <label className="block text-sm mb-2">Come vuoi che ti risponda?</label>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as 'it' | 'en')}
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-slate-50 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="it">Italiano</option>
              <option value="en">English</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full rounded-full bg-indigo-500 hover:bg-indigo-400 transition-colors py-3 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading'
              ? 'Invio in corso...'
              : 'Contattami per la soluzione perfetta'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-emerald-400">
              ✅ Fatto! Ti risponderò all’email che hai inserito.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-rose-400">
              ❌ C’è stato un errore nell’invio. Riprova.
            </p>
          )}
        </form>
      </div>

      {/* footer */}
      <footer className="w-full border-t border-slate-800 py-5 text-center text-sm text-slate-500 flex flex-wrap gap-4 justify-center">
        <span>© {new Date().getFullYear()} iFindItForYou</span>
        <a href="/privacy" className="hover:text-slate-200">
          Privacy
        </a>
        <a href="/terms" className="hover:text-slate-200">
          Termini
        </a>
        <a href="/en/privacy" className="hover:text-slate-200">
          EN Privacy
        </a>
        <a href="/en/terms" className="hover:text-slate-200">
          EN Terms
        </a>
      </footer>
    </main>
  );
}

