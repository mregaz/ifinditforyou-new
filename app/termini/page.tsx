// app/termini/page.tsx
export default function TerminiPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm text-gray-800">
      <h1 className="mb-6 text-2xl font-semibold">Termini e condizioni d&apos;uso</h1>

      <p className="mb-4 text-xs text-gray-500">
        Ultimo aggiornamento: {new Date().getFullYear()}
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">1. Oggetto del servizio</h2>
        <p className="mb-2">
          IFindItForYou è uno strumento online che aiuta l&apos;utente a trovare
          informazioni e risultati sulla base delle richieste inserite.
        </p>
        <p>
          Il servizio viene fornito &quot;così com&apos;è&quot;, senza garanzia di
          disponibilità continua, accuratezza dei risultati o idoneità per uno
          scopo specifico.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">2. Utilizzo consentito</h2>
        <p className="mb-2">
          L&apos;utente si impegna a utilizzare il servizio in modo lecito e nel
          rispetto delle normative vigenti.
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>è vietato utilizzare il servizio per attività illegali o abusive;</li>
          <li>
            è vietato tentare di aggirare i limiti tecnici o di sicurezza della
            piattaforma;
          </li>
          <li>
            è vietato utilizzare il servizio per inviare spam o contenuti non
            richiesti.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">
          3. Piani Free e PRO, pagamenti
        </h2>
        <p className="mb-2">
          Il piano Free consente un numero limitato di ricerche. Il piano PRO
          consente un utilizzo più esteso del servizio, secondo le condizioni
          indicate nella pagina dedicata.
        </p>
        <p className="mb-2">
          I pagamenti per il piano PRO sono gestiti da Stripe. IFindItForYou non
          memorizza i dati della carta di pagamento dell&apos;utente.
        </p>
        <p>
          L&apos;abbonamento si rinnova automaticamente alla scadenza (mensile o
          annuale, a seconda del piano scelto), salvo annullamento da parte
          dell&apos;utente prima della data di rinnovo.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">4. Annullamento e rimborsi</h2>
        <p className="mb-2">
          L&apos;utente può annullare il rinnovo dell&apos;abbonamento in qualsiasi
          momento tramite l&apos;area di gestione dei pagamenti fornita da Stripe
          (o i link indicati nelle email di conferma).
        </p>
        <p>
          Salvo diverse indicazioni di legge, i pagamenti già effettuati non sono
          normalmente rimborsabili, ma l&apos;utente continuerà a godere del piano
          PRO fino alla fine del periodo già pagato.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">5. Limitazione di responsabilità</h2>
        <p className="mb-2">
          Nei limiti massimi consentiti dalla legge applicabile, IFindItForYou non
          è responsabile per:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>eventuali errori, imprecisioni o mancanza di aggiornamento dei risultati;</li>
          <li>eventuali danni indiretti, consequenziali o perdita di dati;</li>
          <li>interruzioni o malfunzionamenti del servizio.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">6. Modifiche ai termini</h2>
        <p>
          I presenti termini possono essere aggiornati nel tempo. In caso di
          modifiche rilevanti, potremmo informare l&apos;utente tramite il sito o
          altri canali appropriati. L&apos;uso continuato del servizio dopo le
          modifiche costituisce accettazione dei nuovi termini.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">7. Contatti</h2>
        <p>
          Per domande sui presenti termini o sul servizio, puoi contattarci
          all&apos;indirizzo e-mail indicato sul sito.
        </p>
      </section>
    </main>
  );
}

