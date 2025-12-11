// lib/terms.ts
import type { Lang } from "./lang";

export type TermsSection = {
  heading: string;
  paragraphs: string[];
};

export type TermsContent = {
  title: string;
  lastUpdated: string;
  sections: TermsSection[];
};

export const TERMS_TEXTS: Record<Lang, TermsContent> = {
  it: {
    title: "Termini e condizioni d'uso",
    lastUpdated: "Ultimo aggiornamento: 2025",
    sections: [
      {
        heading: "1. Oggetto del servizio",
        paragraphs: [
          "iFindItForYou è un servizio online che combina ricerca umana e strumenti di intelligenza artificiale per aiutarti a trovare prodotti, servizi o informazioni.",
          "Il servizio viene fornito \"così com'è\", senza garanzia di disponibilità continua né di risultati perfettamente accurati.",
        ],
      },
      {
        heading: "2. Uso consentito",
        paragraphs: [
          "Puoi utilizzare il servizio esclusivamente per scopi leciti e personali.",
          "È vietato utilizzare iFindItForYou per attività illegali, abusive, moleste o che violino diritti di terzi.",
        ],
      },
      {
        heading: "3. Account, piano Free e PRO",
        paragraphs: [
          "Per utilizzare alcune funzionalità potresti dover creare un account.",
          "Il piano Free può prevedere limiti di utilizzo (ad esempio numero massimo di ricerche).",
          "Il piano PRO è a pagamento e fornisce condizioni di utilizzo più estese, come ricerche illimitate o prioritarie, secondo quanto indicato sul sito.",
        ],
      },
      {
        heading: "4. Pagamenti e rinnovi",
        paragraphs: [
          "I pagamenti vengono gestiti tramite fornitori terzi (es. Stripe).",
          "Gli abbonamenti possono essere rinnovati automaticamente, salvo disdetta da parte tua prima del termine del periodo di fatturazione.",
          "Le condizioni economiche e la valuta applicata sono indicate al momento della sottoscrizione.",
        ],
      },
      {
        heading: "5. Responsabilità",
        paragraphs: [
          "Facciamo il possibile per fornire risultati utili e aggiornati, ma non possiamo garantire la completezza o l'accuratezza di tutte le informazioni restituite.",
          "Non siamo responsabili di eventuali danni indiretti, perdita di opportunità o altri effetti derivanti dall’uso del servizio.",
        ],
      },
      {
        heading: "6. Modifiche ai termini",
        paragraphs: [
          "Possiamo aggiornare periodicamente questi termini per riflettere cambiamenti del servizio, requisiti legali o nuove funzionalità.",
          "In caso di modifiche significative, ti informeremo tramite il sito o altri canali appropriati.",
        ],
      },
      {
        heading: "7. Contatti",
        paragraphs: [
          "Per qualsiasi domanda sui presenti termini o sull’utilizzo del servizio, puoi contattarci attraverso i recapiti indicati sul sito.",
        ],
      },
    ],
  },

  en: {
    title: "Terms of use",
    lastUpdated: "Last updated: 2025",
    sections: [
      {
        heading: "1. Service scope",
        paragraphs: [
          "iFindItForYou is an online service that combines human research and AI tools to help you find products, services or information.",
          "The service is provided “as is”, without any guarantee of uninterrupted availability or perfect accuracy of the results.",
        ],
      },
      {
        heading: "2. Permitted use",
        paragraphs: [
          "You may use the service only for lawful and personal purposes.",
          "It is forbidden to use iFindItForYou for illegal, abusive or harassing activities, or in ways that infringe the rights of third parties.",
        ],
      },
      {
        heading: "3. Account, Free and PRO plans",
        paragraphs: [
          "Access to some features may require creating an account.",
          "The Free plan may include usage limits (for example a maximum number of searches).",
          "The PRO plan is paid and offers extended usage conditions, such as unlimited or priority searches, as described on the website.",
        ],
      },
      {
        heading: "4. Payments and renewals",
        paragraphs: [
          "Payments are processed by third-party providers (e.g. Stripe).",
          "Subscriptions may automatically renew unless you cancel before the end of the billing period.",
          "Pricing and applicable currency are indicated at the time of subscription.",
        ],
      },
      {
        heading: "5. Liability",
        paragraphs: [
          "We do our best to provide useful and up-to-date results, but we cannot guarantee that all information returned is complete or perfectly accurate.",
          "We are not liable for indirect damages, loss of opportunities or any other consequences arising from the use of the service.",
        ],
      },
      {
        heading: "6. Changes to these terms",
        paragraphs: [
          "We may update these terms from time to time to reflect changes in the service, legal requirements or new features.",
          "If changes are significant, we will inform you via the website or other appropriate channels.",
        ],
      },
      {
        heading: "7. Contact",
        paragraphs: [
          "If you have any questions about these terms or about using the service, please contact us using the details provided on the website.",
        ],
      },
    ],
  },

  fr: {
    title: "Conditions générales d'utilisation",
    lastUpdated: "Dernière mise à jour : 2025",
    sections: [
      {
        heading: "1. Objet du service",
        paragraphs: [
          "iFindItForYou est un service en ligne qui combine recherche humaine et outils d’IA pour vous aider à trouver des produits, des services ou des informations.",
          "Le service est fourni « tel quel », sans garantie de disponibilité continue ni d’exactitude parfaite des résultats.",
        ],
      },
      {
        heading: "2. Utilisation autorisée",
        paragraphs: [
          "Vous ne pouvez utiliser le service qu’à des fins licites et personnelles.",
          "Il est interdit d’utiliser iFindItForYou pour des activités illégales, abusives ou harcelantes, ou portant atteinte aux droits de tiers.",
        ],
      },
      {
        heading: "3. Compte, offres gratuite et PRO",
        paragraphs: [
          "L’accès à certaines fonctionnalités peut nécessiter la création d’un compte.",
          "L’offre gratuite peut inclure des limites d’utilisation (par exemple un nombre maximal de recherches).",
          "L’offre PRO est payante et offre des conditions d’utilisation étendues, comme des recherches illimitées ou prioritaires, telles que décrites sur le site.",
        ],
      },
      {
        heading: "4. Paiements et renouvellements",
        paragraphs: [
          "Les paiements sont gérés par des prestataires tiers (par ex. Stripe).",
          "Les abonnements peuvent être renouvelés automatiquement, sauf résiliation avant la fin de la période de facturation.",
          "Les tarifs et la devise appliquée sont indiqués au moment de la souscription.",
        ],
      },
      {
        heading: "5. Responsabilité",
        paragraphs: [
          "Nous faisons notre possible pour fournir des résultats utiles et à jour, mais nous ne pouvons garantir l’exactitude ou l’exhaustivité de toutes les informations retournées.",
          "Nous ne pourrons être tenus responsables des dommages indirects, de la perte d’opportunités ou d’autres conséquences liées à l’utilisation du service.",
        ],
      },
      {
        heading: "6. Modifications des conditions",
        paragraphs: [
          "Nous pouvons mettre à jour ces conditions pour refléter les évolutions du service, les exigences légales ou de nouvelles fonctionnalités.",
          "En cas de changement important, nous vous en informerons via le site ou d’autres canaux appropriés.",
        ],
      },
      {
        heading: "7. Contact",
        paragraphs: [
          "Pour toute question concernant ces conditions ou l’utilisation du service, vous pouvez nous contacter via les coordonnées indiquées sur le site.",
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
          "iFindItForYou ist ein Online-Dienst, der menschliche Recherche und KI-Tools kombiniert, um dir zu helfen, Produkte, Dienstleistungen oder Informationen zu finden.",
          "Der Dienst wird „wie gesehen“ bereitgestellt, ohne Garantie für ununterbrochene Verfügbarkeit oder vollkommen exakte Ergebnisse.",
        ],
      },
      {
        heading: "2. Zulässige Nutzung",
        paragraphs: [
          "Du darfst den Dienst nur für rechtmäßige und persönliche Zwecke nutzen.",
          "Es ist untersagt, iFindItForYou für illegale, missbräuchliche oder belästigende Aktivitäten zu verwenden oder Rechte Dritter zu verletzen.",
        ],
      },
      {
        heading: "3. Konto, Free- und PRO-Tarif",
        paragraphs: [
          "Für bestimmte Funktionen ist möglicherweise die Erstellung eines Kontos erforderlich.",
          "Der Free-Tarif kann Nutzungslimits vorsehen (z. B. maximale Anzahl von Suchanfragen).",
          "Der PRO-Tarif ist kostenpflichtig und bietet erweiterte Nutzungsmöglichkeiten, etwa unbegrenzte oder priorisierte Suchanfragen, wie auf der Website beschrieben.",
        ],
      },
      {
        heading: "4. Zahlungen und Verlängerungen",
        paragraphs: [
          "Zahlungen werden von Drittanbietern (z. B. Stripe) abgewickelt.",
          "Abonnements können sich automatisch verlängern, sofern du sie nicht vor Ablauf des Abrechnungszeitraums kündigst.",
          "Preise und verwendete Währung werden bei Abschluss des Abonnements angezeigt.",
        ],
      },
      {
        heading: "5. Haftung",
        paragraphs: [
          "Wir bemühen uns, nützliche und aktuelle Ergebnisse bereitzustellen, können jedoch nicht garantieren, dass alle Informationen vollständig oder völlig korrekt sind.",
          "Wir haften nicht für indirekte Schäden, entgangene Chancen oder sonstige Folgen, die aus der Nutzung des Dienstes entstehen.",
        ],
      },
      {
        heading: "6. Änderungen der Bedingungen",
        paragraphs: [
          "Wir können diese Bedingungen anpassen, um Änderungen am Dienst, gesetzliche Anforderungen oder neue Funktionen zu berücksichtigen.",
          "Bei wesentlichen Änderungen informieren wir dich über die Website oder andere geeignete Kanäle.",
        ],
      },
      {
        heading: "7. Kontakt",
        paragraphs: [
          "Wenn du Fragen zu diesen Bedingungen oder zur Nutzung des Dienstes hast, kannst du uns über die auf der Website angegebenen Kontaktdaten erreichen.",
        ],
      },
    ],
  },

  es: {
    title: "Términos y condiciones de uso",
    lastUpdated: "Última actualización: 2025",
    sections: [
      {
        heading: "1. Objeto del servicio",
        paragraphs: [
          "iFindItForYou es un servicio en línea que combina búsqueda humana y herramientas de IA para ayudarte a encontrar productos, servicios o información.",
          "El servicio se ofrece «tal cual», sin garantía de disponibilidad continua ni de precisión perfecta en los resultados.",
        ],
      },
      {
        heading: "2. Uso permitido",
        paragraphs: [
          "Puedes utilizar el servicio únicamente con fines lícitos y personales.",
          "Está prohibido utilizar iFindItForYou para actividades ilegales, abusivas, de acoso o que vulneren los derechos de terceros.",
        ],
      },
      {
        heading: "3. Cuenta, planes Free y PRO",
        paragraphs: [
          "El acceso a determinadas funciones puede requerir la creación de una cuenta.",
          "El plan Free puede incluir límites de uso (por ejemplo, un número máximo de búsquedas).",
          "El plan PRO es de pago y ofrece condiciones de uso ampliadas, como búsquedas ilimitadas o prioritarias, según se describe en el sitio web.",
        ],
      },
      {
        heading: "4. Pagos y renovaciones",
        paragraphs: [
          "Los pagos se gestionan a través de proveedores externos (por ejemplo, Stripe).",
          "Las suscripciones pueden renovarse automáticamente, salvo cancelación por tu parte antes de que finalice el periodo de facturación.",
          "Los precios y la moneda aplicable se indican en el momento de la suscripción.",
        ],
      },
      {
        heading: "5. Responsabilidad",
        paragraphs: [
          "Nos esforzamos por ofrecer resultados útiles y actualizados, pero no podemos garantizar que toda la información devuelta sea completa o totalmente precisa.",
          "No seremos responsables de daños indirectos, pérdida de oportunidades u otras consecuencias derivadas del uso del servicio.",
        ],
      },
      {
        heading: "6. Cambios en los términos",
        paragraphs: [
          "Podemos actualizar estos términos para reflejar cambios en el servicio, requisitos legales o nuevas funcionalidades.",
          "Si los cambios son significativos, te informaremos a través del sitio web u otros canales adecuados.",
        ],
      },
      {
        heading: "7. Contacto",
        paragraphs: [
          "Si tienes alguna pregunta sobre estos términos o sobre el uso del servicio, puedes ponerte en contacto con nosotros a través de los datos incluidos en el sitio.",
        ],
      },
    ],
  },
};
