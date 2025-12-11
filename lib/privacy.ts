// lib/privacy.ts
import type { Lang } from "./lang";

export type PrivacySection = {
  heading: string;
  paragraphs: string[];
};

export type PrivacyContent = {
  title: string;
  lastUpdated: string;
  sections: PrivacySection[];
};

export const PRIVACY_TEXTS: Record<Lang, PrivacyContent> = {
  it: {
    title: "Informativa sulla protezione dei dati / Privacy",
    lastUpdated: "Ultimo aggiornamento: 2025",
    sections: [
      {
        heading: "1. Chi siamo",
        paragraphs: [
          "iFindItForYou è un servizio che combina ricerca umana e strumenti di intelligenza artificiale per aiutarti a trovare prodotti, servizi e informazioni più velocemente.",
          "Questa informativa spiega in modo semplice quali dati raccogliamo, come li utilizziamo e quali diritti hai.",
        ],
      },
      {
        heading: "2. Dati che raccogliamo",
        paragraphs: [
          "Raccogliamo principalmente i dati necessari per erogare il servizio:",
          "- indirizzo e-mail (per creare l’account e contattarti);",
          "- contenuto delle richieste di ricerca che invii;",
          "- informazioni tecniche di base (es. indirizzo IP, tipo di browser) per motivi di sicurezza e statistica.",
        ],
      },
      {
        heading: "3. Come utilizziamo i dati",
        paragraphs: [
          "Utilizziamo i tuoi dati esclusivamente per:",
          "- gestire il tuo account (piano Free o PRO);",
          "- elaborare le ricerche che invii;",
          "- migliorare il servizio in forma aggregata e anonima dove possibile;",
          "- adempiere agli obblighi legali e contabili.",
        ],
      },
      {
        heading: "4. Servizi esterni",
        paragraphs: [
          "Per alcuni aspetti del servizio utilizziamo fornitori esterni, ad esempio:",
          "- Stripe per la gestione dei pagamenti e degli abbonamenti;",
          "- Supabase per l’autenticazione e l’archiviazione dei dati;",
          "- servizi di AI per generare suggerimenti e risultati.",
          "Questi fornitori trattano i dati solo per nostro conto e secondo accordi specifici.",
        ],
      },
      {
        heading: "5. Conservazione dei dati",
        paragraphs: [
          "Conserviamo i tuoi dati per il tempo necessario a:",
          "- fornirti il servizio;",
          "- rispettare gli obblighi legali;",
          "- risolvere eventuali controversie.",
          "Puoi richiedere la chiusura del tuo account e la cancellazione di alcuni dati scrivendoci tramite i recapiti indicati sul sito.",
        ],
      },
      {
        heading: "6. I tuoi diritti",
        paragraphs: [
          "Hai il diritto di:",
          "- accedere ai dati che ti riguardano;",
          "- chiedere la correzione di dati inesatti;",
          "- richiedere la cancellazione di alcuni dati, nei limiti consentiti dalla legge;",
          "- opporti ad alcuni trattamenti o chiederne la limitazione.",
          "Per esercitare questi diritti puoi contattarci tramite la pagina di contatto indicata sul sito.",
        ],
      },
    ],
  },

  en: {
    title: "Data protection information / Privacy policy",
    lastUpdated: "Last updated: 2025",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          "iFindItForYou is a service that combines human research and AI tools to help you find products, services and information more quickly.",
          "This policy explains in simple terms which data we collect, how we use it and which rights you have.",
        ],
      },
      {
        heading: "2. Data we collect",
        paragraphs: [
          "We mainly collect the data needed to provide the service:",
          "- e-mail address (to create and manage your account);",
          "- the content of the search requests you send;",
          "- basic technical information (e.g. IP address, browser type) for security and statistics.",
        ],
      },
      {
        heading: "3. How we use the data",
        paragraphs: [
          "We use your data only to:",
          "- operate your account (Free or PRO plan);",
          "- process the searches you submit;",
          "- improve the service in an aggregated and anonymised way where possible;",
          "- comply with legal and accounting obligations.",
        ],
      },
      {
        heading: "4. Third-party services",
        paragraphs: [
          "We use some external providers, for example:",
          "- Stripe for payments and subscriptions;",
          "- Supabase for authentication and data storage;",
          "- AI services to generate suggestions and results.",
          "These providers process data only on our behalf and under specific agreements.",
        ],
      },
      {
        heading: "5. Data retention",
        paragraphs: [
          "We keep your data only as long as necessary to:",
          "- provide the service;",
          "- comply with legal obligations;",
          "- handle potential disputes.",
          "You may request closure of your account and deletion of certain data by contacting us through the channels indicated on the website.",
        ],
      },
      {
        heading: "6. Your rights",
        paragraphs: [
          "You have the right to:",
          "- access your personal data;",
          "- request correction of inaccurate data;",
          "- request deletion of certain data, within the limits allowed by law;",
          "- object to certain processing or request restriction.",
          "To exercise these rights, please contact us using the contact information available on the site.",
        ],
      },
    ],
  },

  fr: {
    title: "Information sur la protection des données / Politique de confidentialité",
    lastUpdated: "Dernière mise à jour : 2025",
    sections: [
      {
        heading: "1. Qui sommes-nous",
        paragraphs: [
          "iFindItForYou est un service qui combine recherche humaine et outils d’IA pour vous aider à trouver plus rapidement des produits, services et informations.",
          "Cette politique explique simplement quelles données nous collectons, comment nous les utilisons et quels sont vos droits.",
        ],
      },
      {
        heading: "2. Données que nous collectons",
        paragraphs: [
          "Nous collectons principalement les données nécessaires à la fourniture du service :",
          "- adresse e-mail (pour créer et gérer votre compte) ;",
          "- contenu des demandes de recherche que vous envoyez ;",
          "- informations techniques de base (adresse IP, type de navigateur, etc.) pour la sécurité et les statistiques.",
        ],
      },
      {
        heading: "3. Utilisation des données",
        paragraphs: [
          "Nous utilisons vos données uniquement pour :",
          "- gérer votre compte (offre gratuite ou PRO) ;",
          "- traiter vos recherches ;",
          "- améliorer le service de manière agrégée et anonymisée lorsque c’est possible ;",
          "- respecter nos obligations légales et comptables.",
        ],
      },
      {
        heading: "4. Services externes",
        paragraphs: [
          "Nous faisons appel à certains prestataires externes, par exemple :",
          "- Stripe pour les paiements et abonnements ;",
          "- Supabase pour l’authentification et le stockage des données ;",
          "- des services d’IA pour générer des suggestions et des résultats.",
          "Ces prestataires traitent les données uniquement pour notre compte et conformément à des accords spécifiques.",
        ],
      },
      {
        heading: "5. Durée de conservation",
        paragraphs: [
          "Nous conservons vos données uniquement pendant la durée nécessaire pour :",
          "- fournir le service ;",
          "- respecter nos obligations légales ;",
          "- gérer d’éventuels litiges.",
          "Vous pouvez demander la fermeture de votre compte et la suppression de certaines données en nous contactant via les moyens indiqués sur le site.",
        ],
      },
      {
        heading: "6. Vos droits",
        paragraphs: [
          "Vous disposez notamment des droits suivants :",
          "- droit d’accès à vos données ;",
          "- droit de rectification ;",
          "- droit à l’effacement de certaines données, dans les limites prévues par la loi ;",
          "- droit d’opposition ou de limitation de certains traitements.",
          "Pour exercer ces droits, contactez-nous via la page de contact du site.",
        ],
      },
    ],
  },

  de: {
    title: "Information zum Datenschutz / Privacy-Richtlinie",
    lastUpdated: "Letzte Aktualisierung: 2025",
    sections: [
      {
        heading: "1. Wer wir sind",
        paragraphs: [
          "iFindItForYou ist ein Dienst, der menschliche Recherche und KI-Tools kombiniert, um dir zu helfen, Produkte, Dienstleistungen und Informationen schneller zu finden.",
          "Diese Richtlinie erklärt in einfacher Form, welche Daten wir erheben, wie wir sie verwenden und welche Rechte du hast.",
        ],
      },
      {
        heading: "2. Welche Daten wir erheben",
        paragraphs: [
          "Wir erheben vor allem die Daten, die zur Bereitstellung des Dienstes erforderlich sind:",
          "- E-Mail-Adresse (zur Erstellung und Verwaltung deines Kontos);",
          "- Inhalte der Suchanfragen, die du sendest;",
          "- grundlegende technische Informationen (z. B. IP-Adresse, Browsertyp) zu Sicherheits- und Statistikzwecken.",
        ],
      },
      {
        heading: "3. Wie wir die Daten nutzen",
        paragraphs: [
          "Wir verwenden deine Daten ausschließlich, um:",
          "- dein Konto zu betreiben (Free- oder PRO-Plan);",
          "- deine Suchanfragen zu verarbeiten;",
          "- den Dienst, soweit möglich, in aggregierter und anonymisierter Form zu verbessern;",
          "- gesetzlichen und buchhalterischen Pflichten nachzukommen.",
        ],
      },
      {
        heading: "4. Externe Dienste",
        paragraphs: [
          "Wir setzen einige externe Dienstleister ein, zum Beispiel:",
          "- Stripe für Zahlungen und Abonnements;",
          "- Supabase für Authentifizierung und Datenspeicherung;",
          "- KI-Dienste zur Generierung von Vorschlägen und Ergebnissen.",
          "Diese Dienstleister verarbeiten Daten nur in unserem Auftrag und auf Grundlage bestimmter Vereinbarungen.",
        ],
      },
      {
        heading: "5. Speicherfrist",
        paragraphs: [
          "Wir speichern deine Daten nur so lange, wie es notwendig ist, um:",
          "- den Dienst bereitzustellen;",
          "- gesetzlichen Verpflichtungen nachzukommen;",
          "- mögliche Streitigkeiten zu klären.",
          "Du kannst die Schließung deines Kontos und die Löschung bestimmter Daten verlangen, indem du uns über die auf der Website genannten Kontaktwege erreichst.",
        ],
      },
      {
        heading: "6. Deine Rechte",
        paragraphs: [
          "Du hast insbesondere das Recht:",
          "- Auskunft über deine personenbezogenen Daten zu erhalten;",
          "- Berichtigung unrichtiger Daten zu verlangen;",
          "- die Löschung bestimmter Daten zu verlangen, soweit dies gesetzlich möglich ist;",
          "- bestimmten Verarbeitungen zu widersprechen oder ihre Einschränkung zu verlangen.",
          "Zur Ausübung dieser Rechte kannst du uns über die Kontaktseite auf der Website erreichen.",
        ],
      },
    ],
  },

  es: {
    title: "Información sobre protección de datos / Política de privacidad",
    lastUpdated: "Última actualización: 2025",
    sections: [
      {
        heading: "1. Quiénes somos",
        paragraphs: [
          "iFindItForYou es un servicio que combina búsqueda humana y herramientas de IA para ayudarte a encontrar productos, servicios e información de forma más rápida.",
          "Esta política explica de manera sencilla qué datos recogemos, cómo los utilizamos y cuáles son tus derechos.",
        ],
      },
      {
        heading: "2. Datos que recogemos",
        paragraphs: [
          "Recogemos principalmente los datos necesarios para prestar el servicio:",
          "- dirección de correo electrónico (para crear y gestionar tu cuenta);",
          "- contenido de las solicitudes de búsqueda que envías;",
          "- información técnica básica (por ejemplo, dirección IP, tipo de navegador) por motivos de seguridad y estadística.",
        ],
      },
      {
        heading: "3. Cómo utilizamos los datos",
        paragraphs: [
          "Utilizamos tus datos únicamente para:",
          "- gestionar tu cuenta (plan Free o PRO);",
          "- procesar las búsquedas que realizas;",
          "- mejorar el servicio de forma agregada y anonimizada siempre que sea posible;",
          "- cumplir con obligaciones legales y contables.",
        ],
      },
      {
        heading: "4. Servicios externos",
        paragraphs: [
          "Para algunas funciones utilizamos proveedores externos, por ejemplo:",
          "- Stripe para la gestión de pagos y suscripciones;",
          "- Supabase para la autenticación y el almacenamiento de datos;",
          "- servicios de IA para generar sugerencias y resultados.",
          "Estos proveedores tratan los datos únicamente en nuestro nombre y según acuerdos específicos.",
        ],
      },
      {
        heading: "5. Conservación de los datos",
        paragraphs: [
          "Conservamos tus datos únicamente durante el tiempo necesario para:",
          "- prestarte el servicio;",
          "- cumplir obligaciones legales;",
          "- gestionar posibles reclamaciones.",
          "Puedes solicitar el cierre de tu cuenta y la eliminación de ciertos datos contactándonos a través de los datos indicados en el sitio.",
        ],
      },
      {
        heading: "6. Tus derechos",
        paragraphs: [
          "Tienes derecho, entre otros, a:",
          "- acceder a tus datos personales;",
          "- solicitar la rectificación de datos inexactos;",
          "- solicitar la eliminación de ciertos datos, dentro de los límites que permita la ley;",
          "- oponerte a determinados tratamientos o solicitar su limitación.",
          "Para ejercer estos derechos, ponte en contacto con nosotros utilizando la información de contacto disponible en la web.",
        ],
      },
    ],
  },
};

