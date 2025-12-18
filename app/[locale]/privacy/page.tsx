import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Informativa sulla privacy | iFindItForYou",
  description:
    "Informazioni su come iFindItForYou tratta i dati personali e le ricerche degli utenti.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Informativa sulla privacy"
      updatedAt="3 novembre 2025"
      sections={[
        {
          title: "Introduzione",
          body: (
            <p>
              In questa pagina descriviamo come <strong>iFindItForYou</strong>{" "}
              raccoglie e utilizza i dati personali degli utenti che utilizzano
              il servizio.
            </p>
          ),
        },
        {
          title: "1. Titolare del trattamento",
          body: (
            <p>
              Il titolare del trattamento è il gestore del servizio
              iFindItForYou. I dati di contatto sono indicati nella pagina dei
              contatti del sito.
            </p>
          ),
        },
        {
          title: "2. Tipologie di dati trattati",
          body: (
            <>
              <p>
                Quando utilizzi il servizio possiamo trattare le seguenti
                categorie di dati:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>dati anagrafici di base (es. indirizzo email);</li>
                <li>contenuto delle richieste che inserisci nel campo di ricerca;</li>
                <li>
                  dati tecnici di navigazione (es. indirizzo IP, tipo di browser,
                  log di utilizzo) raccolti in forma automatizzata.
                </li>
              </ul>
            </>
          ),
        },
        {
          title: "3. Finalità del trattamento",
          body: (
            <>
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
            </>
          ),
        },
        {
          title: "4. Base giuridica del trattamento",
          body: (
            <p>
              Il trattamento dei dati si basa principalmente sull&apos;esecuzione
              del contratto (art. 6, par. 1, lett. b GDPR) e sul legittimo
              interesse del titolare a migliorare il servizio (art. 6, par. 1,
              lett. f GDPR). Nei casi in cui è richiesto il consenso, ti verrà
              chiesto in modo esplicito.
            </p>
          ),
        },
        {
          title: "5. Conservazione dei dati",
          body: (
            <p>
              I dati vengono conservati per il tempo necessario a fornire il
              servizio e a rispettare gli obblighi di legge. Le ricerche possono
              essere anonimizzate o aggregate per finalità statistiche.
            </p>
          ),
        },
        {
          title: "6. Condivisione con terze parti",
          body: (
            <>
              <p>
                Possiamo condividere alcuni dati con fornitori terzi che ci aiutano
                a erogare il servizio, ad esempio:
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
            </>
          ),
        },
        {
          title: "7. Diritti dell&apos;interessato",
          body: (
            <p>
              Ai sensi della normativa applicabile puoi esercitare i diritti di
              accesso, rettifica, cancellazione, limitazione, opposizione e
              portabilità dei dati, nei limiti previsti dalla legge. Per
              esercitare tali diritti puoi contattarci all&apos;indirizzo indicato
              nella pagina dei contatti.
            </p>
          ),
        },
        {
          title: "8. Modifiche alla presente informativa",
          body: (
            <p>
              La presente informativa può essere aggiornata nel tempo. In caso di
              modifiche rilevanti ti informeremo tramite il sito o via email.
            </p>
          ),
        },
      ]}
      footerNote={`© ${new Date().getFullYear()} iFindItForYou. Tutti i diritti riservati.`}
    />
  );
}
