// lib/privacy.ts
import type { Lang } from "./lang";

type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type PrivacyContent = {
  title: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export const PRIVACY_TEXTS: Record<Lang, PrivacyContent> = {
  it: {
    title: "Informativa sulla protezione dei dati / Privacy",
    lastUpdated: "Ultimo aggiornamento: 2025",
    sections: [
      {
        heading: "1. Titolare del trattamento",
        paragraphs: [
          "Il servizio IFindItForYou è gestito dal titolare del trattamento indicato sul sito. Per qualsiasi domanda relativa ai dati personali puoi contattarci all’indirizzo email indicato nella pagina di contatto.",
        ],
      },
      {
        heading: "2. Dati trattati",
        paragraphs: [
          "Quando utilizzi il servizio, possiamo trattare:",
          "- i testi delle ricerche che inserisci nella piattaforma;",
          "- dati tecnici come indirizzo IP, tipo di browser, informazioni sul dispositivo e log di utilizzo;",
          "- l’indirizzo email, se lo inserisci per sbloccare ricerche aggiuntive o attivare il piano PRO.",
        ],
      },
      {
        heading: "3. Finalità del trattamento",
        paragraphs: [
          "I dati vengono trattati per:",
          "- fornire il servizio di ricerca e generazione di risultati;",
          "- migliorare la qualità del servizio e prevenire abusi o uso illecito;",
          "- gestire pagamenti e fatturazione tramite Stripe per i piani PRO;",
          "- inviarti comunicazioni essenziali relative al servizio (ad esempio conferme di pagamento, informazioni sugli account PRO).",
        ],
      },
      {
        heading: "4. Base giuridica",
        paragraphs: [
          "Le principali basi giuridiche del trattamento sono:",
          "- l’esecuzione del contratto (utilizzo del servizio);",
          "- il rispetto di obblighi di legge (ad esempio obblighi fiscali);",
          "- il legittimo interesse a migliorare e proteggere il servizio;",
          "- il tuo consenso, ove richiesto (es. iscrizione a newsletter, se prevista).",
        ],
      },
      {
        heading: "5. Conservazione dei dati",
        paragraphs: [
          "I dati sono conservati per il tempo necessario a fornire il servizio e adempiere agli obblighi legali.",
          "Possiamo conservare alcuni log tecnici per un periodo limitato a fini di sicurezza e manutenzione.",
        ],
      },
      {
        heading: "6. Condivisione con terzi",
        paragraphs: [
          "Possiamo condividere alcuni dati con fornitori terzi strettamente necessari al funzionamento del servizio, ad esempio:",
          "- Stripe, per la gestione sicura dei pagamenti;",
          "- fornitori di infrastruttura tecnica e hosting.",
          "Questi soggetti trattano i dati in qualità di responsabili del trattamento o autonomi titolari, secondo i rispettivi termini e politiche.",
        ],
      },
      {
        heading: "7. Diritti dell’utente",
        paragraphs: [
          "Ai sensi della normativa applicabile (ad es. GDPR), hai diritto di:",
          "- accedere ai tuoi dati personali;",
          "- chiederne la rettifica o cancellazione;",
          "- limitare o opporti ad alcuni trattamenti;",
          "- richiedere, ove applicabile, la portabilità dei dati.",
          "Per esercitare questi diritti puoi contattarci all’indirizzo email indicato sul sito.",
        ],
      },
      {
        heading: "8. Sicurezza",
        paragraphs: [
          "Adottiamo misure tecniche e organizzative adeguate per proteggere i dati da accessi non autorizzati, perdita o divulgazione.",
          "Nessun sistema può garantire sicurezza assoluta, ma lavoriamo per mantenere un livello di protezione adeguato al rischio.",
        ],
      },
      {
        heading: "9. Modifiche alla presente informativa",
        paragraphs: [
          "La presente informativa può essere aggiornata nel tempo. In caso di modifiche rilevanti, potremmo informarti tramite il sito o altri canali appropriati.",
        ],
      },
    ],
  },

  fr: {
    title: "Politique de protection des données / Privacy",
    lastUpdated: "Dernière mise à jour : 2025",
    sections: [
      {
        heading: "1. Responsable du traitement",
        paragraphs: [
          "Le service IFindItForYou est géré par le responsable du traitement indiqué sur le site. Pour toute question concernant les données personnelles, tu peux nous contacter à l’adresse email indiquée sur la page de contact.",
        ],
      },
      {
        heading: "2. Données traitées",
        paragraphs: [
          "Lorsque tu utilises le service, nous pouvons traiter :",
          "- les textes de recherche que tu saisis sur la plateforme ;",
          "- des données techniques comme l’adresse IP, le type de navigateur, des informations sur l’appareil et des logs d’utilisation ;",
          "- ton adresse email, si tu la fournis pour débloquer des recherches supplémentaires ou activer le plan PRO.",
        ],
      },
      {
        heading: "3. Finalités du traitement",
        paragraphs: [
          "Les données sont traitées pour :",
          "- fournir le service de recherche et de génération de résultats ;",
          "- améliorer la qualité du service et prévenir les abus ou utilisations illicites ;",
          "- gérer les paiements et la facturation via Stripe pour les plans PRO ;",
          "- t’envoyer des communications essentielles liées au service (par exemple confirmations de paiement, informations sur les comptes PRO).",
        ],
      },
      {
        heading: "4. Base légale",
        paragraphs: [
          "Les principales bases légales du traitement sont :",
          "- l’exécution du contrat (utilisation du service) ;",
          "- le respect d’obligations légales (par exemple fiscales) ;",
          "- l’intérêt légitime à améliorer et protéger le service ;",
          "- ton consentement, lorsque requis (ex. inscription à une newsletter, si prévue).",
        ],
      },
      {
        heading: "5. Durée de conservation",
        paragraphs: [
          "Les données sont conservées le temps nécessaire pour fournir le service et respecter les obligations légales.",
          "Certains logs techniques peuvent être conservés pour une durée limitée à des fins de sécurité et de maintenance.",
        ],
      },
      {
        heading: "6. Partage avec des tiers",
        paragraphs: [
          "Nous pouvons partager certaines données avec des prestataires tiers strictement nécessaires au fonctionnement du service, par exemple :",
          "- Stripe, pour la gestion sécurisée des paiements ;",
          "- des fournisseurs d’infrastructure technique et d’hébergement.",
          "Ces tiers agissent en tant que sous-traitants ou responsables de traitement indépendants, selon leurs termes et politiques.",
        ],
      },
      {
        heading: "7. Droits de l’utilisateur",
        paragraphs: [
          "Conformément à la réglementation applicable (par ex. RGPD), tu disposes notamment du droit :",
          "- d’accéder à tes données personnelles ;",
          "- d’en demander la rectification ou la suppression ;",
          "- de limiter ou de t’opposer à certains traitements ;",
          "- de demander, lorsque c’est applicable, la portabilité des données.",
          "Pour exercer ces droits, tu peux nous contacter à l’adresse email indiquée sur le site.",
        ],
      },
      {
        heading: "8. Sécurité",
        paragraphs: [
          "Nous adoptons des mesures techniques et organisationnelles appropriées pour protéger les données contre l’accès non autorisé, la perte ou la divulgation.",
          "Aucun système ne peut garantir une sécurité absolue, mais nous travaillons à maintenir un niveau de protection adapté au risque.",
        ],
      },
      {
        heading: "9. Modifications de la présente politique",
        paragraphs: [
          "La présente politique peut être mise à jour. En cas de modification importante, une information pourra être publiée sur le site ou via d’autres canaux appropriés.",
        ],
      },
    ],
  },

  de: {
    title: "Datenschutzerklärung / Privacy",
    lastUpdated: "Letzte Aktualisierung: 2025",
    sections: [
      {
        heading: "1. Verantwortlicher",
        paragraphs: [
          "Der Dienst IFindItForYou wird von dem auf der Website angegebenen Verantwortlichen betrieben. Für Fragen zu personenbezogenen Daten kannst du uns über die auf der Kontaktseite angegebene E-Mail-Adresse erreichen.",
        ],
      },
      {
        heading: "2. Verarbeitete Daten",
        paragraphs: [
          "Bei der Nutzung des Dienstes können wir folgende Daten verarbeiten:",
          "- die Suchtexte, die du in die Plattform eingibst;",
          "- technische Daten wie IP-Adresse, Browsertyp, Geräteinformationen und Nutzungs-Logs;",
          "- deine E-Mail-Adresse, wenn du sie angibst, um zusätzliche Suchanfragen freizuschalten oder den PRO-Plan zu aktivieren.",
        ],
      },
      {
        heading: "3. Zwecke der Verarbeitung",
        paragraphs: [
          "Die Daten werden verarbeitet, um:",
          "- den Such- und Ergebnisdienst bereitzustellen;",
          "- die Qualität des Dienstes zu verbessern und Missbrauch oder rechtswidrige Nutzung zu verhindern;",
          "- Zahlungen und Abrechnung über Stripe für PRO-Pläne abzuwickeln;",
          "- dir wichtige Mitteilungen im Zusammenhang mit dem Dienst zu senden (z. B. Zahlungsbestätigungen, Informationen zu PRO-Konten).",
        ],
      },
      {
        heading: "4. Rechtsgrundlagen",
        paragraphs: [
          "Die wichtigsten Rechtsgrundlagen der Verarbeitung sind:",
          "- die Vertragserfüllung (Nutzung des Dienstes);",
          "- die Erfüllung gesetzlicher Pflichten (z. B. steuerliche Pflichten);",
          "- das berechtigte Interesse, den Dienst zu verbessern und zu schützen;",
          "- deine Einwilligung, sofern erforderlich (z. B. Newsletter, falls angeboten).",
        ],
      },
      {
        heading: "5. Speicherdauer",
        paragraphs: [
          "Daten werden so lange aufbewahrt, wie es für die Bereitstellung des Dienstes und die Erfüllung gesetzlicher Pflichten erforderlich ist.",
          "Bestimmte technische Logs können für eine begrenzte Zeit zu Sicherheits- und Wartungszwecken gespeichert werden.",
        ],
      },
      {
        heading: "6. Weitergabe an Dritte",
        paragraphs: [
          "Wir können bestimmte Daten mit Dritten teilen, die für das Funktionieren des Dienstes notwendig sind, z. B.:",
          "- Stripe, für die sichere Abwicklung von Zahlungen;",
          "- Anbieter von technischer Infrastruktur und Hosting.",
          "Diese Dritten handeln als Auftragsverarbeiter oder eigenständige Verantwortliche gemäß ihren jeweiligen Bedingungen und Richtlinien.",
        ],
      },
      {
        heading: "7. Rechte der Nutzer",
        paragraphs: [
          "Nach geltendem Recht (z. B. DSGVO) hast du insbesondere das Recht:",
          "- Auskunft über deine personenbezogenen Daten zu erhalten;",
          "- deren Berichtigung oder Löschung zu verlangen;",
          "- die Einschränkung bestimmter Verarbeitungen zu verlangen oder Widerspruch einzulegen;",
          "- ggf. die Datenübertragbarkeit zu verlangen.",
          "Zur Ausübung dieser Rechte kannst du uns über die auf der Website angegebene E-Mail-Adresse kontaktieren.",
        ],
      },
      {
        heading: "8. Sicherheit",
        paragraphs: [
          "Wir treffen angemessene technische und organisatorische Maßnahmen, um Daten vor unbefugtem Zugriff, Verlust oder Offenlegung zu schützen.",
          "Kein System kann absolute Sicherheit garantieren, aber wir bemühen uns um ein dem Risiko angemessenes Schutzniveau.",
        ],
      },
      {
        heading: "9. Änderungen dieser Erklärung",
        paragraphs: [
          "Diese Datenschutzerklärung kann aktualisiert werden. Bei wesentlichen Änderungen informieren wir dich ggf. über die Website oder andere geeignete Kanäle.",
        ],
      },
    ],
  },

  en: {
    title: "Privacy / Data Protection Policy",
    lastUpdated: "Last updated: 2025",
    sections: [
      {
        heading: "1. Data controller",
        paragraphs: [
          "The IFindItForYou service is operated by the controller indicated on the website. For any questions about personal data, you can contact us via the email address shown on the contact page.",
        ],
      },
      {
        heading: "2. Data we process",
        paragraphs: [
          "When you use the service, we may process:",
          "- the search texts you enter into the platform;",
          "- technical data such as IP address, browser type, device information and usage logs;",
          "- your email address, if you provide it to unlock additional searches or activate the PRO plan.",
        ],
      },
      {
        heading: "3. Purposes of processing",
        paragraphs: [
          "Data is processed in order to:",
          "- provide the search and results service;",
          "- improve the service and prevent abuse or unlawful use;",
          "- manage payments and billing via Stripe for PRO plans;",
          "- send you essential communications related to the service (e.g. payment confirmations, information about PRO accounts).",
        ],
      },
      {
        heading: "4. Legal bases",
        paragraphs: [
          "The main legal bases for processing are:",
          "- performance of a contract (use of the service);",
          "- compliance with legal obligations (e.g. tax obligations);",
          "- legitimate interest in improving and protecting the service;",
          "- your consent where required (e.g. newsletter, if offered).",
        ],
      },
      {
        heading: "5. Data retention",
        paragraphs: [
          "Data is retained for as long as necessary to provide the service and comply with legal obligations.",
          "Some technical logs may be kept for a limited period for security and maintenance purposes.",
        ],
      },
      {
        heading: "6. Sharing with third parties",
        paragraphs: [
          "We may share certain data with third-party providers strictly necessary for the operation of the service, for example:",
          "- Stripe, for secure payment processing;",
          "- providers of technical infrastructure and hosting.",
          "These third parties act as processors or independent controllers according to their own terms and policies.",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "Under applicable data protection law (e.g. GDPR), you have the right to:",
          "- access your personal data;",
          "- request correction or deletion;",
          "- request restriction of or object to certain processing;",
          "- request data portability where applicable.",
          "To exercise these rights, you can contact us via the email address provided on the site.",
        ],
      },
      {
        heading: "8. Security",
        paragraphs: [
          "We adopt appropriate technical and organisational measures to protect data against unauthorised access, loss or disclosure.",
          "No system can guarantee absolute security, but we work to maintain a level of protection appropriate to the risk.",
        ],
      },
      {
        heading: "9. Changes to this policy",
        paragraphs: [
          "This policy may be updated over time. In case of significant changes, we may inform you via the website or other appropriate channels.",
        ],
      },
    ],
  },
};
