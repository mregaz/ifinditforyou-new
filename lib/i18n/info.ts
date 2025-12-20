// lib/i18n/info.ts
import type { Locale } from "@/lib/i18n-config";

type InfoCopy = {
  title: string;
  body: string;
};

function pick<T>(locale: Locale, map: Record<Locale, T>): T {
  return map[locale] ?? map.it;
}

export function getHowItWorksCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Come funziona",
      body:
        "Con iFindItForYou descrivi il prodotto che ti serve, come lo userai e i vincoli principali (budget, tempi di consegna, ecc.). Un assistente umano combina AI e ricerca manuale, filtra centinaia di opzioni e ti invia solo una selezione breve, chiara e ben spiegata.",
    },
    en: {
      title: "How it works",
      body:
        "With iFindItForYou you describe the product you need, how you will use it and your main constraints (budget, delivery time, etc.). A human assistant combines AI and manual research to filter hundreds of options and sends you only a short, clear and well-explained selection.",
    },
    fr: {
      title: "Comment ça marche",
      body:
        "Avec iFindItForYou, vous décrivez le produit dont vous avez besoin, votre usage et vos contraintes (budget, délai, etc.). Un assistant humain combine IA et recherche manuelle pour filtrer des centaines d’options et ne vous envoyer qu’une sélection courte et bien expliquée.",
    },
    de: {
      title: "So funktioniert’s",
      body:
        "Mit iFindItForYou beschreibst du das Produkt, deinen Einsatz und deine wichtigsten Kriterien (Budget, Lieferzeit usw.). Ein menschlicher Assistent kombiniert KI und manuelle Recherche, filtert Hunderte Optionen und sendet dir nur eine kurze, klar erklärte Auswahl.",
    },
    es: {
      title: "Cómo funciona",
      body:
        "Con iFindItForYou describes el producto que necesitas, cómo lo usarás y tus principales restricciones (presupuesto, entrega, etc.). Un asistente humano combina IA e investigación manual para filtrar cientos de opciones y enviarte solo una selección corta, clara y bien explicada.",
    },
  });
}

export function getAboutCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Chi siamo",
      body:
        "iFindItForYou è un servizio di ricerca prodotti guidato da un assistente umano che usa strumenti AI e verifica manuale. L’obiettivo è farti risparmiare tempo: ricevi poche opzioni davvero adatte, spiegate chiaramente.",
    },
    en: {
      title: "About",
      body:
        "iFindItForYou is a product research service guided by a human assistant who uses AI tools and manual verification. The goal is to save you time: you receive a small set of truly relevant options, clearly explained.",
    },
    fr: {
      title: "À propos",
      body:
        "iFindItForYou est un service de recherche de produits guidé par un assistant humain qui utilise des outils d’IA et une vérification manuelle. L’objectif est de vous faire gagner du temps : une courte sélection, clairement expliquée.",
    },
    de: {
      title: "Über uns",
      body:
        "iFindItForYou ist ein Produktrecherche-Service, der von einem menschlichen Assistenten geführt wird und KI-Tools sowie manuelle Prüfung nutzt. Ziel ist Zeitersparnis: eine kurze, gut erklärte Auswahl wirklich passender Optionen.",
    },
    es: {
      title: "Acerca de",
      body:
        "iFindItForYou es un servicio de búsqueda de productos guiado por un asistente humano que usa herramientas de IA y verificación manual. El objetivo es ahorrarte tiempo: recibes pocas opciones realmente relevantes, explicadas con claridad.",
    },
  });
}

export function getFaqCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "FAQ",
      body:
        "Qui risponderemo alle domande più frequenti su come funziona il servizio, tempi, qualità delle proposte e piani. (Testo placeholder: inserisci le FAQ complete quando vuoi.)",
    },
    en: {
      title: "FAQ",
      body:
        "Here we answer the most common questions about how the service works, timing, result quality, and plans. (Placeholder text: add the full FAQ when ready.)",
    },
    fr: {
      title: "FAQ",
      body:
        "Nous répondons ici aux questions les plus fréquentes sur le fonctionnement du service, les délais, la qualité et les offres. (Texte provisoire.)",
    },
    de: {
      title: "FAQ",
      body:
        "Hier beantworten wir die häufigsten Fragen zu Ablauf, Zeiten, Qualität der Ergebnisse und Tarifen. (Platzhaltertext.)",
    },
    es: {
      title: "Preguntas frecuentes",
      body:
        "Aquí respondemos a las preguntas más comunes sobre el servicio, tiempos, calidad y planes. (Texto provisional.)",
    },
  });
}

export function getPrivacyCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Privacy Policy",
      body:
        "Questa pagina descrive come raccogliamo e trattiamo i dati. (Testo placeholder: inserisci la policy completa.)",
    },
    en: {
      title: "Privacy Policy",
      body:
        "This page explains how we collect and process data. (Placeholder text: add the full policy.)",
    },
    fr: {
      title: "Politique de confidentialité",
      body:
        "Cette page décrit comment nous collectons et traitons les données. (Texte provisoire.)",
    },
    de: {
      title: "Datenschutzerklärung",
      body:
        "Diese Seite beschreibt, wie wir Daten erheben und verarbeiten. (Platzhaltertext.)",
    },
    es: {
      title: "Política de privacidad",
      body:
        "Esta página explica cómo recopilamos y tratamos los datos. (Texto provisional.)",
    },
  });
}

export function getTermsCopy(locale: Locale): InfoCopy {
  return pick(locale, {
    it: {
      title: "Termini e condizioni",
      body:
        "Questa pagina contiene i termini di utilizzo del servizio. (Testo placeholder: inserisci i termini completi.)",
    },
    en: {
      title: "Terms & Conditions",
      body:
        "This page contains the terms of service. (Placeholder text: add the full terms.)",
    },
    fr: {
      title: "Conditions d’utilisation",
      body:
        "Cette page contient les conditions d’utilisation du service. (Texte provisoire.)",
    },
    de: {
      title: "Nutzungsbedingungen",
      body:
        "Diese Seite enthält die Nutzungsbedingungen. (Platzhaltertext.)",
    },
    es: {
      title: "Términos y condiciones",
      body:
        "Esta página contiene los términos del servicio. (Texto provisional.)",
    },
  });
}
