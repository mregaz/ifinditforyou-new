import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Datenschutzerklärung | iFindItForYou",
  description:
    "Informationen darüber, wie iFindItForYou personenbezogene Daten und Suchanfragen verarbeitet.",
};

export default function PrivacyPageDe() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Datenschutzerklärung</h1>

      <p className="mb-4 text-sm text-slate-600">
        Letzte Aktualisierung: <strong>3. November 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          Auf dieser Seite wird erläutert, wie <strong>iFindItForYou</strong>{" "}
          personenbezogene Daten von Nutzerinnen und Nutzern verarbeitet, die
          den Dienst verwenden.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. Verantwortlicher
        </h2>
        <p>
          Verantwortlich für die Datenverarbeitung ist der Betreiber des
          Dienstes iFindItForYou. Die Kontaktdaten sind auf der Kontaktseite der
          Website angegeben.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          2. Arten der verarbeiteten Daten
        </h2>
        <p>
          Bei Nutzung des Dienstes können folgende Datenkategorien verarbeitet
          werden:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Basisdaten wie E-Mail-Adresse;</li>
          <li>
            der Inhalt der Anfragen, die du in das Suchfeld eingibst;
          </li>
          <li>
            technische Nutzungsdaten (IP-Adresse, Browsertyp, Nutzungsprotokolle),
            die automatisiert erfasst werden.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          3. Zwecke der Verarbeitung
        </h2>
        <p>Die Daten werden zu folgenden Zwecken verarbeitet:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Bereitstellung des angeforderten Suchdienstes;</li>
          <li>
            Verwaltung von Konten, Free- und PRO-Tarifen sowie Abrechnung über
            Stripe;
          </li>
          <li>
            Verbesserung des Dienstes und Auswertung der Nutzung in aggregierter
            Form;
          </li>
          <li>
            Erfüllung gesetzlicher Pflichten und Beantwortung von Anfragen
            zuständiger Behörden.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          4. Rechtsgrundlage
        </h2>
        <p>
          Die Verarbeitung erfolgt hauptsächlich auf Grundlage der
          Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) sowie des berechtigten
          Interesses des Verantwortlichen an der Verbesserung des Dienstes (Art.
          6 Abs. 1 lit. f DSGVO). Soweit eine Einwilligung erforderlich ist,
          wird diese ausdrücklich eingeholt.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5. Speicherdauer
        </h2>
        <p>
          Die Daten werden so lange gespeichert, wie es zur Bereitstellung des
          Dienstes und zur Einhaltung gesetzlicher Pflichten erforderlich ist.
          Suchanfragen können zu statistischen Zwecken anonymisiert oder
          aggregiert werden.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Weitergabe an Dritte
        </h2>
        <p>
          Einige Daten können an Drittanbieter weitergegeben werden, die uns bei
          der Bereitstellung des Dienstes unterstützen, z. B.:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Zahlungsdienstleister (Stripe);</li>
          <li>Infrastruktur- und Hosting-Anbieter;</li>
          <li>Analyse- und Monitoring-Tools in aggregierter Form.</li>
        </ul>
        <p>
          Diese Dritten agieren als Auftragsverarbeiter auf Grundlage von
          Verträgen gemäß den Vorgaben der DSGVO.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Rechte der betroffenen Personen
        </h2>
        <p>
          Nach geltendem Recht kannst du die Rechte auf Auskunft, Berichtigung,
          Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit im
          gesetzlich vorgesehenen Rahmen ausüben. Zur Ausübung dieser Rechte
          kannst du uns über die auf der Kontaktseite angegebene Adresse
          erreichen.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          8. Änderungen dieser Erklärung
        </h2>
        <p>
          Diese Datenschutzerklärung kann aktualisiert werden. Bei wesentlichen
          Änderungen informieren wir dich über die Website oder per E-Mail.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Alle Rechte vorbehalten.
      </div>
    </main>
  );
}


