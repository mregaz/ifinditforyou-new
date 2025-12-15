import LegalPageShell from "@/components/LegalPageShell";

export default function FaqPage() {
  return (
    <LegalPageShell
      title="FAQ"
      updatedAt="14 dicembre 2025"
      sections={[
        {
          title: "Domande frequenti",
          body: <p>Qui trovi le risposte alle domande più comuni.</p>,
        },
      ]}
      faq={[
        { q: "Cos’è IFindItForYou?", a: <p>Descrizione breve del servizio.</p> },
        { q: "Come funziona il piano PRO?", a: <p>Spiega benefici e attivazione.</p> },
        { q: "Come cancello l’abbonamento?", a: <p>Dal Customer Portal Stripe.</p> },
      ]}
      footerNote={<>Se non trovi la risposta, scrivici via email.</>}
    />
  );
}

