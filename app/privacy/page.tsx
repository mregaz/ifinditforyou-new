// app/privacy/page.tsx
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 text-sm text-gray-800">
      <main>
  <p style={{ fontStyle: "italic", marginBottom: "1rem" }}>
    L'informativa sulla protezione dei dati è attualmente disponibile solo in italiano.
  </p>
</main>

      <h1 className="mb-6 text-2xl font-semibold">
        Protezione dei dati personali (Privacy)
      </h1>

      <p className="mb-4 text-xs text-gray-500">
        Ultimo aggiornamento: {new Date().getFullYear()}
      </p>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">1. Titolare del trattamento</h2>
        <p>
          Il titolare del trattamento dei dati personali relativi al servizio
          IFindItForYou è la persona o l&apos;entità che gestisce il sito. I dati
          di contatto sono disponibili nella pagina di contatto del sito.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">2. Dati raccolti</h2>
        <p className="mb-2">In funzione dell&apos;uso del servizio, possiamo trattare:</p>
        <ul className="ml-5 list-disc space-y-1">
          <li>
            dati tecnici di navigazione (es. indirizzo IP, log del server, informazioni
            sul browser);
          </li>
          <li>
            dati forniti volontariamente dall&apos;utente (es. indirizzo e-mail, testo
            delle richieste inviate tramite il servizio);
          </li>
          <li>
            dati relativi ai pagamenti per il piano PRO, gestiti da Stripe (IFindItForYou
            non memorizza i dati completi della carta).
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">3. Finalità del trattamento</h2>
        <p className="mb-2">
          I dati vengono trattati per le seguenti finalità principali:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>erogare il servizio di ricerca richiesto dall&apos;utente;</li>
          <li>gestire eventuali piani in abbonamento (Free / PRO);</li>
          <li>garantire sicurezza e prevenire abusi o utilizzi illeciti del servizio;</li>
          <li>rispondere a eventuali richieste di supporto inviate dall&apos;utente.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">
          4. Base giuridica del trattamento
        </h2>
        <p>
          La base giuridica del trattamento è, a seconda dei casi, l&apos;esecuzione di
          un contratto (fornitura del servizio richiesto), l&apos;adempimento di obblighi
          legali e il legittimo interesse del titolare a mantenere la sicurezza e il
          corretto funzionamento del servizio.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">5. Conservazione dei dati</h2>
        <p>
          I dati sono conservati per il tempo strettamente necessario a fornire il
          servizio, adempiere agli obblighi di legge e tutelare i diritti del titolare
          in caso di contenzioso. I log tecnici possono essere conservati per un periodo
          limitato per finalità di sicurezza e manutenzione.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">6. Dati di pagamento</h2>
        <p>
          I pagamenti per il piano PRO sono gestiti da Stripe in qualità di fornitore
          terzo. IFindItForYou non ha accesso ai dati completi della carta di pagamento.
          Per maggiori informazioni, si rimanda all&apos;informativa privacy di Stripe.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">
          7. Diritti dell&apos;utente (es. GDPR)
        </h2>
        <p className="mb-2">
          Nei limiti previsti dalla normativa applicabile (ad esempio il GDPR per gli
          utenti nello Spazio Economico Europeo), l&apos;utente può avere diritto a:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          <li>accedere ai propri dati personali;</li>
          <li>chiederne la rettifica o la cancellazione;</li>
          <li>limitare o opporsi a determinati trattamenti;</li>
          <li>richiedere la portabilità dei dati;</li>
          <li>presentare reclamo all&apos;autorità di controllo competente.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="mb-2 text-base font-semibold">8. Cookie e tecnologie simili</h2>
        <p>
          Il sito può utilizzare cookie tecnici necessari al funzionamento del servizio
          e, se previsto, cookie analitici o di terze parti. Maggiori dettagli possono
          essere forniti in una eventuale cookie policy dedicata.
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-base font-semibold">9. Contatti</h2>
        <p>
          Per domande sulla protezione dei dati personali o per esercitare i tuoi
          diritti, puoi utilizzare i recapiti indicati sul sito.
        </p>
      </section>
    </main>
  );
}

