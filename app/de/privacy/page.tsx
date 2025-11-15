export default function PrivacyDe() {
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
          Datenschutzerklärung
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
          Letzte Aktualisierung: {new Date().getFullYear()}
        </p>

        <p style={{ marginBottom: 16 }}>
          In dieser Datenschutzerklärung erklären wir, wie wir deine
          personenbezogenen Daten verarbeiten, wenn du IFindItForYou
          (&quot;Dienst&quot;) nutzt.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          1. Welche Daten wir verarbeiten
        </h2>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>
            • <strong>Anfrage-Inhalte</strong>: Text der Suchanfragen, die du
            an den Dienst sendest.
          </li>
          <li>
            • <strong>Kontaktdaten</strong>: E-Mail-Adresse, falls du sie angibst.
          </li>
          <li>
            • <strong>Technische Daten</strong>: verkürzte IP-Adresse,
            Browser-Informationen, Server-Logs.
          </li>
          <li>
            • <strong>Zahlungsdaten</strong>: werden von Stripe verarbeitet; wir
            haben keinen Zugriff auf vollständige Kartendaten.
          </li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          2. Zwecke der Datenverarbeitung
        </h2>
        <p style={{ marginTop: 8 }}>Wir verwenden deine Daten, um:</p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>• den Dienst bereitzustellen und deine Anfragen zu beantworten;</li>
          <li>• PRO-Abonnements und Zahlungen zu verwalten;</li>
          <li>• die Qualität und Sicherheit des Dienstes zu verbessern;</li>
          <li>• rechtliche Verpflichtungen zu erfüllen.</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          3. Rechtsgrundlagen
        </h2>
        <p style={{ marginTop: 8 }}>
          Je nach Situation verarbeiten wir Daten auf Grundlage von:
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>• Erfüllung eines Vertrags (Bereitstellung des PRO-Dienstes);</li>
          <li>• deiner Einwilligung (z.&nbsp;B. Newsletter oder E-Mail-Kontakt);</li>
          <li>• unseren berechtigten Interessen (Optimierung des Dienstes);</li>
          <li>• gesetzlichen Verpflichtungen (z.&nbsp;B. Steuerrecht).</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          4. Weitergabe von Daten
        </h2>
        <p style={{ marginTop: 8 }}>
          Wir geben personenbezogene Daten nur an Dienstleister weiter, die
          für den Betrieb des Dienstes notwendig sind (z.&nbsp;B. Hosting,
          E-Mail-Versand, Zahlungsabwicklung). Diese Dienstleister sind zur
          Vertraulichkeit verpflichtet.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          5. Speicherdauer
        </h2>
        <p style={{ marginTop: 8 }}>
          Wir speichern Daten nur so lange, wie es für die oben genannten Zwecke
          erforderlich ist oder wie es gesetzliche Vorschriften verlangen.
          Teilweise können Daten anonymisiert und für statistische Zwecke
          weiter genutzt werden.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          6. Deine Rechte
        </h2>
        <p style={{ marginTop: 8 }}>
          Je nach anwendbarem Recht kannst du unter anderem das Recht haben,
          Auskunft über deine Daten zu erhalten, Berichtigung oder Löschung zu
          verlangen oder der Verarbeitung zu widersprechen. Außerdem kannst du
          eine erteilte Einwilligung jederzeit widerrufen.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          7. Kontakt
        </h2>
        <p style={{ marginTop: 8 }}>
          Bei Fragen zu dieser Datenschutzerklärung oder zur Ausübung deiner
          Rechte erreichst du uns unter:
        </p>
        <p style={{ marginTop: 4, color: "#6ee7b7" }}>
          privacy@ifinditforyou.com
        </p>
      </div>
    </main>
  );
}

