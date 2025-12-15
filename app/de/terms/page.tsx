import LegalPageShell from "@/components/LegalPageShell";

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Termini e Condizioni"
      updatedAt="14 dicembre 2025"
      sections={[
        { title: "1. Oggetto del servizio", body: <p>Descrivi cosa fa il servizio.</p> },
        { title: "2. Account", body: <p>Regole base di uso dell’account.</p> },
        { title: "3. Pagamenti", body: <p>I pagamenti sono gestiti da Stripe.</p> },
        { title: "4. Cancellazione", body: <p>Cancellazione dal portale e fine periodo.</p> },
      ]}
      faq={[
        { q: "Posso cancellare quando voglio?", a: <p>Sì, dal Customer Portal.</p> },
        { q: "Offrite rimborsi?", a: <p>Inserisci qui la tua policy.</p> },
      ]}
      footerNote={<>Per domande legali, contattaci via email.</>}
    />
  );
}

