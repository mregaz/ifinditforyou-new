 // app/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

const locale = "it" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  const href = `${baseUrl}${localePathname(loc, path)}`;
  acc[loc] = href;
  return acc;
}, {});

export const metadata: Metadata = {
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

export default function FaqPageIt() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Domande frequenti (FAQ)</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720, marginBottom: 24 }}>
        Qui trovi le risposte alle domande più comuni su come funziona iFindItForYou,
        quali piani sono disponibili e come vengono gestiti i pagamenti e i tuoi dati.
      </p>

      <section style={{ maxWidth: 720, display: "grid", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1. Come funziona esattamente iFindItForYou?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Tu descrivi il prodotto o il servizio che ti serve (contesto, vincoli, budget),
            noi combiniamo ricerca manuale e AI per esplorare il web, filtrare le opzioni
            inutili e proporti solo una selezione breve, ragionata e spiegata. Non siamo
            un comparatore automatico: c&apos;è sempre una componente umana nella ricerca.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2. Qual è la differenza tra piano Free e piano PRO?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Con il piano Free puoi inviare un numero limitato di richieste e ricevi una
            risposta quando c&apos;è disponibilità. Il piano PRO ti dà più richieste,
            priorità nella coda, risposte più approfondite e supporto dedicato. È pensato
            per chi usa il servizio con continuità o per lavoro.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3. In quanto tempo riceverò una risposta?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Dipende dal carico di richieste e dalla complessità della ricerca. In generale
            una richiesta semplice viene gestita entro poche ore lavorative. Le ricerche
            più complesse possono richiedere più tempo. Gli utenti PRO hanno priorità
            rispetto agli utenti Free.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            4. Che tipo di prodotti o servizi potete cercare?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Possiamo aiutarti a trovare prodotti fisici (elettronica, attrezzature,
            forniture, ecc.) e in alcuni casi anche servizi online. Non copriamo ambiti
            che richiedono consulenza legale, fiscale o medica: in quei casi ti consigliamo
            sempre di rivolgerti a un professionista abilitato.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            5. Come vengono gestiti i miei dati?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Usiamo le informazioni che ci fornisci solo per eseguire la tua richiesta e
            migliorare il servizio in forma aggregata e anonima. Non vendiamo i tuoi dati
            a terzi e non li utilizziamo per pubblicità invasiva. Puoi trovare tutti i
            dettagli nella nostra Informativa sulla privacy.
          </p>
        </div>
      </section>
    </main>
  );
}
