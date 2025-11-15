export default function PrivacyFr() {
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
          Politique de confidentialité
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
          Dernière mise à jour : {new Date().getFullYear()}
        </p>

        <p style={{ marginBottom: 16 }}>
          Cette politique de confidentialité explique comment nous traitons
          tes données personnelles lorsque tu utilises IFindItForYou
          (&quot;Service&quot;).
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          1. Données que nous collectons
        </h2>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>
            • <strong>Informations de base</strong> : texte des requêtes que tu
            envoies au Service.
          </li>
          <li>
            • <strong>Données de contact</strong> : adresse email si tu choisis
            de la fournir.
          </li>
          <li>
            • <strong>Données techniques</strong> : adresse IP raccourcie,
            informations de navigation, logs serveur.
          </li>
          <li>
            • <strong>Données de paiement</strong> : gérées par Stripe. Nous
            n&apos;accédons pas au numéro complet de ta carte.
          </li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          2. Finalités du traitement
        </h2>
        <p style={{ marginTop: 8 }}>Nous utilisons tes données pour :</p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>• fournir le Service et te répondre;</li>
          <li>• gérer les abonnements et les paiements PRO;</li>
          <li>• améliorer la qualité du Service (statistiques, logs);</li>
          <li>• respecter nos obligations légales.</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          3. Bases légales
        </h2>
        <p style={{ marginTop: 8 }}>
          Selon le cas, nous traitons les données sur la base de :
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>• l&apos;exécution du contrat (fournir le Service PRO);</li>
          <li>• ton consentement (par exemple inscription email);</li>
          <li>• notre intérêt légitime à améliorer le Service;</li>
          <li>• le respect du droit applicable (notamment droit suisse/UE).</li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          4. Partage des données
        </h2>
        <p style={{ marginTop: 8 }}>
          Nous partageons tes données uniquement avec des prestataires
          nécessaires au fonctionnement du Service (par exemple Stripe pour les
          paiements, fournisseurs d’hébergement, outils d’emailing), soumis à
          des obligations de confidentialité.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          5. Conservation des données
        </h2>
        <p style={{ marginTop: 8 }}>
          Nous conservons les données uniquement pendant la durée nécessaire
          aux finalités décrites ci-dessus ou selon les obligations légales
          applicables. Certaines informations peuvent être anonymisées pour
          des statistiques.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          6. Tes droits
        </h2>
        <p style={{ marginTop: 8 }}>
          Selon le droit applicable, tu peux notamment avoir le droit
          d’accéder, de corriger ou de supprimer tes données personnelles.
          Tu peux également t’opposer à certains traitements ou retirer ton
          consentement lorsque celui-ci constitue la base du traitement.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          7. Contact
        </h2>
        <p style={{ marginTop: 8 }}>
          Pour exercer tes droits ou poser des questions sur cette politique,
          tu peux nous contacter à:
        </p>
        <p style={{ marginTop: 4, color: "#6ee7b7" }}>
          privacy@ifinditforyou.com
        </p>
      </div>
    </main>
  );
}

