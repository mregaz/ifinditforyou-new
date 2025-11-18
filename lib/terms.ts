// lib/terms.ts
import type { Lang } from "./lang";

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type TermsContent = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const TERMS_TEXTS: Record<Lang, TermsContent> = {
  it: {
    title: "Termini e condizioni d'uso",
    lastUpdated: "Ultimo aggiornamento: 2025",
    sections: [
      {
        heading: "1. Oggetto del servizio",
        paragraphs: [
          "IFindItForYou è una piattaforma online che aiuta gli utenti a trovare informazioni, link utili e risultati pertinenti sulla base delle richieste inserite.",
          "Il servizio viene fornito “così com’è”, senza alcuna garanzia riguardo disponibilità continua, accuratezza dei contenuti o idoneità per uno scopo specifico.",
        ],
      },
      {
        heading: "2. Uso consentito",
        paragraphs: [
          "L’utente si impegna a utilizzare la piattaforma nel rispetto della legge e delle presenti condizioni.",
          "È vietato utilizzare il servizio per attività illegali, fraudolente o dannose; tentare di aggirare limiti tecnici, funzionali o di sicurezza; utilizzare il servizio per inviare spam o contenuti indesiderati; compiere azioni che possano compromettere la stabilità o la sicurezza del sistema.",
          "IFindItForYou si riserva il diritto di sospendere gli account che violano tali obblighi.",
        ],
      },
      {
        heading: "3. Piani Free e PRO, abbonamenti e pagamenti",
        paragraphs: [
          "Il piano Free offre un numero limitato di ricerche. Il piano PRO offre funzionalità avanzate e un utilizzo ampliato del servizio secondo quanto indicato nella pagina dedicata.",
          "I pagamenti sono gestiti in modo sicuro tramite Stripe. IFindItForYou non memorizza né elabora i dati delle carte di pagamento.",
          "Gli abbonamenti sono ricorrenti (mensili o annuali) e si rinnovano automaticamente, salvo annullamento da parte dell’utente prima della data di rinnovo.",
        ],
      },
      {
        heading: "4. Annullamento e rimborsi",
        paragraphs: [
          "L’utente può annullare il rinnovo dell’abbonamento in qualsiasi momento tramite il proprio portale di gestione Stripe o tramite il link indicato nelle email ricevute da Stripe.",
          "Salvo diversa disposizione di legge, i pagamenti già effettuati non sono rimborsabili. Dopo l’annullamento, l’utente mantiene l’accesso PRO fino alla fine del periodo già pagato.",
        ],
      },
      {
        heading: "5. Limitazione di responsabilità",
        paragraphs: [
          "Nei limiti massimi consentiti dalla legge, IFindItForYou non garantisce l’accuratezza, la completezza o l’aggiornamento dei risultati generati.",
          "IFindItForYou non è responsabile per danni indiretti, perdita di dati, perdita di profitti o interruzioni del servizio.",
          "IFindItForYou non è responsabile per malfunzionamenti dovuti a servizi esterni, rete internet o piattaforme di terze parti (ad esempio Stripe).",
        ],
      },
      {
        heading: "6. Modifiche alle condizioni",
        paragraphs: [
          "Le presenti condizioni possono essere aggiornate in futuro. In caso di modifiche sostanziali, gli utenti verranno informati tramite il sito o altri mezzi appropriati.",
          "L’uso continuato del servizio implica accettazione delle nuove condizioni.",
        ],
      },
      {
        heading: "7. Contatti",
        paragraphs: [
          "Per richieste o chiarimenti puoi contattarci tramite l'indirizzo email indicato sul sito.",
        ],
      },
    ],
  },

  fr: {
    title: "Conditions générales d’utilisation",
    lastUpdated: "Dernière mise à jour : 2025",
    sections: [
      {
        heading: "1. Objet du service",
        paragraphs: [
          "IFindItForYou est une plateforme en ligne qui aide les utilisateurs à trouver des informations, des liens utiles et des résultats pertinents en fonction de leurs demandes.",
          "Le service est fourni « tel quel », sans garantie de disponibilité continue, d’exactitude des contenus ou d’adéquation à un usage spécifique.",
        ],
      },
      {
        heading: "2. Utilisation autorisée",
        paragraphs: [
          "L’utilisateur s’engage à utiliser la plateforme conformément à la loi et aux présentes conditions.",
          "Il est interdit d’utiliser le service pour des activités illégales, frauduleuses ou nuisibles, de tenter de contourner les limites techniques ou de sécurité, d’envoyer du spam ou des contenus non sollicités ou d’effectuer des actions qui compromettent la stabilité ou la sécurité du système.",
          "IFindItForYou se réserve le droit de suspendre les comptes en cas de violation.",
        ],
      },
      {
        heading: "3. Plans Free et PRO, abonnements et paiements",
        paragraphs: [
          "Le plan Free offre un nombre limité de recherches. Le plan PRO offre des fonctionnalités avancées et un usage étendu du service selon la page dédiée.",
          "Les paiements sont traités de manière sécurisée via Stripe. IFindItForYou ne stocke ni ne traite les données de carte bancaire.",
          "Les abonnements (mensuels ou annuels) se renouvellent automatiquement, sauf annulation avant la date de renouvellement.",
        ],
      },
      {
        heading: "4. Annulation et remboursements",
        paragraphs: [
          "L’utilisateur peut annuler le renouvellement à tout moment depuis son espace Stripe ou via les liens contenus dans les emails de Stripe.",
          "Sauf disposition légale contraire, les paiements déjà effectués ne sont pas remboursables. Après annulation, l’utilisateur conserve l’accès PRO jusqu’à la fin de la période déjà payée.",
        ],
      },
      {
        heading: "5. Limitation de responsabilité",
        paragraphs: [
          "Dans les limites permises par la loi, IFindItForYou ne garantit pas l’exactitude, la complétude ou l’actualité des résultats générés.",
          "IFindItForYou n’est pas responsable des dommages indirects, pertes de données ou interruptions de service.",
          "IFindItForYou n’est pas responsable des défaillances dues à des services externes, à Internet ou à des plateformes tierces (par exemple Stripe).",
        ],
      },
      {
        heading: "6. Modifications",
        paragraphs: [
          "Les présentes conditions peuvent être mises à jour. En cas de modification importante, une notification pourra être publiée sur le site ou d’autres canaux appropriés.",
          "L’utilisation continue du service vaut acceptation des nouvelles conditions.",
        ],
      },
      {
        heading: "7. Contact",
        paragraphs: [
          "Pour toute question, tu peux nous contacter via l’adresse email indiquée sur le site.",
        ],
      },
    ],
  },

  de: {
    title: "Nutzungsbedingungen",
    lastUpdated: "Letzte Aktualisierung: 2025",
    sections: [
      {
        heading: "1. Gegenstand des Dienstes",
        paragraphs: [
          "IFindItForYou ist eine Online-Plattform, die Nutzern hilft, Informationen und relevante Ergebnisse anhand ihrer Anfragen zu finden.",
          "Der Dienst wird „wie besehen“ bereitgestellt, ohne Garantie für dauerhafte Verfügbarkeit, Genauigkeit oder Eignung für einen bestimmten Zweck.",
        ],
      },
      {
        heading: "2. Zulässige Nutzung",
        paragraphs: [
          "Der Nutzer verpflichtet sich, die Plattform gesetzeskonform und gemäß diesen Bedingungen zu nutzen.",
          "Es ist untersagt, den Dienst für illegale, betrügerische oder schädliche Aktivitäten zu verwenden, technische oder sicherheitsrelevante Beschränkungen zu umgehen, Spam oder unerwünschte Inhalte zu versenden oder Handlungen vorzunehmen, die die Stabilität oder Sicherheit des Systems gefährden.",
          "IFindItForYou behält sich das Recht vor, Konten bei Verstößen zu sperren.",
        ],
      },
      {
        heading: "3. Free- und PRO-Plan, Abonnements und Zahlungen",
        paragraphs: [
          "Der Free-Plan bietet eine begrenzte Anzahl an Suchanfragen. Der PRO-Plan bietet erweiterte Funktionen und einen umfangreicheren Zugriff gemäß der entsprechenden Seite.",
          "Zahlungen werden sicher über Stripe abgewickelt. IFindItForYou speichert oder verarbeitet keine Kreditkartendaten.",
          "Abonnements (monatlich oder jährlich) erneuern sich automatisch, sofern sie nicht vor dem Verlängerungsdatum gekündigt werden.",
        ],
      },
      {
        heading: "4. Kündigung und Erstattungen",
        paragraphs: [
          "Der Nutzer kann die automatische Verlängerung jederzeit über sein Stripe-Konto oder die in den Stripe-E-Mails enthaltenen Links deaktivieren.",
          "Sofern gesetzlich nichts anderes vorgesehen ist, sind bereits erfolgte Zahlungen nicht erstattungsfähig. Nach der Kündigung bleibt der PRO-Zugang bis zum Ende des bereits bezahlten Zeitraums aktiv.",
        ],
      },
      {
        heading: "5. Haftungsbeschränkung",
        paragraphs: [
          "Im gesetzlich zulässigen Rahmen übernimmt IFindItForYou keine Garantie für Genauigkeit, Vollständigkeit oder Aktualität der Ergebnisse.",
          "IFindItForYou haftet nicht für indirekte Schäden, Datenverlust, entgangene Gewinne oder Serviceunterbrechungen.",
          "IFindItForYou haftet nicht für Ausfälle von Fremddiensten, Internetverbindungen oder Drittplattformen (z. B. Stripe).",
        ],
      },
      {
        heading: "6. Änderungen",
        paragraphs: [
          "Diese Bedingungen können aktualisiert werden. Bei wichtigen Änderungen wird eine Mitteilung auf der Website oder über andere geeignete Kanäle veröffentlicht.",
          "Die fortgesetzte Nutzung des Dienstes bedeutet Zustimmung zu den neuen Bedingungen.",
        ],
      },
      {
        heading: "7. Kontakt",
        paragraphs: [
          "Bei Fragen kannst du uns über die auf der Website angegebene E-Mail-Adresse erreichen.",
        ],
      },
    ],
  },

  en: {
    title: "Terms and Conditions",
    lastUpdated: "Last updated: 2025",
    sections: [
      {
        heading: "1. Service description",
        paragraphs: [
          "IFindItForYou is an online platform that helps users find information, useful links and relevant results based on their input.",
          "The service is provided “as is”, without any guarantee of continuous availability, accuracy or suitability for a particular purpose.",
        ],
      },
      {
        heading: "2. Permitted use",
        paragraphs: [
          "Users agree to use the platform lawfully and in accordance with these terms.",
          "It is prohibited to use the service for illegal, fraudulent or harmful activities, attempt to bypass technical or security limits, send spam or unsolicited content, or perform actions that compromise system stability or security.",
          "IFindItForYou reserves the right to suspend accounts violating these rules.",
        ],
      },
      {
        heading: "3. Free and PRO plans, subscriptions and payments",
        paragraphs: [
          "The Free plan offers a limited number of searches. The PRO plan offers expanded usage and advanced features as described on the dedicated page.",
          "Payments are securely processed via Stripe. IFindItForYou does not store or process any credit card data.",
          "Subscriptions (monthly or yearly) renew automatically unless cancelled before the renewal date.",
        ],
      },
      {
        heading: "4. Cancellation and refunds",
        paragraphs: [
          "Users may cancel automatic renewal at any time via their Stripe customer portal or the links included in Stripe emails.",
          "Unless required by law, payments already made are non-refundable. After cancellation, PRO access remains active until the end of the paid period.",
        ],
      },
      {
        heading: "5. Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, IFindItForYou does not guarantee the accuracy, completeness or freshness of generated results.",
          "IFindItForYou is not liable for indirect damages, data loss, loss of profits or service interruptions.",
          "IFindItForYou is not responsible for failures caused by external services, internet providers or third-party platforms (e.g. Stripe).",
        ],
      },
      {
        heading: "6. Changes",
        paragraphs: [
          "These terms may be updated. In case of major changes, a notice will be displayed on the website or via other appropriate channels.",
          "Continued use of the service constitutes acceptance of the new terms.",
        ],
      },
      {
        heading: "7. Contact",
        paragraphs: [
          "For questions, you can reach us through the contact email provided on the site.",
        ],
      },
    ],
  },
};
