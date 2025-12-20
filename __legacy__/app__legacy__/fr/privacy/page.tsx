import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité | iFindItForYou",
  description:
    "Informations sur la manière dont iFindItForYou traite les données personnelles et les recherches des utilisateurs.",
};

export default function PrivacyPageFr() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Politique de confidentialité</h1>

      <p className="mb-4 text-sm text-slate-600">
        Dernière mise à jour : <strong>3 novembre 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          Cette page décrit comment <strong>iFindItForYou</strong> collecte et
          utilise les données personnelles des utilisateurs qui accèdent au
          service.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. Responsable du traitement
        </h2>
        <p>
          Le responsable du traitement est l&apos;opérateur du service
          iFindItForYou. Les coordonnées sont indiquées sur la page de contact
          du site.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          2. Types de données traitées
        </h2>
        <p>
          Lorsque vous utilisez le service, nous pouvons traiter les catégories
          de données suivantes :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>données d’identification de base (par ex. adresse e-mail) ;</li>
          <li>
            contenu des demandes que vous saisissez dans le champ de recherche ;
          </li>
          <li>
            données techniques de navigation (adresse IP, type de navigateur,
            journaux d’utilisation) collectées automatiquement.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          3. Finalités du traitement
        </h2>
        <p>Les données sont traitées pour les finalités suivantes :</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>fournir le service de recherche demandé par l’utilisateur ;</li>
          <li>
            gérer les comptes, les offres Free et PRO et la facturation via
            Stripe ;
          </li>
          <li>
            améliorer le service et analyser l’utilisation de manière agrégée ;
          </li>
          <li>
            respecter les obligations légales et répondre aux demandes des
            autorités compétentes.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          4. Base juridique du traitement
        </h2>
        <p>
          Le traitement est principalement fondé sur l’exécution du contrat
          (art. 6, §1, b RGPD) et sur l’intérêt légitime du responsable à
          améliorer le service (art. 6, §1, f RGPD). Lorsque le consentement est
          requis, il est demandé de manière explicite.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          5. Durée de conservation
        </h2>
        <p>
          Les données sont conservées pendant la durée nécessaire à la fourniture
          du service et au respect des obligations légales. Les recherches
          peuvent être anonymisées ou agrégées à des fins statistiques.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Partage avec des tiers
        </h2>
        <p>
          Certaines données peuvent être partagées avec des prestataires tiers
          qui nous aident à fournir le service, par exemple :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>fournisseur de paiement (Stripe) ;</li>
          <li>fournisseur d’infrastructure et d’hébergement ;</li>
          <li>
            outils d’analyse et de monitoring en forme agrégée.
          </li>
        </ul>
        <p>
          Ces prestataires agissent en tant que sous-traitants sur la base de
          contrats conformes au RGPD.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Droits des personnes concernées
        </h2>
        <p>
          Conformément à la législation applicable, vous pouvez exercer vos
          droits d’accès, de rectification, d’effacement, de limitation, d’opposition
          et de portabilité, dans les limites prévues par la loi. Pour exercer
          ces droits, vous pouvez nous contacter à l’adresse indiquée sur la
          page de contact.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          8. Modifications de la politique
        </h2>
        <p>
          La présente politique de confidentialité peut être mise à jour. En cas
          de modifications importantes, nous vous informerons via le site ou par
          e-mail.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Tous droits réservés.
      </div>
    </main>
  );
}

