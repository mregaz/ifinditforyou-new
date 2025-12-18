import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/LegalPageShell";

export const metadata: Metadata = {
  title: "Termini e Condizioni | iFindItForYou",
  description:
    "Leggi i termini e condizioni d'uso del servizio iFindItForYou. Scopri come utilizziamo i dati e quali sono i tuoi diritti come utente.",
};

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <LegalPageShell
      title="Termini e Condizioni"
      updatedAt="3 novembre 2025"
      sections={[
        {
          title: "Introduzione",
          body: (
            <p>
              Benvenuto su <strong>iFindItForYou</strong>! Utilizzando il nostro
              sito web e i servizi associati, accetti i termini e le condizioni
              qui descritti. Ti invitiamo a leggerli attentamente prima di
              utilizzare la piattaforma.
            </p>
          ),
        },
        {
          title: "1. Scopo del Servizio",
          body: (
            <p>
              iFindItForYou offre un servizio di ricerca e ottimizzazione di
              contenuti informativi. L&apos;obiettivo è fornire risultati accurati e
              pertinenti in base alle preferenze dell’utente.
            </p>
          ),
        },
        {
          title: "2. Utilizzo del Servizio",
          body: (
            <p>
              L’utente si impegna a utilizzare il sito in modo lecito e conforme
              alle normative vigenti. È vietato utilizzare il servizio per
              attività illegali, diffamatorie o dannose per terzi.
            </p>
          ),
        },
        {
          title: "3. Account e Sicurezza",
          body: (
            <p>
              Se il servizio richiede la creazione di un account, l’utente è
              responsabile della riservatezza delle proprie credenziali e di
              tutte le attività svolte tramite l’account stesso.
            </p>
          ),
        },
        {
          title: "4. Proprietà Intellettuale",
          body: (
            <p>
              Tutti i contenuti presenti su questo sito, inclusi testi, immagini,
              loghi e marchi, sono di proprietà di iFindItForYou o dei rispettivi
              titolari dei diritti. È vietata la riproduzione non autorizzata.
            </p>
          ),
        },
        {
          title: "5. Limitazione di Responsabilità",
          body: (
            <p>
              iFindItForYou non garantisce che il servizio sia sempre disponibile
              o privo di errori. In nessun caso potrà essere ritenuto responsabile
              per danni derivanti dall’utilizzo o dall’impossibilità di utilizzo
              del sito.
            </p>
          ),
        },
        {
          title: "6. Privacy e Protezione dei Dati",
          body: (
            <p>
              Per informazioni su come vengono trattati i tuoi dati personali,
              consulta la nostra{" "}
              <Link
                href={`/${locale}/privacy`}
                className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Informativa sulla Privacy
              </Link>
              .
            </p>
          ),
        },
        {
          title: "7. Modifiche ai Termini",
          body: (
            <p>
              iFindItForYou si riserva il diritto di modificare i presenti termini
              in qualsiasi momento. Eventuali modifiche saranno pubblicate su
              questa pagina con la data di aggiornamento.
            </p>
          ),
        },
        {
          title: "8. Contatti",
          body: (
            <p>
              Per qualsiasi domanda riguardante i presenti Termini e Condizioni,
              contattaci all’indirizzo email:{" "}
              <a
                href="mailto:info@ifinditforyou.com"
                className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                info@ifinditforyou.com
              </a>
              .
            </p>
          ),
        },
      ]}
      footerNote={`© ${new Date().getFullYear()} iFindItForYou. Tutti i diritti riservati.`}
    />
  );
}
