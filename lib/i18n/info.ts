import type { Locale } from "@/lib/i18n-config";

/* =========================
   TYPES & HELPERS
========================= */

export type InfoCopy = {
  title: string;
  body: string;
};

function pick<T>(locale: Locale, map: Record<Locale, T>): T {
  return map[locale] ?? map.it;
}

/* =========================
   HOW IT WORKS
========================= */

export function getHowItWorksCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Come funziona",
      body: `Con iFindItForYou descrivi ciò che stai cercando e come intendi usarlo: contesto, preferenze e vincoli come budget o tempi di consegna.
Non devi confrontare decine di schede prodotto o perdere ore a leggere recensioni.

Un assistente umano utilizza strumenti di intelligenza artificiale e ricerca manuale per analizzare molte opzioni, scartare quelle non rilevanti e verificare le informazioni più importanti.

Ricevi solo una selezione ristretta di proposte davvero adatte alle tue esigenze, spiegate in modo chiaro e comprensibile.
L’obiettivo è farti risparmiare tempo e aiutarti a scegliere con maggiore sicurezza.`,
    },
    en: {
      title: "How it works",
      body: `With iFindItForYou you describe what you are looking for and how you plan to use it, including context, preferences, and constraints such as budget or delivery time.
You don’t need to compare dozens of product pages or spend hours reading reviews.

A human assistant uses artificial intelligence tools together with manual research to analyze many options, discard irrelevant ones, and verify the most important information.

You receive a short list of options that truly match your needs, explained in a clear and understandable way.
The goal is to save you time and help you make a more confident decision.`,
    },
    fr: {
      title: "Comment ça marche",
      body: `Avec iFindItForYou, vous décrivez ce que vous recherchez et comment vous comptez l’utiliser, en précisant le contexte, vos préférences et vos contraintes comme le budget ou les délais de livraison.
Vous n’avez pas besoin de comparer des dizaines de pages produits ni de passer des heures à lire des avis.

Un assistant humain utilise des outils d’intelligence artificielle ainsi qu’une recherche manuelle pour analyser de nombreuses options, écarter celles qui ne sont pas pertinentes et vérifier les informations essentielles.

Vous recevez une sélection limitée de propositions réellement adaptées à vos besoins, expliquées de manière claire et compréhensible.
L’objectif est de vous faire gagner du temps et de vous aider à choisir en toute confiance.`,
    },
    de: {
      title: "So funktioniert es",
      body: `Mit iFindItForYou beschreiben Sie, wonach Sie suchen und wie Sie es nutzen möchten – einschließlich Kontext, Präferenzen und Einschränkungen wie Budget oder Lieferzeit.
Sie müssen nicht Dutzende von Produktseiten vergleichen oder stundenlang Bewertungen lesen.

Ein menschlicher Assistent nutzt KI-Werkzeuge in Kombination mit manueller Recherche, um viele Optionen zu analysieren, ungeeignete auszuschließen und die wichtigsten Informationen zu überprüfen.

Sie erhalten eine kurze Auswahl von Optionen, die wirklich zu Ihren Anforderungen passen, klar und verständlich erklärt.
Ziel ist es, Ihnen Zeit zu sparen und Ihnen eine sichere Entscheidung zu ermöglichen.`,
    },
    es: {
      title: "Cómo funciona",
      body: `Con iFindItForYou describes lo que estás buscando y cómo planeas usarlo, incluyendo el contexto, tus preferencias y limitaciones como el presupuesto o los tiempos de entrega.
No necesitas comparar decenas de páginas de productos ni pasar horas leyendo reseñas.

Un asistente humano utiliza herramientas de inteligencia artificial junto con investigación manual para analizar muchas opciones, descartar las que no son relevantes y verificar la información más importante.

Recibes una selección reducida de opciones que realmente se ajustan a tus necesidades, explicadas de forma clara y comprensible.
El objetivo es ahorrarte tiempo y ayudarte a tomar una decisión con mayor confianza.`,
    },
  });
}

/* =========================
   ABOUT
========================= */

export function getAboutCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Chi siamo",
      body: `iFindItForYou nasce per semplificare la ricerca di prodotti quando le alternative sono troppe e le informazioni poco chiare.
Confrontare offerte, recensioni e specifiche richiede tempo e spesso non porta a una scelta davvero sicura.

Il servizio combina il lavoro di un assistente umano con strumenti di intelligenza artificiale per analizzare le opzioni disponibili, verificare le informazioni rilevanti e filtrare ciò che non è adatto al contesto specifico.

L’obiettivo non è mostrare tutto, ma selezionare solo ciò che ha senso per esigenze reali.
Così risparmi tempo e puoi decidere con maggiore chiarezza.`,
},
    en: {
      title: "About",
      body: `iFindItForYou was created to simplify product research when choices are overwhelming and information is unclear.
Comparing offers, reviews, and specifications takes time and often does not lead to a confident decision.

The service combines the work of a human assistant with AI tools to analyze available options, verify relevant information, and filter out what does not fit the specific context.

The goal is not to show everything, but to select only what truly makes sense for real needs.
This saves time and supports clearer decisions.
`,
    },
    fr: {
      title: "À propos",
      body: `iFindItForYou est né pour simplifier la recherche de produits lorsque les choix sont trop nombreux et que les informations manquent de clarté.
Comparer des offres, des avis et des spécifications prend du temps et ne mène pas toujours à une décision sûre.

Le service combine le travail d’un assistant humain avec des outils d’intelligence artificielle pour analyser les options disponibles, vérifier les informations pertinentes et filtrer ce qui n’est pas adapté au contexte.

L’objectif n’est pas de tout montrer, mais de sélectionner uniquement ce qui a du sens pour des besoins réels.
Cela permet de gagner du temps et de décider plus clairement.
`,
    },
    de: {
      title: "Über uns",
      body: `iFindItForYou wurde entwickelt, um die Produktsuche zu vereinfachen, wenn die Auswahl zu groß und die Informationen unübersichtlich sind.
Der Vergleich von Angeboten, Bewertungen und Spezifikationen kostet Zeit und führt oft nicht zu einer sicheren Entscheidung.

Der Service kombiniert die Arbeit eines menschlichen Assistenten mit KI-Werkzeugen, um verfügbare Optionen zu analysieren, relevante Informationen zu prüfen und Ungeeignetes herauszufiltern.

Ziel ist es nicht, alles anzuzeigen, sondern nur das auszuwählen, was für reale Anforderungen sinnvoll ist.
So sparst du Zeit und triffst klarere Entscheidungen.
`,
    },
    es: {
      title: "Acerca de",
      body: `iFindItForYou nació para simplificar la búsqueda de productos cuando las opciones son demasiadas y la información no es clara.
Comparar ofertas, reseñas y especificaciones lleva tiempo y a menudo no conduce a una decisión segura.

El servicio combina el trabajo de un asistente humano con herramientas de IA para analizar las opciones disponibles, verificar la información relevante y descartar lo que no encaja en el contexto.

El objetivo no es mostrarlo todo, sino seleccionar solo lo que realmente tiene sentido para necesidades reales.
Así ahorras tiempo y tomas decisiones más claras.
`,
    },
  });
}

/* =========================
   FAQ
========================= */
export function getFaqCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "FAQ",
      body: `Qui trovi alcune risposte rapide alle domande più comuni.
Se hai un caso specifico o requisiti particolari, descrivili nella richiesta: più contesto fornisci, migliore sarà la selezione.

• Cosa devo includere nella richiesta?
Descrivi l’uso previsto, il contesto, il budget e i principali vincoli (dimensioni, compatibilità, tempi di consegna).
Indica anche ciò che vuoi evitare.

• Quante opzioni riceverò?
Riceverai una selezione breve e mirata: poche alternative davvero rilevanti, spiegate in modo chiaro.

• È un servizio automatico?
No. Un assistente umano utilizza strumenti di intelligenza artificiale e verifica manuale per filtrare e valutare le opzioni.

• Quanto tempo serve?
Dipende dalla complessità della richiesta, ma l’obiettivo è farti risparmiare tempo rispetto a una ricerca autonoma.

• Posso chiedere un confronto tra prodotti?
Sì. Puoi indicare modelli o link specifici e chiedere un confronto basato sul tuo utilizzo reale.

• Posso fare più richieste?
Sì. Ogni richiesta è indipendente e può riguardare prodotti o esigenze diverse.`,
    },

    en: {
      title: "FAQ",
      body: `Here you can find quick answers to common questions.
If you have a specific case or strict requirements, include them in your request: more context leads to better results.

• What should I include in my request?
Describe your intended use, context, budget, and main constraints (size, compatibility, delivery time).
Also mention what you want to avoid.

• How many options will I receive?
You will receive a short, focused selection: only a few truly relevant alternatives, clearly explained.

• Is this an automated service?
No. A human assistant uses AI tools together with manual verification to filter and evaluate options.

• How long does it take?
It depends on the complexity of the request, but the goal is to save you significant time compared to doing the research yourself.

• Can I ask for a comparison between products?
Yes. You can provide specific models or links and ask for a comparison based on your real use case.

• Can I submit multiple requests?
Yes. Each request is independent and can address different needs or products.`,
    },

    fr: {
      title: "FAQ",
      body: `Vous trouverez ici des réponses rapides aux questions les plus courantes.
Si votre cas est spécifique ou si vous avez des exigences particulières, précisez-les dans votre demande : plus il y a de contexte, meilleurs seront les résultats.

• Que dois-je inclure dans ma demande ?
Décrivez l’usage prévu, le contexte, le budget et les principales contraintes (taille, compatibilité, délais).
Indiquez également ce que vous souhaitez éviter.

• Combien d’options vais-je recevoir ?
Une sélection courte et ciblée : seulement quelques alternatives réellement pertinentes, expliquées clairement.

• Le service est-il automatisé ?
Non. Un assistant humain utilise des outils d’IA combinés à une vérification manuelle.

• Combien de temps cela prend-il ?
Cela dépend de la complexité de la demande, mais l’objectif est de vous faire gagner du temps.

• Puis-je demander une comparaison entre produits ?
Oui. Vous pouvez fournir des modèles ou des liens et demander une comparaison basée sur votre usage réel.

• Puis-je envoyer plusieurs demandes ?
Oui. Chaque demande est indépendante et peut concerner des besoins différents.`,
    },

    de: {
      title: "FAQ",
      body: `Hier findest du kurze Antworten auf häufig gestellte Fragen.
Wenn du einen speziellen Fall oder klare Anforderungen hast, beschreibe sie in deiner Anfrage: mehr Kontext führt zu besseren Ergebnissen.

• Was sollte ich in meiner Anfrage angeben?
Beschreibe den geplanten Einsatz, den Kontext, das Budget und wichtige Einschränkungen (Größe, Kompatibilität, Lieferzeit).
Erwähne auch, was du vermeiden möchtest.

• Wie viele Optionen erhalte ich?
Eine kurze, fokussierte Auswahl: nur wenige wirklich passende Alternativen, verständlich erklärt.

• Ist der Service automatisiert?
Nein. Ein menschlicher Assistent nutzt KI-Werkzeuge und manuelle Prüfungen.

• Wie lange dauert es?
Das hängt von der Komplexität ab, Ziel ist aber eine deutliche Zeitersparnis.

• Kann ich einen Produktvergleich anfragen?
Ja. Du kannst konkrete Modelle oder Links angeben und einen Vergleich basierend auf deinem Einsatz anfordern.

• Kann ich mehrere Anfragen stellen?
Ja. Jede Anfrage ist unabhängig und kann unterschiedliche Bedürfnisse abdecken.`,
    },

    es: {
      title: "Preguntas frecuentes",
      body: `Aquí encontrarás respuestas rápidas a las preguntas más comunes.
Si tu caso es específico o tienes requisitos claros, inclúyelos en tu solicitud: más contexto genera mejores resultados.

• ¿Qué debo incluir en mi solicitud?
Describe el uso previsto, el contexto, el presupuesto y las principales restricciones (tamaño, compatibilidad, tiempos).
Indica también lo que deseas evitar.

• ¿Cuántas opciones recibiré?
Una selección corta y enfocada: solo algunas alternativas realmente relevantes, explicadas con claridad.

• ¿Es un servicio automatizado?
No. Un asistente humano utiliza herramientas de IA junto con verificación manual.

• ¿Cuánto tiempo tarda?
Depende de la complejidad de la solicitud, pero el objetivo es ahorrarte tiempo.

• ¿Puedo pedir una comparación entre productos?
Sí. Puedes indicar modelos o enlaces y solicitar una comparación basada en tu uso real.

• ¿Puedo enviar varias solicitudes?
Sí. Cada solicitud es independiente y puede tratar necesidades diferentes.`,
    },
  });
}


/* =========================
   PRIVACY
========================= */

export function getPrivacyCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Privacy Policy",
      body: `Questa informativa spiega in modo chiaro come trattiamo i dati necessari a fornire il servizio iFindItForYou.

1) Quali dati raccogliamo
Possiamo raccogliere: dati di contatto (es. email), dati relativi all’account, contenuti inviati nella richiesta (preferenze, vincoli, link), dati tecnici essenziali (es. log e informazioni di sicurezza) e dati di pagamento gestiti tramite il nostro provider (non memorizziamo i dati completi della carta).

2) Perché li utilizziamo
Usiamo i dati per: creare e gestire l’account, erogare il servizio (analisi della richiesta e invio dei risultati), assistenza clienti, prevenzione abusi/frodi e miglioramento del prodotto.

3) Base giuridica
Trattiamo i dati principalmente per esecuzione del contratto/servizio richiesto, adempimenti legali e, dove applicabile, legittimo interesse (sicurezza e miglioramento) o consenso (es. comunicazioni).

4) Conservazione
Conserviamo i dati solo per il tempo necessario alle finalità indicate e secondo gli obblighi di legge. Puoi richiedere la cancellazione dell’account nei limiti previsti.

5) Condivisione con terze parti
Possiamo condividere dati con fornitori tecnici indispensabili (es. hosting, database, email) e con il provider di pagamento. Condividiamo solo ciò che serve a fornire il servizio.

6) Trasferimenti internazionali
Alcuni fornitori possono trattare dati fuori dal tuo paese. In tali casi adottiamo tutele adeguate (es. clausole contrattuali standard ove applicabile).

7) I tuoi diritti
Puoi richiedere accesso, rettifica, cancellazione, limitazione, opposizione e portabilità, nei limiti di legge. Puoi anche presentare reclamo all’autorità competente.

8) Contatti
Per richieste privacy e dati personali, contattaci tramite i canali indicati sul sito.`,
    },

    en: {
      title: "Privacy Policy",
      body: `This notice explains in a clear way how we process the data required to provide the iFindItForYou service.

1) What we collect
We may collect: contact details (e.g., email), account data, content you submit in your request (preferences, constraints, links), essential technical data (e.g., logs and security information), and payment data handled by our payment provider (we do not store full card details).

2) Why we use it
We use data to: create and manage your account, deliver the service (analyze your request and send results), provide customer support, prevent abuse/fraud, and improve the product.

3) Legal basis
We process data primarily to perform the requested service/contract, to comply with legal obligations, and, where applicable, based on legitimate interests (security and improvement) or consent (e.g., communications).

4) Retention
We keep data only as long as necessary for the purposes above and as required by law. You may request account deletion subject to applicable limits.

5) Sharing with third parties
We may share data with essential technical providers (e.g., hosting, database, email) and our payment provider. We share only what is needed to deliver the service.

6) International transfers
Some providers may process data outside your country. Where this happens, we apply appropriate safeguards (e.g., standard contractual clauses where applicable).

7) Your rights
You may request access, correction, deletion, restriction, objection, and portability, subject to legal limits. You may also lodge a complaint with the competent authority.

8) Contact
For privacy and personal data requests, contact us through the channels listed on the website.`,
    },

    fr: {
      title: "Politique de confidentialité",
      body: `Cette notice explique clairement comment nous traitons les données nécessaires pour fournir le service iFindItForYou.

1) Données collectées
Nous pouvons collecter : coordonnées (ex. email), données de compte, contenu envoyé dans la demande (préférences, contraintes, liens), données techniques essentielles (ex. journaux et sécurité) et données de paiement traitées par notre prestataire (nous ne stockons pas les données complètes de carte).

2) Finalités
Nous utilisons ces données pour : créer et gérer le compte, fournir le service (analyser la demande et envoyer les résultats), assurer l’assistance, prévenir les abus/fraudes et améliorer le produit.

3) Base juridique
Traitement principalement pour exécuter le service/contrat, respecter des obligations légales, et le cas échéant intérêt légitime (sécurité/amélioration) ou consentement (communications).

4) Conservation
Nous conservons les données uniquement le temps nécessaire et selon les obligations légales. Vous pouvez demander la suppression du compte dans les limites applicables.

5) Partage
Partage possible avec des prestataires techniques indispensables (hébergement, base de données, email) et le prestataire de paiement, uniquement dans la mesure nécessaire.

6) Transferts internationaux
Certains prestataires peuvent traiter des données hors de votre pays. Des garanties appropriées sont appliquées.

7) Vos droits
Vous pouvez demander l’accès, la rectification, la suppression, la limitation, l’opposition et la portabilité, dans les limites légales. Vous pouvez aussi déposer une réclamation auprès de l’autorité compétente.

8) Contact
Pour les demandes relatives à la confidentialité, contactez-nous via les canaux indiqués sur le site.`,
    },

    de: {
      title: "Datenschutzerklärung",
      body: `Diese Hinweise erklären verständlich, wie wir Daten verarbeiten, die zur Bereitstellung des iFindItForYou-Services erforderlich sind.

1) Welche Daten wir erheben
Wir können erheben: Kontaktdaten (z. B. E-Mail), Kontodaten, Inhalte deiner Anfrage (Präferenzen, Anforderungen, Links), notwendige technische Daten (z. B. Logs/Sicherheitsdaten) sowie Zahlungsdaten, die über unseren Zahlungsanbieter verarbeitet werden (wir speichern keine vollständigen Kartendaten).

2) Wofür wir sie nutzen
Zur: Kontoerstellung und -verwaltung, Bereitstellung des Services (Analyse der Anfrage und Versand der Ergebnisse), Support, Missbrauchs-/Betrugsprävention und Produktverbesserung.

3) Rechtsgrundlagen
Verarbeitung überwiegend zur Vertragserfüllung/Servicebereitstellung, zur Einhaltung gesetzlicher Pflichten sowie ggf. aufgrund berechtigter Interessen (Sicherheit/Verbesserung) oder Einwilligung (Kommunikation).

4) Speicherdauer
Wir speichern Daten nur so lange wie erforderlich und gesetzlich notwendig. Löschung des Kontos ist auf Anfrage im rechtlichen Rahmen möglich.

5) Weitergabe an Dritte
Weitergabe an notwendige technische Dienstleister (Hosting, Datenbank, E-Mail) und den Zahlungsanbieter, jeweils nur soweit erforderlich.

6) Internationale Übermittlungen
Einige Anbieter verarbeiten Daten außerhalb deines Landes. Dabei werden geeignete Schutzmaßnahmen angewendet.

7) Deine Rechte
Du kannst Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch und Datenübertragbarkeit verlangen – im gesetzlichen Rahmen. Beschwerden sind bei der zuständigen Behörde möglich.

8) Kontakt
Für Datenschutzanfragen nutze bitte die auf der Website angegebenen Kontaktwege.`,
    },

    es: {
      title: "Política de privacidad",
      body: `Este aviso explica de forma clara cómo tratamos los datos necesarios para prestar el servicio iFindItForYou.

1) Qué datos recopilamos
Podemos recopilar: datos de contacto (p. ej., email), datos de cuenta, contenido de tu solicitud (preferencias, restricciones, enlaces), datos técnicos esenciales (p. ej., registros y seguridad) y datos de pago gestionados por nuestro proveedor (no almacenamos los datos completos de la tarjeta).

2) Para qué los usamos
Para: crear y gestionar la cuenta, prestar el servicio (analizar la solicitud y enviar resultados), soporte, prevención de abusos/fraude y mejora del producto.

3) Base legal
Tratamos datos principalmente para ejecutar el servicio/contrato solicitado, cumplir obligaciones legales y, cuando corresponda, por interés legítimo (seguridad/mejora) o consentimiento (comunicaciones).

4) Conservación
Conservamos los datos solo el tiempo necesario y según la ley. Puedes solicitar la eliminación de la cuenta dentro de los límites aplicables.

5) Compartición con terceros
Podemos compartir datos con proveedores técnicos esenciales (hosting, base de datos, email) y con el proveedor de pagos, solo lo necesario para prestar el servicio.

6) Transferencias internacionales
Algunos proveedores pueden tratar datos fuera de tu país. Aplicamos garantías adecuadas cuando procede.

7) Tus derechos
Puedes solicitar acceso, rectificación, eliminación, limitación, oposición y portabilidad, sujeto a la normativa aplicable. También puedes presentar una reclamación ante la autoridad competente.

8) Contacto
Para solicitudes de privacidad y datos personales, contáctanos a través de los canales indicados en el sitio web.`,
    },
  });
}

/* =========================
   TERMS
========================= */

export function getTermsCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Termini e Condizioni",
      body: `Questi termini regolano l’uso del servizio iFindItForYou. Utilizzando il servizio, accetti i termini descritti di seguito.

1) Descrizione del servizio
iFindItForYou fornisce un servizio di supporto alla selezione e valutazione di prodotti. Il servizio combina l’analisi di un assistente umano con strumenti di intelligenza artificiale per proporre una selezione di opzioni rilevanti in base alle informazioni fornite dall’utente.

2) Natura delle informazioni
Le informazioni fornite hanno finalità informative e di supporto decisionale. Non costituiscono consulenza professionale, tecnica o legale. La decisione finale di acquisto spetta sempre all’utente.

3) Accuratezza e disponibilità
Ci impegniamo a fornire informazioni accurate e aggiornate, ma non garantiamo l’assenza di errori, omissioni o variazioni di prezzo, disponibilità o caratteristiche dei prodotti.

4) Responsabilità
iFindItForYou non è responsabile per decisioni di acquisto, danni diretti o indiretti, perdite economiche o conseguenze derivanti dall’uso delle informazioni fornite.

5) Utilizzo corretto
L’utente si impegna a fornire informazioni veritiere e a utilizzare il servizio in modo lecito, senza abusarne o tentare di aggirarne le limitazioni.

6) Pagamenti e piani
Eventuali servizi a pagamento sono descritti separatamente. I pagamenti sono gestiti tramite fornitori terzi e soggetti ai loro termini.

7) Modifiche al servizio
Ci riserviamo il diritto di modificare, sospendere o interrompere il servizio, in tutto o in parte, in qualsiasi momento.

8) Modifiche ai termini
I presenti termini possono essere aggiornati. Le modifiche saranno pubblicate su questa pagina e avranno effetto dalla data di pubblicazione.

9) Contatti
Per domande sui termini e condizioni, puoi contattarci tramite i canali indicati sul sito.`,
    },

    en: {
      title: "Terms and Conditions",
      body: `These terms govern the use of the iFindItForYou service. By using the service, you agree to the terms outlined below.

1) Service description
iFindItForYou provides a product selection and evaluation support service. It combines the work of a human assistant with AI tools to propose relevant options based on the information provided by the user.

2) Nature of information
The information provided is for informational and decision-support purposes only. It does not constitute professional, technical, or legal advice. The final purchase decision always remains with the user.

3) Accuracy and availability
We strive to provide accurate and up-to-date information, but we do not guarantee the absence of errors, omissions, or changes in price, availability, or product features.

4) Liability
iFindItForYou is not responsible for purchase decisions, direct or indirect damages, financial losses, or consequences arising from the use of the provided information.

5) Proper use
Users agree to provide truthful information and to use the service lawfully, without abuse or attempts to bypass limitations.

6) Payments and plans
Any paid services are described separately. Payments are processed through third-party providers and subject to their terms.

7) Service changes
We reserve the right to modify, suspend, or discontinue the service, in whole or in part, at any time.

8) Changes to terms
These terms may be updated. Changes will be posted on this page and will take effect upon publication.

9) Contact
For questions regarding these terms and conditions, please contact us through the channels listed on the website.`,
    },

    fr: {
      title: "Conditions générales",
      body: `Les présentes conditions régissent l’utilisation du service iFindItForYou. En utilisant le service, vous acceptez les conditions ci-dessous.

1) Description du service
iFindItForYou fournit un service d’aide à la sélection et à l’évaluation de produits, combinant le travail d’un assistant humain et des outils d’IA.

2) Nature des informations
Les informations fournies sont uniquement informatives et destinées à aider à la décision. Elles ne constituent pas un conseil professionnel, technique ou juridique.

3) Exactitude et disponibilité
Nous nous efforçons de fournir des informations exactes et à jour, sans garantir l’absence d’erreurs, d’omissions ou de variations.

4) Responsabilité
iFindItForYou ne saurait être tenu responsable des décisions d’achat ou des dommages résultant de l’utilisation des informations fournies.

5) Utilisation appropriée
L’utilisateur s’engage à fournir des informations exactes et à utiliser le service de manière licite.

6) Paiements
Les services payants sont décrits séparément et les paiements sont gérés par des prestataires tiers.

7) Modifications du service
Nous nous réservons le droit de modifier ou d’interrompre le service à tout moment.

8) Modifications des conditions
Ces conditions peuvent être mises à jour et les changements prendront effet dès leur publication.

9) Contact
Pour toute question, contactez-nous via les canaux indiqués sur le site.`,
    },

    de: {
      title: "Allgemeine Geschäftsbedingungen",
      body: `Diese Bedingungen regeln die Nutzung des iFindItForYou-Dienstes. Durch die Nutzung des Dienstes stimmst du den folgenden Bedingungen zu.

1) Leistungsbeschreibung
iFindItForYou bietet Unterstützung bei der Produktauswahl und -bewertung durch die Kombination eines menschlichen Assistenten mit KI-Werkzeugen.

2) Art der Informationen
Die bereitgestellten Informationen dienen ausschließlich Informations- und Entscheidungszwecken und stellen keine professionelle Beratung dar.

3) Genauigkeit und Verfügbarkeit
Wir bemühen uns um korrekte und aktuelle Informationen, übernehmen jedoch keine Garantie für Fehler oder Änderungen.

4) Haftung
iFindItForYou haftet nicht für Kaufentscheidungen oder Schäden, die aus der Nutzung der Informationen entstehen.

5) Ordnungsgemäße Nutzung
Der Nutzer verpflichtet sich zu wahrheitsgemäßen Angaben und zur rechtmäßigen Nutzung des Dienstes.

6) Zahlungen
Kostenpflichtige Leistungen werden separat beschrieben. Zahlungen erfolgen über Drittanbieter.

7) Änderungen des Dienstes
Wir behalten uns vor, den Dienst jederzeit zu ändern oder einzustellen.

8) Änderungen der Bedingungen
Diese Bedingungen können aktualisiert werden. Änderungen treten mit Veröffentlichung in Kraft.

9) Kontakt
Bei Fragen zu diesen Bedingungen kontaktiere uns über die auf der Website angegebenen Wege.`,
    },

    es: {
      title: "Términos y condiciones",
      body: `Estos términos regulan el uso del servicio iFindItForYou. Al utilizar el servicio, aceptas los términos que se indican a continuación.

1) Descripción del servicio
iFindItForYou ofrece un servicio de apoyo a la selección y evaluación de productos combinando un asistente humano con herramientas de IA.

2) Naturaleza de la información
La información proporcionada es solo informativa y de apoyo a la decisión. No constituye asesoramiento profesional, técnico ni legal.

3) Exactitud y disponibilidad
Nos esforzamos por ofrecer información precisa y actualizada, sin garantizar la ausencia de errores o cambios.

4) Responsabilidad
iFindItForYou no se hace responsable de decisiones de compra ni de daños derivados del uso de la información.

5) Uso adecuado
El usuario se compromete a proporcionar información veraz y a utilizar el servicio de forma lícita.

6) Pagos
Los servicios de pago se describen por separado y los pagos se procesan a través de proveedores externos.

7) Cambios en el servicio
Nos reservamos el derecho de modificar o interrumpir el servicio en cualquier momento.

8) Cambios en los términos
Estos términos pueden actualizarse. Los cambios entran en vigor tras su publicación.

9) Contacto
Para consultas sobre estos términos, contáctanos a través de los canales indicados en el sitio web.`,
    },
  });
}

