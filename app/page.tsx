'use client';

import { useState } from 'react';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [lang, setLang] = useState('it');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message, lang, name: null }),
      });

      if (!res.ok) throw new Error();

      setFeedback({ type: 'ok', text: 'Ricevuto! Ti scrivo appena ho il link giusto 👍' });
      setMessage('');
    } catch (err) {
      setFeedback({ type: 'err', text: "C'è stato un errore nell'invio. Riprova." });
    } finally {
      setLoading(false);
    }
  }

  // stile super basico qui
  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: '#0f172a',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
    flexDirection: 'column',
  };

  const container: React.CSSProperties = {
    width: '100%',
    maxWidth: '900px',
    margin: '0 auto',
    padding: '1.5rem 1rem 3rem',
    flex: 1,
  };

  const card: React.CSSProperties = {
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    borderRadius: '1rem',
    padding: '1.5rem',
    marginTop: '1.5rem',
  };

  const label: React.CSSProperties = {
    fontSize: '0.9rem',
    fontWeight: 500,
    marginBottom: '0.35rem',
    display: 'block',
  };

  const input: React.CSSProperties = {
    width: '100%',
    padding: '0.5rem 0.6rem',
    borderRadius: '0.5rem',
    border: '1px solid #475569',
    background: '#020617',
    color: 'white',
    fontSize: '0.95rem',
  };

  const footer: React.CSSProperties = {
    borderTop: '1px solid rgba(148,163,184,0.15)',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
    flexWrap: 'wrap',
  };

  const link: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
  };

  return (
    <div style={pageStyle}>
      <header style={{ padding: '1.2rem 1rem 0' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', color: '#cbd5f5' }}>Beta gratuita</p>
          <h1 style={{ fontSize: '2.7rem', fontWeight: 700, marginTop: '0.2rem' }}>iFindItForYou</h1>
        </div>
      </header>

      <main style={container}>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.5, marginTop: '1rem' }}>
          Ti mando direttamente il link migliore / l&apos;opzione giusta. Tu scrivi cosa cerchi, io ti rispondo per
          email.
        </p>

        <form onSubmit={handleSubmit} style={card}>
          {/* email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={label}>La tua email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={input}
              placeholder="tu@email.com"
              required
            />
          </div>

          {/* message */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={label}>Cosa ti devo trovare?</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              style={{ ...input, minHeight: '120px', resize: 'vertical' }}
              placeholder="Es. Miglior tool per… / Voli per… / Alternative a… / Come faccio a…"
              required
            />
          </div>

          {/* lang */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={label}>Come vuoi che ti risponda?</label>
            <select value={lang} onChange={(e) => setLang(e.target.value)} style={{ ...input, width: '200px' }}>
              <option value="it">Italiano</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#a855f7',
              border: 'none',
              padding: '0.55rem 1.2rem',
              borderRadius: '0.5rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Invio…' : 'Contattami per la soluzione perfetta'}
          </button>

          {feedback && (
            <p
              style={{
                marginTop: '0.9rem',
                color: feedback.type === 'ok' ? '#34d399' : '#f43f5e',
                fontSize: '0.9rem',
              }}
            >
              {feedback.text}
            </p>
          )}
        </form>
      </main>

      <footer style={footer}>
        <p style={{ color: '#cbd5f5', fontSize: '0.8rem' }}>© 2025 iFindItForYou</p>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
          <a href="/privacy" style={link}>
            Privacy
          </a>
          <a href="/terms" style={link}>
            Termini
          </a>
          <a href="/en/privacy" style={link}>
            EN Privacy
          </a>
          <a href="/en/terms" style={link}>
            EN Terms
          </a>
        </div>
      </footer>
    </div>
  );
}

