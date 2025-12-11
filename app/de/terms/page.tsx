// app/de/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nutzungsbedingungen | iFindItForYou",
  description:
    "Lesen Sie die Nutzungsbedingungen für den Dienst iFindItForYou.",
};

export default function TermsPageDe() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Nutzungsbedingungen</h1>

      <p className="mb-4 text-sm text-slate-600">
        Letzte Aktualisierung: <strong>3. November 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          Willkommen bei <strong>iFindItForYou</strong>. Durch die Nutzung
          dieser Website und der zugehörigen Dienste erklären Sie sich mit den
          folgenden Nutzungsbedingungen einverstanden. Bitte lesen Sie diese
          sorgfältig, bevor Sie die Plattform verwenden.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Leistungsbeschreibung</h2>
        <p>
          iFindItForYou bietet einen unterstützten Suchdienst an, der
          KI-Werkzeuge und – falls nötig – eine manuelle Überprüfung kombiniert,
          um gefilterte und zusammengefasste Ergebnisse zu Ihrer Anfrage zu
          liefern.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Zulässige Nutzung</h2>
        <p>
          Sie dürfen den Dienst nur für rechtmäßige und private Zwecke nutzen.
          Es ist untersagt, iFindItForYou für illegale, irreführende oder
          schädliche Aktivitäten zu verwenden oder den Dienst oder Dritte zu
          beeinträchtigen.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          3. Free-Tarif und PRO-Tarif
        </h2>
        <p>
          Der <strong>Free-Tarif</strong> bietet eine begrenzte Anzahl
          kostenloser Suchanfragen. Der <strong>PRO-Tarif</strong> ist ein
          Abonnement mit erweitertem Nutzungsumfang, wie auf der
          Preisseite beschrieben. Preise können sich ändern; bei relevanten
          Änderungen informieren wir Sie angemessen.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          4. Zahlungen und Abrechnung
        </h2>
        <p>
          Zahlungen für den PRO-Tarif werden über Stripe abgewickelt.
          Zahlungsdaten werden nicht von iFindItForYou gespeichert, sondern vom
          Zahlungsanbieter. Das Abonnement verlängert sich automatisch zu jedem
          Abrechnungszeitraum, bis es gekündigt wird.
        </p>

        <h2 className="text-xl font-semibold mt-6">5. Kein Beratungstätigkeit</h2>
        <p>
          Die vom Dienst bereitgestellten Informationen dienen ausschließlich
          Informationszwecken. iFindItForYou bietet keine Rechts-, Medizin-,
          Finanz- oder sonstige professionelle Beratung. Kritische Informationen
          sollten stets bei offiziellen Stellen oder qualifizierten
          Fachpersonen überprüft werden.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Haftungsbeschränkung
        </h2>
        <p>
          Obwohl wir uns bemühen, hochwertige Ergebnisse zu liefern, können wir
          die Genauigkeit, Vollständigkeit oder Aktualität aller Informationen
          nicht garantieren. iFindItForYou haftet nicht für direkte oder
          indirekte Schäden, die aus der Nutzung des Dienstes entstehen.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Änderungen der Bedingungen
        </h2>
        <p>
          Wir können diese Nutzungsbedingungen jederzeit aktualisieren. Bei
          wesentlichen Änderungen informieren wir Sie über die Website oder per
          E-Mail. Durch die weitere Nutzung des Dienstes akzeptieren Sie die
          geänderten Bedingungen.
        </p>

        <h2 className="text-xl font-semibold mt-6">8. Kontakt</h2>
        <p>
          Bei Fragen zu diesen Nutzungsbedingungen können Sie uns über die auf
          der Kontaktseite angegebene E-Mail-Adresse erreichen.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Alle Rechte vorbehalten.
      </div>
    </main>
  );
}

