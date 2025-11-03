// app/terms/page.tsx

export const metadata = {
  title: "Termini e Condizioni | iFindItForYou",
  description:
    "Leggi i termini e condizioni d'uso del servizio iFindItForYou. Scopri come utilizziamo i dati e quali sono i tuoi diritti come utente.",
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-bold mb-8 text-white">Termini e Condizioni</h1>

      <p className="mb-6 text-gray-300">
        Ultimo aggiornamento: <strong>3 novembre 2025</strong>
      </p>

      <section className="space-y-6">
        <p>
          Benvenuto su <strong>iFindItForYou</strong>! Utilizzando il nostro sito web
          e i servizi associati, accetti i termini e le condizioni qui descritti.
          Ti invitiamo a leggerli attentamente prima di utilizzare la piattaforma.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          1. Scopo del Servizio
        </h2>
        <p>
          iFindItForYou offre un servizio di ricerca e ottimizzazione di contenuti
          informativi. L'obiettivo è fornire risultati accurati e pertinenti in base
          alle preferenze dell’utente.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          2. Utilizzo del Servizio
        </h2>
        <p>
          L’utente si impegna a utilizzare il sito in modo lecito e conforme alle
          normative vigenti. È vietato utilizzare il servizio per attività illegali,
          diffamatorie o dannose per terzi.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          3. Account e Sicurezza
        </h2>
        <p>
          Se il servizio richiede la creazione di un account, l’utente è responsabile
          della riservatezza delle proprie credenziali e di tutte le attività
          svolte tramite l’account stesso.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          4. Proprietà Intellettuale
        </h2>
        <p>
          Tutti i contenuti presenti su questo sito, inclusi testi, immagini, loghi e
          marchi, sono di proprietà di iFindItForYou o dei rispettivi titolari dei
          diritti. È vietata la riproduzione non autorizzata.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          5. Limitazione di Responsabilità
        </h2>
        <p>
          iFindItForYou non garantisce che il servizio sia sempre disponibile o
          privo di errori. In nessun caso potrà essere ritenuto responsabile per
          danni derivanti dall’utilizzo o dall’impossibilità di utilizzo del sito.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          6. Privacy e Protezione dei Dati
        </h2>
        <p>
          Per informazioni su come vengono trattati i tuoi dati personali, consulta
          la nostra{" "}
          <a href="/privacy" className="text-blue-400 underline hover:text-blue-300">
            Informativa sulla Privacy
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          7. Modifiche ai Termini
        </h2>
        <p>
          iFindItForYou si riserva il diritto di modificare i presenti termini in
          qualsiasi momento. Eventuali modifiche saranno pubblicate su questa pagina
          con la data di aggiornamento.
        </p>

        <h2 className="text-2xl font-semibold mt-10 mb-4 text-white">
          8. Contatti
        </h2>
        <p>
          Per qualsiasi domanda riguardante i presenti Termini e Condizioni,
          contattaci all’indirizzo email:{" "}
          <a
            href="mailto:info@ifinditforyou.com"
            className="text-blue-400 underline hover:text-blue-300"
          >
            info@ifinditforyou.com
          </a>
          .
        </p>
      </section>

      <div className="mt-12 text-sm text-gray-400 border-t border-gray-700 pt-6">
        <p>© 2025 iFindItForYou. Tutti i diritti riservati.</p>
      </div>
    </main>
  );
}

