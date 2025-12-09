// app/pro/proTexts.ts

export type ProLang = "it" | "en" | "fr" | "de";

type ProTexts = {
  heroTitle: string;
  heroSubtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  // quando vuoi puoi aggiungere altre chiavi qui
};

export const PRO_TEXTS: Record<ProLang, ProTexts> = {
  it: {
    heroTitle: "Piano PRO – iFindItForYou",
    heroSubtitle:
      "Attiva il piano PRO: ricerche illimitate, risposta prioritaria e supporto dedicato per trovare sempre il prodotto giusto.",
    ctaPrimary: "Attiva il PRO",
    ctaSecondary: "Scopri tutti i vantaggi",
  },
  en: {
    heroTitle: "PRO Plan – iFindItForYou",
    heroSubtitle:
      "Upgrade to the PRO plan: unlimited searches, priority responses and dedicated support to always find the right products.",
    ctaPrimary: "Upgrade to PRO",
    ctaSecondary: "See all benefits",
  },
  fr: {
    heroTitle: "Offre PRO – iFindItForYou",
    heroSubtitle:
      "Passez à l’offre PRO : recherches illimitées, réponses prioritaires et support dédié pour trouver les meilleurs produits.",
    ctaPrimary: "Passer au PRO",
    ctaSecondary: "Voir tous les avantages",
  },
  de: {
    heroTitle: "PRO-Tarif – iFindItForYou",
    heroSubtitle:
      "Wechsle zum PRO-Tarif: unbegrenzte Suchen, priorisierte Antworten und persönlicher Support für die richtigen Produkte.",
    ctaPrimary: "PRO aktivieren",
    ctaSecondary: "Alle Vorteile ansehen",
  },
};
