export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a0a0a",
        color: "white",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        lineHeight: 1.6,
        maxWidth: "720px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20, textAlign: "center" }}>
        Informativa Privacy & Termini di Servizio
      </h1>

      <p>
        Questo sito, <strong>ifinditforyou.com</strong>, utilizza l’intelligenza artificiale per
        fornire suggerimenti personalizzati in base alle ricerche dell’utente.
      </p>

      <p>
        I dati eventualmente inseriti nel modulo di contatto (es. indirizzo email o messaggio) 
        vengono trattati esclusivamente per rispondere alla tua richiesta e non vengono ceduti 
        a terzi né utilizzati per fini pubblicitari.
      </p>

      <p>
        Durante la fase beta, i dati possono essere conservati temporaneamente nei log del server
        (Vercel) per finalità tecniche e di sicurezza. Puoi richiedere in ogni momento la rimozione
        dei tuoi dati scrivendo a:{" "}
        <a href="mailto:info@ifinditforyou.com" style={{ color: "#8b5cf6" }}>
          info@ifinditforyou.com
        </a>.
      </p>

      <p>
        L’utilizzo del servizio implica l’accettazione di questi termini. Nessuna responsabilità 
        è assunta per eventuali inesattezze nelle risposte generate dall’AI.
      </p>

      <p>
        Ultimo aggiornamento: <strong>Ottobre 2025</strong>.
      </p>

      <p style={{ textAlign: "center", marginTop: 30 }}>
        <a href="/" style={{ color: "#8b5cf6" }}>
          ← Torna alla Home
        </a>
      </p>
    </main>
  );
}

