// app/de/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

const locale = "de" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Häufig gestellte Fragen – iFindItForYou",
  description:
    "Schnelle Antworten zu den Free- und PRO-Plänen, Reaktionszeiten, Zahlungen und Datenschutz.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Häufig gestellte Fragen – iFindItForYou",
    description:
      "Erfahren Sie, wie die Free- und PRO-Pläne funktionieren, welche Antwortzeiten zu erwarten sind und wie Ihre Daten geschützt werden.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Häufig gestellte Fragen – iFindItForYou",
    description:
      "Alle Antworten zu Suchanfragen, Plänen und Datenschutz auf iFindItForYou.",
  },
};

export default function FaqPageDe() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Häufig gestellte Fragen (FAQ)</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720, marginBottom: 24 }}>
        Hier finden Sie Antworten auf die häufigsten Fragen dazu, wie iFindItForYou
        funktioniert, welche Tarife verfügbar sind und wie Zahlungen und Ihre Daten
        gehandhabt werden.
      </p>

      <section style={{ maxWidth: 720, display: "grid", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1. Wie funktioniert iFindItForYou genau?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Sie beschreiben das Produkt oder die Dienstleistung, die Sie benötigen
            (Kontext, Rahmenbedingungen, Budget). Wir kombinieren manuelle Recherche
            und KI, um das Web zu durchsuchen, irrelevante Ergebnisse auszufiltern
            und Ihnen eine kurze, begründete Auswahl zu senden. Wir sind kein
            rein automatisches Vergleichsportal – es gibt immer eine menschliche
            Komponente in der Suche.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2. Was ist der Unterschied zwischen Free- und PRO-Tarif?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Mit dem Free-Tarif können Sie eine begrenzte Anzahl von Anfragen stellen
            und erhalten eine Antwort, wenn Kapazität frei ist. Der PRO-Tarif bietet
            mehr Anfragen, Priorität in der Warteschlange, ausführlichere Antworten
            und persönlichen Support. Er richtet sich an Vielnutzer und
            professionelle Anwender.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3. Wie lange dauert es, bis ich eine Antwort erhalte?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Das hängt vom Anfragevolumen und der Komplexität Ihrer Suche ab. Einfache
            Anfragen werden in der Regel innerhalb weniger Geschäfts­stunden bearbeitet.
            Komplexere Recherchen können länger dauern. PRO-Kunden haben Priorität
            gegenüber Free-Nutzern.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            4. Für welche Produkte oder Dienstleistungen können Sie suchen?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Wir können Ihnen bei der Suche nach physischen Produkten (Elektronik,
            Ausstattung, Verbrauchsmaterialien usw.) und in einigen Fällen nach
            Online-Dienstleistungen helfen. Wir decken keine Bereiche ab, die eine
            rechtliche, steuerliche oder medizinische Beratung erfordern – in solchen
            Fällen sollten Sie sich immer an einen qualifizierten Profi wenden.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            5. Wie werden meine Daten verarbeitet?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Wir verwenden die von Ihnen bereitgestellten Informationen nur zur
            Bearbeitung Ihrer Anfrage und zur Verbesserung des Dienstes in
            aggregierter und anonymisierter Form. Wir verkaufen Ihre Daten nicht
            an Dritte und nutzen sie nicht für aufdringliche Werbung. Alle Details
            finden Sie in unserer Datenschutzerklärung.
          </p>
        </div>
      </section>
    </main>
  );
}

