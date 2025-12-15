import LegalPageShell from "@/components/LegalPageShell";

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      updatedAt="14 dicembre 2025"
      sections={[
        {
          title: "1. Dati raccolti",
          body: <p>Spiega in modo semplice quali dati raccogli e perché.</p>,
        },
        {
          title: "2. Finalità",
          body: (
            <ul className="mt-2 space-y-2">
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Fornire il servizio e gestire l’account</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>Gestire pagamenti e sicurezza</span>
              </li>
            </ul>
          ),
        },
      ]}
      faqTitle="Domande frequenti"
      faq={[
        {
          q: "Come gestite i pagamenti?",
          a: <p>I pagamenti sono gestiti da Stripe. Noi non salviamo i dati della carta.</p>,
        },
        {
          q: "Posso cancellare il mio account?",
          a: <p>Sì. Dalla dashboard puoi eliminare l’account (azione irreversibile).</p>,
        },
      ]}
      footerNote={<>Se hai domande, contattaci via email.</>}
    />
  );
}


