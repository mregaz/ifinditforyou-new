// app/fr/faq/page.tsx

import type { Metadata } from "next";
import { baseUrl, locales, localePathname } from "@/lib/i18n-config";

const locale = "fr" as const;
const path = "/faq";

const canonicalUrl = `${baseUrl}${localePathname(locale, path)}`;

const languages = locales.reduce<Record<string, string>>((acc, loc) => {
  acc[loc] = `${baseUrl}${localePathname(loc, path)}`;
  return acc;
}, {});

export const metadata: Metadata = {
  title: "Questions fréquentes – iFindItForYou",
  description:
    "Réponses rapides sur les offres Free et PRO, les délais de réponse, les paiements et la protection des données.",
  alternates: {
    canonical: canonicalUrl,
    languages,
  },
  openGraph: {
    url: canonicalUrl,
    title: "Questions fréquentes – iFindItForYou",
    description:
      "Découvrez le fonctionnement des offres Free et PRO, les délais de réponse et la sécurité des données.",
    siteName: "iFindItForYou",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Questions fréquentes – iFindItForYou",
    description:
      "Toutes les réponses sur les recherches, les offres et la confidentialité sur iFindItForYou.",
  },
};

export default function FaqPageFr() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#ffffff",
        color: "#0f172a",
        padding: "32px 16px",
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Questions fréquentes (FAQ)</h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, maxWidth: 720, marginBottom: 24 }}>
        Vous trouverez ici les réponses aux questions les plus fréquentes sur le
        fonctionnement d’iFindItForYou, les offres disponibles et la gestion des
        paiements et de vos données.
      </p>

      <section style={{ maxWidth: 720, display: "grid", gap: 16 }}>
        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            1. Comment fonctionne concrètement iFindItForYou ?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Vous décrivez le produit ou le service dont vous avez besoin (contexte,
            contraintes, budget) et nous combinons recherche manuelle et IA pour
            explorer le web, filtrer le bruit et vous proposer une sélection courte
            et argumentée. Nous ne sommes pas un simple comparateur automatique :
            il y a toujours une composante humaine dans la recherche.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            2. Quelle est la différence entre l’offre Free et l’offre PRO ?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Avec l’offre Free, vous pouvez envoyer un nombre limité de demandes et
            recevoir une réponse lorsque la capacité le permet. L’offre PRO vous
            donne plus de demandes, une priorité dans la file d’attente, des réponses
            plus détaillées et un support dédié. Elle est conçue pour un usage
            fréquent ou professionnel.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            3. Sous quel délai vais-je recevoir une réponse ?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Cela dépend du volume de demandes et de la complexité de votre recherche.
            Une demande simple est généralement traitée en quelques heures ouvrables.
            Les recherches plus complexes peuvent prendre plus de temps. Les clients
            PRO sont prioritaires par rapport aux utilisateurs Free.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            4. Pour quels types de produits ou services pouvez-vous m’aider ?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Nous pouvons vous aider à trouver des produits physiques (électronique,
            matériel, fournitures, etc.) et dans certains cas des services en ligne.
            Nous ne couvrons pas les domaines nécessitant un avis juridique, fiscal
            ou médical : dans ces cas, il est préférable de consulter un professionnel
            qualifié.
          </p>
        </div>

        <div>
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>
            5. Comment vos données sont-elles traitées ?
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7 }}>
            Nous utilisons les informations que vous nous fournissez uniquement pour
            traiter votre demande et améliorer le service de manière agrégée et
            anonymisée. Nous ne revendons pas vos données à des tiers et ne les
            utilisons pas pour de la publicité intrusive. Tous les détails sont
            disponibles dans notre Politique de confidentialité.
          </p>
        </div>
      </section>
    </main>
  );
}
