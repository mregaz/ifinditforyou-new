export default function TermesFr() {
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
          Termes et conditions d’utilisation
        </h1>
        <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
          Dernière mise à jour : {new Date().getFullYear()}
        </p>

        <p style={{ marginBottom: 16 }}>
          Les présents termes et conditions (&quot;Termes&quot;) régissent
          l’utilisation du service IFindItForYou (&quot;Service&quot;,
          &quot;nous&quot;, &quot;notre&quot;) par toi en tant
          qu&apos;utilisateur (&quot;tu&quot;).
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          1. Description du service
        </h2>
        <p style={{ marginTop: 8 }}>
          IFindItForYou t’aide à trouver des informations en ligne à partir
          d&apos;une description libre. Nous cherchons, filtrons et résumons
          des contenus provenant de sources publiques du web. Le Service ne
          garantit pas l’exactitude, l’exhaustivité ou l’actualité des
          informations fournies.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          2. Utilisation autorisée
        </h2>
        <p style={{ marginTop: 8 }}>
          Tu t’engages à utiliser le Service uniquement dans le respect de la
          loi applicable. Il est notamment interdit de:
        </p>
        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
          <li>• utiliser le Service à des fins illégales;</li>
          <li>• tenter d’accéder aux systèmes de manière non autorisée;</li>
          <li>
            • copier ou revendre le Service sans notre accord écrit préalable.
          </li>
        </ul>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          3. Comptes et abonnement PRO
        </h2>
        <p style={{ marginTop: 8 }}>
          L’accès à certaines fonctionnalités (par exemple IFindItForYou PRO)
          nécessite un abonnement payant. Les paiements sont traités
          exclusivement via Stripe. Nous ne stockons pas les données de ta
          carte.
        </p>
        <p style={{ marginTop: 8 }}>
          Ton abonnement est renouvelé automatiquement à la fin de chaque
          période (mensuelle ou annuelle), sauf si tu désactives le renouvellement
          dans ton compte Stripe avant la date de renouvellement.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          4. Annulation et remboursements
        </h2>
        <p style={{ marginTop: 8 }}>
          Tu peux arrêter le renouvellement automatique de ton abonnement
          à tout moment via ton compte Stripe. Les périodes déjà payées ne
          sont en principe pas remboursées, sauf obligation légale contraire
          ou accord explicite de notre part.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          5. Limitation de responsabilité
        </h2>
        <p style={{ marginTop: 8 }}>
          Le Service est fourni &quot;tel quel&quot; sans aucune garantie,
          expresse ou implicite. Dans les limites autorisées par le droit
          applicable, nous ne sommes pas responsables des dommages directs ou
          indirects résultant de l’utilisation ou de l’impossibilité
          d&apos;utiliser le Service.
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          6. Modifications du service et des termes
        </h2>
        <p style={{ marginTop: 8 }}>
          Nous pouvons modifier le Service ou ces Termes à tout moment, par
          exemple pour des raisons techniques, légales ou de sécurité. Les
          changements importants seront communiqués de manière appropriée
          (par exemple sur le site ou par email).
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>
          7. Contact
        </h2>
        <p style={{ marginTop: 8 }}>
          Pour toute question concernant ces Termes, tu peux nous contacter à:
        </p>
        <p style={{ marginTop: 4, color: "#6ee7b7" }}>
          support@ifinditforyou.com
        </p>
      </div>
    </main>
  );
}

