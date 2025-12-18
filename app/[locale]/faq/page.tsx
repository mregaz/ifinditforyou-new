import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const path = "/faq";

  const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

  const languages = locales.reduce<Record<string, string>>((acc, loc) => {
    acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
    return acc;
  }, {});

  return {
    title: "Domande frequenti – iFindItForYou",
    description:
      "Risposte rapide alle domande più frequenti: piano Free, piano PRO, tempi di risposta, pagamenti e sicurezza dei dati.",
    alternates: {
      canonical: canonicalUrl,
      languages,
    },
    openGraph: {
      url: canonicalUrl,
      title: "Domande frequenti – iFindItForYou",
      description:
        "Scopri come funzionano i piani Free e PRO, quali tempi di risposta aspettarsi e come proteggiamo i tuoi dati.",
      siteName: "iFindItForYou",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Domande frequenti – iFindItForYou",
      description:
        "Tutte le risposte sulle ricerche, sui piani e sulla privacy di iFindItForYou.",
    },
  };
}

export default function FaqPage() {
  return (
    <LegalPageShell
      title="Domande frequenti (FAQ)"
      sections={[
        {
          title: "Introduzione",
          body: (
            <p>
              Qui trovi le risposte alle domande più comuni su come funziona
              iFindItForYou, quali piani sono disponibili e come vengono gestiti
              i pagamenti e i tuoi dati.
            </p>
          ),
        },
      ]}
      faqTitle="Domande frequenti"
      faq={[
        {
          q: "1. Come funziona esattamente iFindItForYou?",
          a: (
            <p>
              Tu descrivi il prodotto o il servizio che ti serve (contesto,
              vincoli, budget), noi combiniamo ricerca manuale e AI per esplorare
              il web, filtrare le opzioni inutili e proporti solo una selezione
              breve, ragionata e spiegata. Non siamo un comparatore automatico:
              c&apos;è sempre una componente umana nella ricerca.
            </p>
          ),
        },
        {
          q: "2. Qual è la differenza tra piano Free e piano PRO?",
          a: (
            <p>
              Con il piano Free puoi inviare un numero limitato di richieste e
              ricevi una risposta quando c&apos;è disponibilità. Il piano PRO ti
              dà più richieste, priorità nella coda, risposte più approfondite e
              supporto dedicato. È pensato per chi usa il servizio con continuità
              o per lavoro.
            </p>
          ),
        },
        {
          q: "3. In quanto tempo riceverò una risposta?",
          a: (
            <p>
              Dipende dal carico di richieste e dalla complessità della ricerca.
              In generale una richiesta semplice viene gestita entro poche ore
              lavorative. Le ricerche più complesse possono richiedere più tempo.
              Gli utenti PRO hanno priorità rispetto agli utenti Free.
            </p>
          ),
        },
        {
          q: "4. Che tipo di prodotti o servizi potete cercare?",
          a: (
            <p>
              Possiamo aiutarti a trovare prodotti fisici (elettronica,
              attrezzature, forniture, ecc.) e in alcuni casi anche servizi
              online. Non copriamo ambiti che richiedono consulenza legale,
              fiscale o medica: in quei casi ti consigliamo sempre di rivolgerti
              a un professionista abilitato.
            </p>
          ),
        },
        {
          q: "5. Come vengono gestiti i miei dati?",
          a: (
            <p>
              Usiamo le informazioni che ci fornisci solo per eseguire la tua
              richiesta e migliorare il servizio in forma aggregata e anonima.
              Non vendiamo i tuoi dati a terzi e non li utilizziamo per pubblicità
              invasiva. Puoi trovare tutti i dettagli nella nostra Informativa
              sulla privacy.
            </p>
          ),
        },
      ]}
    />
  );
}
