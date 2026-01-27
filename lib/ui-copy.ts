export const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export function toLocale(v?: string | null): Locale {
  if (!v) return "it";

  const normalized = v.toLowerCase().replace("_", "-");
  const short = normalized.split("-")[0];

  return (SUPPORTED_LOCALES as readonly string[]).includes(short)
    ? (short as Locale)
    : "it";
}


export const REGISTER_COPY: Record<
  Locale,
  {
    title: string;
    email: string;
    password: string;
    cta: string;
    loading: string;
    haveAccount: string;
    login: string;
  }
> = {
  it: {
    title: "Crea un account",
    email: "Email",
    password: "Password",
    cta: "Registrati",
    loading: "Creazione in corso...",
    haveAccount: "Hai già un account?",
    login: "Accedi",
  },
  en: {
    title: "Create an account",
    email: "Email",
    password: "Password",
    cta: "Sign up",
    loading: "Creating account...",
    haveAccount: "Already have an account?",
    login: "Sign in",
  },
  fr: {
    title: "Créer un compte",
    email: "Email",
    password: "Mot de passe",
    cta: "Créer un compte",
    loading: "Création en cours...",
    haveAccount: "Vous avez déjà un compte ?",
    login: "Se connecter",
  },
  de: {
    title: "Konto erstellen",
    email: "E-Mail",
    password: "Passwort",
    cta: "Registrieren",
    loading: "Konto wird erstellt...",
    haveAccount: "Schon ein Konto?",
    login: "Anmelden",
  },
  es: {
    title: "Crear una cuenta",
    email: "Email",
    password: "Contraseña",
    cta: "Crear cuenta",
    loading: "Creando cuenta...",
    haveAccount: "¿Ya tienes una cuenta?",
    login: "Iniciar sesión",
  },
};

export const LOGIN_COPY: Record<
  Locale,
  {
    title: string;
    email: string;
    password: string;
    cta: string;
    loading: string;
    noAccount: string;
    register: string;
  }
> = {
  it: {
    title: "Accedi a IFindItForYou",
    email: "Email",
    password: "Password",
    cta: "Accedi",
    loading: "Accesso in corso...",
    noAccount: "Non hai ancora un account?",
    register: "Registrati",
  },
  en: {
    title: "Sign in to IFindItForYou",
    email: "Email",
    password: "Password",
    cta: "Sign in",
    loading: "Signing in...",
    noAccount: "Don’t have an account?",
    register: "Sign up",
  },
  fr: {
    title: "Connexion à IFindItForYou",
    email: "Email",
    password: "Mot de passe",
    cta: "Se connecter",
    loading: "Connexion...",
    noAccount: "Vous n’avez pas de compte ?",
    register: "Créer un compte",
  },
  de: {
    title: "Bei IFindItForYou anmelden",
    email: "E-Mail",
    password: "Passwort",
    cta: "Anmelden",
    loading: "Anmeldung...",
    noAccount: "Noch kein Konto?",
    register: "Registrieren",
  },
  es: {
    title: "Inicia sesión en IFindItForYou",
    email: "Email",
    password: "Contraseña",
    cta: "Iniciar sesión",
    loading: "Iniciando...",
    noAccount: "¿No tienes cuenta?",
    register: "Crear cuenta",
  },
};
export const ACCOUNT_COPY: Record<
  Locale,
  {
    planLabel: string;
    freeLabel: string;
    proLabel: string;
    overviewTitle: string;
    settingsLabel: string;
    historyLabel: string;
  }
> = {
  it: {
    planLabel: "Piano",
    freeLabel: "Gratis",
    proLabel: "PRO",
    overviewTitle: "Panoramica",
    settingsLabel: "Impostazioni",
    historyLabel: "Cronologia",
  },
  en: {
    planLabel: "Plan",
    freeLabel: "Free",
    proLabel: "PRO",
    overviewTitle: "Overview",
    settingsLabel: "Settings",
    historyLabel: "History",
  },
  fr: {
    planLabel: "Forfait",
    freeLabel: "Gratuit",
    proLabel: "PRO",
    overviewTitle: "Aperçu",
    settingsLabel: "Paramètres",
    historyLabel: "Historique",
  },
  de: {
    planLabel: "Tarif",
    freeLabel: "Kostenlos",
    proLabel: "PRO",
    overviewTitle: "Übersicht",
    settingsLabel: "Einstellungen",
    historyLabel: "Verlauf",
  },
  es: {
    planLabel: "Plan",
    freeLabel: "Gratis",
    proLabel: "PRO",
    overviewTitle: "Resumen",
    settingsLabel: "Ajustes",
    historyLabel: "Historial",
  },
};
export const HOME_COPY: Record<
  Locale,
  {
    heroTitle: string;
    heroSubtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  }
> = {
  it: {
    heroTitle: "…",
    heroSubtitle: "…",
    ctaPrimary: "…",
    ctaSecondary: "…",
  },
  en: {
    heroTitle: "…",
    heroSubtitle: "…",
    ctaPrimary: "…",
    ctaSecondary: "…",
  },

  // fallback temporaneo: fr/de/es = en
  fr: {} as any,
  de: {} as any,
  es: {} as any,
};
  
 {
  it: {
  disclaimer:
    "Queste sono scelte di esempio: non cito modelli o prezzi reali finché non colleghiamo dati affidabili.",

  evGateDiagnosis:
    "Per scegliere un’auto elettrica da famiglia senza sparare consigli a caso, mi manca un’informazione critica sulla ricarica e/o sull’uso.",

  evGateCompA_Title: "Compromesso A: ottimizza per ricarica facile",
  evGateCompA_Why:
    "Se puoi caricare a casa, puoi scegliere in modo più libero e ridurre lo stress (soprattutto con famiglia).",
  evGateCompA_Tradeoff:
    "Se non puoi caricare a casa, devi dare più peso a rete/velocità di ricarica e pianificazione.",

  evGateCompB_Title: "Compromesso B: ottimizza per autonomia reale",
  evGateCompB_Why:
    "Se fai tanta autostrada o vivi in zone fredde, l’autonomia reale conta più della scheda tecnica.",
  evGateCompB_Tradeoff:
    "Per aumentare autonomia reale spesso paghi peso/costo o rinunci a qualche optional.",

  evGateQuestion: "Domanda secca: puoi caricare a casa (wallbox/garage) oppure no?",
  evGateDecisionWithBudget: (budget) =>
    `Con budget massimo ${budget}, posso darti 3 scelte sensate appena chiarisci ricarica e uso principale.`,
  evGateDecisionNoBudget:
    "Posso darti 3 scelte sensate appena chiarisci ricarica e uso principale.",
},


  en: {
    disclaimer:
      "These are example choices: I won’t name real models or prices until we connect reliable data.",

    evGateDiagnosis:
      "To recommend a family EV without guessing, I’m missing a critical detail about charging and/or usage.",
    evGateCompA_Title: "Compromise A: optimize for easy charging",
    evGateCompA_Why:
      "If you can charge at home, you have far more flexibility and much lower day-to-day stress (especially for family use).",
    evGateCompA_Tradeoff:
      "If you can’t charge at home, you must prioritize charging network/speed and planning.",
    evGateCompB_Title: "Compromise B: optimize for real-world range",
    evGateCompB_Why:
      "If you do lots of highway driving or live in cold areas, real-world range matters more than brochure numbers.",
    evGateCompB_Tradeoff:
      "More real-world range often means higher cost/weight or fewer extras.",
    evGateQuestion: "Quick question: can you charge at home (wallbox/garage), yes or no?",
    evGateDecisionWithBudget: (budget) =>
      `With a max budget of ${budget}, I can give you 3 solid options as soon as you confirm charging and primary usage.`,
    evGateDecisionNoBudget:
      "I can give you 3 solid options as soon as you confirm charging and primary usage.",
  },

  fr: {
    disclaimer:
      "Ce sont des choix d’exemple : je ne cite pas de modèles ni de prix réels tant qu’on n’a pas de données fiables.",

    evGateDiagnosis:
      "Pour recommander une voiture électrique familiale sans deviner, il me manque une info critique sur la recharge et/ou l’usage.",
    evGateCompA_Title: "Compromis A : optimiser la recharge facile",
    evGateCompA_Why:
      "Si vous pouvez recharger à domicile, vous avez beaucoup plus de flexibilité et moins de stress au quotidien (surtout en famille).",
    evGateCompA_Tradeoff:
      "Sans recharge à domicile, il faut prioriser réseau/vitesse de recharge et planification.",
    evGateCompB_Title: "Compromis B : optimiser l’autonomie réelle",
    evGateCompB_Why:
      "Si vous faites beaucoup d’autoroute ou vivez en zone froide, l’autonomie réelle compte plus que la fiche technique.",
    evGateCompB_Tradeoff:
      "Plus d’autonomie réelle implique souvent plus de coût/poids ou moins d’options.",
    evGateQuestion: "Question rapide : pouvez-vous recharger à la maison (wallbox/garage), oui ou non ?",
    evGateDecisionWithBudget: (budget) =>
      `Avec un budget max de ${budget}, je peux te proposer 3 options solides dès que tu confirmes la recharge et l’usage principal.`,
    evGateDecisionNoBudget:
      "Je peux te proposer 3 options solides dès que tu confirmes la recharge et l’usage principal.",
  },

  de: {
    disclaimer:
      "Das sind Beispieloptionen: Ich nenne keine echten Modelle oder Preise, bis wir verlässliche Daten anbinden.",

    evGateDiagnosis:
      "Um ein Familien-EV sinnvoll zu empfehlen, ohne zu raten, fehlt mir eine kritische Info zur Lademöglichkeit und/oder Nutzung.",
    evGateCompA_Title: "Kompromiss A: auf einfaches Laden optimieren",
    evGateCompA_Why:
      "Wenn du zu Hause laden kannst, hast du deutlich mehr Freiheit und weniger Alltagsstress (gerade mit Familie).",
    evGateCompA_Tradeoff:
      "Ohne Laden zu Hause musst du Lade-Netz/Speed und Planung stärker priorisieren.",
    evGateCompB_Title: "Kompromiss B: auf reale Reichweite optimieren",
    evGateCompB_Why:
      "Bei viel Autobahn oder Kälte zählt die reale Reichweite mehr als Prospektwerte.",
    evGateCompB_Tradeoff:
      "Mehr reale Reichweite bedeutet oft höhere Kosten/Gewicht oder weniger Extras.",
    evGateQuestion: "Kurze Frage: kannst du zu Hause laden (Wallbox/Garage) – ja oder nein?",
    evGateDecisionWithBudget: (budget) =>
      `Mit einem Max-Budget von ${budget} kann ich dir 3 sinnvolle Optionen geben, sobald Laden und Hauptnutzung klar sind.`,
    evGateDecisionNoBudget:
      "Ich kann dir 3 sinnvolle Optionen geben, sobald Laden und Hauptnutzung klar sind.",
  },

  es: {
    disclaimer:
      "Estas son opciones de ejemplo: no mencionaré modelos ni precios reales hasta conectar datos fiables.",

    evGateDiagnosis:
      "Para recomendar un EV familiar sin adivinar, me falta un dato crítico sobre carga y/o uso.",
    evGateCompA_Title: "Compromiso A: optimizar carga fácil",
    evGateCompA_Why:
      "Si puedes cargar en casa, tienes mucha más flexibilidad y menos estrés diario (especialmente con familia).",
    evGateCompA_Tradeoff:
      "Si no puedes cargar en casa, debes priorizar red/velocidad de carga y planificación.",
    evGateCompB_Title: "Compromiso B: optimizar autonomía real",
    evGateCompB_Why:
      "Si haces mucha autopista o vives en zonas frías, la autonomía real importa más que la ficha técnica.",
    evGateCompB_Tradeoff:
      "Más autonomía real suele implicar más coste/peso o menos extras.",
    evGateQuestion: "Pregunta rápida: ¿puedes cargar en casa (wallbox/garaje), sí o no?",
    evGateDecisionWithBudget: (budget) =>
      `Con un presupuesto máximo de ${budget}, puedo darte 3 opciones sólidas en cuanto confirmes carga y uso principal.`,
    evGateDecisionNoBudget:
      "Puedo darte 3 opciones sólidas en cuanto confirmes carga y uso principal.",
  },
};
import type { Locale } from "@/lib/lang";

export type DecideCopy = {
  disclaimer: string;

  evGateDiagnosis: string;

  evGateCompA_Title: string;
  evGateCompA_Why: string;
  evGateCompA_Tradeoff: string;

  evGateCompB_Title: string;
  evGateCompB_Why: string;
  evGateCompB_Tradeoff: string;

  evGateQuestion: string;
  evGateDecisionWithBudget: (budget: string) => string;
  evGateDecisionNoBudget: string;
};

export const DECIDE_COPY: Record<Locale, DecideCopy> = {
  it: {
    disclaimer:
      "Queste sono scelte di esempio: non cito modelli o prezzi reali finché non colleghiamo dati affidabili.",

    evGateDiagnosis:
      "Per scegliere un’auto elettrica da famiglia senza sparare consigli a caso, mi manca un’informazione critica sulla ricarica e/o sull’uso.",

    evGateCompA_Title: "Compromesso A: ottimizza per ricarica facile",
    evGateCompA_Why:
      "Se puoi caricare a casa, puoi scegliere in modo più libero e ridurre lo stress (soprattutto con famiglia).",
    evGateCompA_Tradeoff:
      "Se non puoi caricare a casa, devi dare più peso a rete/velocità di ricarica e pianificazione.",

    evGateCompB_Title: "Compromesso B: ottimizza per autonomia reale",
    evGateCompB_Why:
      "Se fai tanta autostrada o vivi in zone fredde, l’autonomia reale conta più della scheda tecnica.",
    evGateCompB_Tradeoff:
      "Per aumentare autonomia reale spesso paghi peso/costo o rinunci a qualche optional.",

    evGateQuestion: "Domanda secca: puoi caricare a casa (wallbox/garage) oppure no?",
    evGateDecisionWithBudget: (budget) =>
      "Con budget massimo " + budget + ", posso darti 3 scelte sensate appena chiarisci ricarica e uso principale.",
    evGateDecisionNoBudget:
      "Posso darti 3 scelte sensate appena chiarisci ricarica e uso principale.",
  },

  en: {
    disclaimer:
      "These are example choices: I won’t name real models or prices until we connect reliable data.",

    evGateDiagnosis:
      "To recommend a family EV without guessing, I’m missing a critical detail about charging and/or usage.",

    evGateCompA_Title: "Compromise A: optimize for easy charging",
    evGateCompA_Why:
      "If you can charge at home, you have far more flexibility and much lower day-to-day stress (especially for family use).",
    evGateCompA_Tradeoff:
      "If you can’t charge at home, you must prioritize charging network/speed and planning.",

    evGateCompB_Title: "Compromise B: optimize for real-world range",
    evGateCompB_Why:
      "If you do lots of highway driving or live in cold areas, real-world range matters more than brochure numbers.",
    evGateCompB_Tradeoff:
      "More real-world range often means higher cost/weight or fewer extras.",

    evGateQuestion: "Quick question: can you charge at home (wallbox/garage), yes or no?",
    evGateDecisionWithBudget: (budget) =>
      "With a max budget of " + budget + ", I can give you 3 solid options as soon as you confirm charging and primary usage.",
    evGateDecisionNoBudget:
      "I can give you 3 solid options as soon as you confirm charging and primary usage.",
  },

  // fallback temporaneo (stile tuo)
  fr: {} as any,
  de: {} as any,
  es: {} as any,
};

DECIDE_COPY.fr = DECIDE_COPY.en;
DECIDE_COPY.de = DECIDE_COPY.en;
DECIDE_COPY.es = DECIDE_COPY.en;


HOME_COPY.fr = HOME_COPY.en;
HOME_COPY.de = HOME_COPY.en;
HOME_COPY.es = HOME_COPY.en;
