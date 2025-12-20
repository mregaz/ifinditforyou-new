 import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Informativa sulla privacy | iFindItForYou",
  description:
    "Informazioni su come iFindItForYou tratta i dati personali e le ricerche degli utenti.",
};

export default function PrivacyPageIt() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Informativa sulla privacy</h1>

      <p className="mb-4 text-sm text-slate-600">
        Ultimo aggiornamento: <strong>3 novembre 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          In questa pagina descriviamo come <strong>iFindItForYou</strong>{" "}
          raccoglie e utilizza i dati personali degli utenti che utilizzano il
          servizio.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. Titolare del trattamento
        </h2>
        <p>
          Il titolare del trattamento è il gestore del servizio iFindItForYou.
          I dati di contatto sono indicati nella pagina dei contatti del sito.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          2. Tipologie di dati trattati
        </h2>
        <p>
          Quando utilizzi il servizio possiamo trattare le seguenti categorie di
          dati:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>dati anagrafici di base (es. indirizzo email);</li>
          <li>
            contenuto delle richieste che inserisci nel campo di ricerca;
          </li>
          <li>
            dati tecnici di navigazione (es. indirizzo IP, tipo di browser,
            log di utilizzo) raccolti in forma automatizzata.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          3. Finalità del trattamento
        </h2>
        <p>I dati vengono trattati per le seguenti finalità:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>erogare il servizio di ricerca richiesto dall’utente;</li>
          <li>
            gestire l’account, i piani Free e PRO e la fatturazione tramite
            Stripe;
          </li>
          <li>
            migliorare il servizio e analizzare in forma aggregata l’utilizzo
            della piattaforma;
          </li>
          <li>
            adempiere ad obblighi di legge e rispondere a richieste delle
            autorità competenti.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          4. Base giuridica del trattamento
        </h2>
        <p>
          Il trattamento dei dati si basa principalmente sull&apos;esecuzione
          del contratto (art. 6, par. 1, lett. b GDPR) e sul legittimo interesse
          del titolare a migliorare il servizio (art. 6, par. 1, lett. f GDPR).
          Nei casi in cui è richiesto il consenso, ti verrà chiesto in modo
          esplicito.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5. Conservazione dei dati
        </h2>
        <p>
          I dati vengono conservati per il tempo necessario a fornire il
          servizio e a rispettare gli obblighi di legge. Le ricerche possono
          essere anonimizzate o aggregate per finalità statistiche.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Condivisione con terze parti
        </h2>
        <p>
          Possiamo condividere alcuni dati con fornitori terzi che ci aiutano a
          erogare il servizio, ad esempio:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>fornitore di pagamenti (Stripe);</li>
          <li>fornitore di infrastruttura e hosting;</li>
          <li>strumenti di analisi e monitoraggio in forma aggregata.</li>
        </ul>
        <p>
          Questi soggetti trattano i dati in qualità di responsabili del
          trattamento secondo accordi conformi al GDPR.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Diritti dell&apos;interessato
        </h2>
        <p>
          Ai sensi della normativa applicabile puoi esercitare i diritti di
          accesso, rettifica, cancellazione, limitazione, opposizione e
          portabilità dei dati, nei limiti previsti dalla legge. Per esercitare
          tali diritti puoi contattarci all&apos;indirizzo indicato nella
          pagina dei contatti.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          8. Modifiche alla presente informativa
        </h2>
        <p>
          La presente informativa può essere aggiornata nel tempo. In caso di
          modifiche rilevanti ti informeremo tramite il sito o via email.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Tutti i diritti riservati.
      </div>
    </main>
  );
}

