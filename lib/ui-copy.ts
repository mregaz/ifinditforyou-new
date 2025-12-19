export const SUPPORTED_LOCALES = ["it", "en", "fr", "de", "es"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export function toLocale(v?: string | null): Locale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(v ?? "")
    ? (v as Locale)
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
