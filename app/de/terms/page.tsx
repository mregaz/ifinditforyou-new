export default function TermsDe() {
  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: "40px 16px",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 800 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
          Letzte Aktualisierung: {new Date().getFullYear()}
        </p>

        <p style={{ marginBottom: 16 }}>
          Diese Allgemeinen Geschäftsbedingungen (&quot;AGB&quot;)
          regeln die Nutzung des Dienstes IFindItForYou (&quot;Dienst&quot;,
          &quot;wir&quot;, &quot;uns&quot;) durch dich als Nutzer
          (&quot;du&quot;).
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          1. Beschreibung des Dienstes
        </h2>
        <p style={{ marginTop: 8 }}>
          IFindItForYou unterstützt dich dabei, Informationen im Internet zu
          finden, basierend auf einer freien Beschreibung deiner Anfrage. Wir
          durchsuchen, filtern und fassen öffentlich verfügbare Inhalte
          zusammen. Es kann jedoch keine Gewähr für Richtigkeit,
          Vollständigkeit oder Aktualität der Ergebnisse übernommen werden.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          2. Zulässige Nutzung
        </h2>
        <p style={{ marginTop: 8 }}>
          Du verpflichtest dich, den Dienst nur im Rahmen der geltenden
          Gesetze zu nutzen. Insbesondere ist es untersagt:
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>• den Dienst für rechtswidrige Zwecke einzusetzen;</li>
          <li>• unbefugten Zugriff auf Systeme zu versuchen;</li>
          <li>
            • den Dienst ohne unsere ausdrückliche Zustimmung zu kopieren,
            weiterzuverkaufen oder Dritten bereitzustellen.
          </li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          3. Konten und PRO-Abonnement
        </h2>
        <p style={{ marginTop: 8 }}>
          Der Zugang zu bestimmten Funktionen (z.&nbsp;B. IFindItForYou PRO)
          erfordert ein kostenpflichtiges Abonnement. Zahlungen werden
          ausschließlich über Stripe abgewickelt. Wir speichern keine
          vollständigen Kreditkartendaten.
        </p>
        <p style={{ marginTop: 8 }}>
          Dein Abonnement verlängert sich automatisch am Ende jeder Periode
          (monatlich oder jährlich), sofern du die automatische Verlängerung
          nicht rechtzeitig in deinem Stripe-Konto deaktivierst.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          4. Kündigung und Rückerstattungen
        </h2>
        <p style={{ marginTop: 8 }}>
          Du kannst das automatische Renewing deines Abonnements jederzeit in
          deinem Stripe-Konto beenden. Bereits bezahlte Zeiträume werden in der
          Regel nicht rückerstattet, außer wenn dies gesetzlich vorgeschrieben
          ist oder wir dem ausdrücklich zustimmen.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          5. Haftungsbeschränkung
        </h2>
        <p style={{ marginTop: 8 }}>
          Der Dienst wird &quot;wie gesehen&quot; ohne ausdrückliche oder
          stillschweigende Garantien bereitgestellt. Soweit gesetzlich
          zulässig, haften wir nicht für direkte oder indirekte Schäden, die
          aus der Nutzung oder Nichtnutzung des Dienstes entstehen.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          6. Änderungen des Dienstes und der AGB
        </h2>
        <p style={{ marginTop: 8 }}>
          Wir können den Dienst oder diese AGB jederzeit ändern, zum Beispiel
          aus technischen, rechtlichen oder sicherheitsrelevanten Gründen.
          Wesentliche Änderungen werden in geeigneter Form bekanntgegeben
          (z.&nbsp;B. auf der Website oder per E-Mail).
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          7. Kontakt
        </h2>
        <p style={{ marginTop: 8 }}>
          Bei Fragen zu diesen AGB kannst du uns unter folgender Adresse
          kontaktieren:
        </p>
        <p style={{ marginTop: 4, color: "#6ee7b7" }}>
          support@ifinditforyou.com
        </p>
      </div>
    </main>
  );
}

