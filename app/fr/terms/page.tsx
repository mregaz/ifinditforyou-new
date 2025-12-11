// app/fr/terms/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d’utilisation | iFindItForYou",
  description:
    "Lisez les conditions d’utilisation du service iFindItForYou.",
};

export default function TermsPageFr() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-16 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">Conditions d’utilisation</h1>

      <p className="mb-4 text-sm text-slate-600">
        Dernière mise à jour : <strong>3 novembre 2025</strong>
      </p>

      <section className="space-y-6 text-sm leading-relaxed text-slate-800">
        <p>
          Bienvenue sur <strong>iFindItForYou</strong>. En utilisant ce site
          et les services associés, vous acceptez les présentes conditions
          d’utilisation. Merci de les lire attentivement avant d’utiliser la
          plateforme.
        </p>

        <h2 className="text-xl font-semibold mt-6">1. Objet du service</h2>
        <p>
          iFindItForYou fournit un service de recherche assistée combinant des
          outils d’intelligence artificielle et, si nécessaire, une revue
          humaine afin de proposer des résultats filtrés et synthétisés en
          fonction de votre demande.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. Utilisation autorisée</h2>
        <p>
          Vous pouvez utiliser le service uniquement à des fins licites et
          personnelles. Il est interdit d’utiliser iFindItForYou pour des
          activités illégales, trompeuses ou nuisibles, ou de manière à nuire à
          des tiers ou au service lui-même.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          3. Offre gratuite et offre PRO
        </h2>
        <p>
          L’offre <strong>gratuite</strong> propose un nombre limité de
          recherches. L’offre <strong>PRO</strong>, basée sur un abonnement,
          permet une utilisation plus étendue du service, comme indiqué sur la
          page des tarifs. Les prix peuvent évoluer dans le temps ; en cas de
          changement significatif, nous vous en informerons.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          4. Paiements et facturation
        </h2>
        <p>
          Les paiements pour l’offre PRO sont gérés via Stripe. Les données de
          paiement ne sont pas stockées par iFindItForYou mais par le
          prestataire de paiement. L’abonnement est reconduit automatiquement à
          chaque période de facturation jusqu’à annulation.
        </p>

        <h2 className="text-xl font-semibold mt-6">5. Absence de conseil</h2>
        <p>
          Les informations fournies par le service ont un caractère purement
          informatif. iFindItForYou ne fournit aucun conseil juridique, médical,
          financier ou professionnel. Vous devez toujours vérifier les
          informations critiques auprès de sources officielles ou de
          professionnels qualifiés.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. Limitation de responsabilité
        </h2>
        <p>
          Bien que nous nous efforcions de fournir des résultats de qualité,
          nous ne pouvons garantir l’exactitude, l’exhaustivité ou l’actualité
          de toutes les informations. iFindItForYou ne saurait être tenu
          responsable des dommages directs ou indirects résultant de
          l’utilisation du service.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          7. Modifications des conditions
        </h2>
        <p>
          Nous pouvons mettre à jour ces conditions d’utilisation à tout
          moment. En cas de modification importante, nous vous informerons via
          le site ou par e-mail. En continuant à utiliser le service après ces
          modifications, vous acceptez les nouvelles conditions.
        </p>

        <h2 className="text-xl font-semibold mt-6">8. Contact</h2>
        <p>
          Pour toute question concernant ces conditions d’utilisation, vous
          pouvez nous contacter à l’adresse e-mail indiquée sur la page de
          contact.
        </p>
      </section>

      <div className="mt-10 text-xs text-slate-500 border-t border-slate-200 pt-4">
        © {new Date().getFullYear()} iFindItForYou. Tous droits réservés.
      </div>
    </main>
  );
}

