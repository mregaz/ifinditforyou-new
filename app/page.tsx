'use client';

import { useState } from 'react';

export default function Home() {
  // stato per la “ricerca finta” (come il tuo codice vecchio)
  const [q, setQ] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  // stato per il form vero che manda a /api/lead
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState<'it' | 'en' | 'fr'>('it');
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // stessa funzione che avevi tu
  const onSearch = () => {
    if (!q.trim()) return;
    setSearchLoading(true);
    setTimeout(() => {
      setResults([
        `Top 1 per: ${q}`,
        `Alternativa valida per: ${q}`,
        'Scelta premium',
      ]);
      setSearchLoading(false);
    }, 500);
  };

  // nuovo: invio al backend vero
  const onSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!email.trim() || !message.trim()) {
      setFeedback({ type: 'err', text: 'Compila email e cosa ti devo trovare.' });
      return;
    }

    setSending(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          message,
          lang,
          name: null,
        }),
      });

      if (!res.ok) throw new Error('send failed');

      setFeedback({ type: 'ok', text: 'Ricevuto! Ti mando la soluzione via email. 👌' });
      setMessage('');
    } catch (err) {
      setFeedback({ type: 'err', text: "C'è stato un errore nell'invio. Riprova." });
    } finally {
      setSending(false);
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        padding: '2.5rem 1rem 3.5rem',
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ width: 'min(1100px, 100%)' }}>
        {/* HERO + search veloce (il tuo vecchio pezzo) */}
        <div style={{ textAlign: 'center', marginBottom: '2.2rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#cbd5f5' }}>Beta gratuita</p>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginTop: '0.3rem' }}>
            iFindItForYou
          </h1>
          <p style={{ marginTop: '0.7rem', color: '#e2e8f0' }}>
            Tu scrivi cosa cerchi, io ti mando il link/opzione giusta per email.
          </p>

          <div
            style={{
              marginTop: '1.4rem',
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
            }}
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch()}
              placeholder="Cosa vuoi che trovi per te?"
              style={{
                width: 'min(520px, 85vw)',
                padding: '0.8rem 1rem',
                borderRadius: '9999px',
                border: '1px solid rgba(148,163,184,0.4)',
                background: 'rgba(15,23,42,0.35)',
                color: 'white',
              }}
            />
            <button
              onClick={onSearch}
              style={{
                padding: '0.75rem 1.35rem',
                borderRadius: '9999px',
                border: 'none',
                background: '#a855f7',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Trovalo per me
            </button>
          </div>

          <div style={{ marginTop: '1rem', minHeight: '3.2rem' }}>
            {searchLoading ? (
              <p style={{ color: '#94a3b8' }}>Sto cercando per te…</p>
            ) : results.length > 0 ? (
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  maxWidth: '520px',
                  margin: '0.5rem auto 0',
                  textAlign: 'left',
                }}
              >
                {results.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      background: 'rgba(15,23,42,0.35)',
                      border: '1px solid rgba(148,163,184,0.15)',
                      borderRadius: '0.75rem',
                      padding: '0.6rem 0.9rem',
                      marginTop: i === 0 ? 0 : '0.4rem',
                    }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        {/* BLOCCO SOTTO: form vero */}
        <div
          style={{
            background: 'rgba(15,23,42,0.35)',
            border: '1px solid rgba(148,163,184,0.15)',
            borderRadius: '1rem',
            padding: '1.3rem 1.1rem 1.5rem',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>
            Mandami la richiesta per email
          </h2>
          <form onSubmit={onSubmitLead} style={{ display: 'grid', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                La tua email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148,163,184,0.4)',
                  background: '#020617',
                  color: 'white',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                Cosa ti devo trovare?
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Es. Miglior tool per… / Alternative a… / Voli per…"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148,163,184,0.4)',
                  background: '#020617',
                  color: 'white',
                  resize: 'vertical',
                }}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>
                Come vuoi che ti risponda?
              </label>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as any)}
                style={{
                  padding: '0.55rem 0.75rem',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(148,163,184,0.4)',
                  background: '#020617',
                  color: 'white',
                  width: '180px',
                }}
              >
                <option value="it">Italiano</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={sending}
              style={{
                background: '#a855f7',
                border: 'none',
                padding: '0.55rem 0.85rem',
                borderRadius: '0.5rem',
                fontWeight: 600,
                width: 'fit-content',
                cursor: sending ? 'not-allowed' : 'pointer',
                opacity: sending ? 0.7 : 1,
              }}
            >
              {sending ? 'Invio…' : 'Contattami per la soluzione perfetta'}
            </button>

            {feedback && (
              <p
                style={{
                  color: feedback.type === 'ok' ? '#4ade80' : '#f43f5e',
                  fontSize: '0.9rem',
                }}
              >
                {feedback.text}
              </p>
            )}
          </form>
        </div>

        {/* footer semplice */}
        <footer
          style={{
            marginTop: '2.2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            fontSize: '0.82rem',
            color: '#cbd5f5',
          }}
        >
          <p>© 2025 iFindItForYou</p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/privacy" style={{ color: 'white' }}>
              Privacy
            </a>
            <a href="/terms" style={{ color: 'white' }}>
              Termini
            </a>
            <a href="/en/privacy" style={{ color: 'white' }}>
              EN Privacy
            </a>
            <a href="/en/terms" style={{ color: 'white' }}>
              EN Terms
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}

