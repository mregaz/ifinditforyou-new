// lib/i18n/dashboard.ts
export type Locale = 'it' | 'en' | 'fr' | 'de' | 'es'

type DashboardCopy = {
  account: string
  overview: string
  history: string
  settings: string
  logout: string

  planTitle: string
  currentPlanFree: string
  currentPlanPro: string
  renewsAt: string
  manageInPortal: string
  upgradeToPro: string

  historyTitle: string
  historyEmpty: string
  historyDelete: string
  historyDeleteAll: string
  historyQuery: string
  historyDate: string
  historyStatus: string

  settingsTitle: string
  languageLabel: string
  languageAuto: string
  languageSaved: string

  deleteTitle: string
  deleteWarning: string
  deleteConfirmLabel: string
  deletePlaceholder: string
  deleteButton: string
  deleteConfirmText: string
}

export const dashboardCopy: Record<Locale, DashboardCopy> = {
  it: {
    account: 'Account',
    overview: 'Panoramica',
    history: 'Cronologia ricerche',
    settings: 'Impostazioni',
    logout: 'Esci',

    planTitle: 'Dettagli piano',
    currentPlanFree: 'Piano attuale: Free',
    currentPlanPro: 'Piano attuale: PRO',
    renewsAt: 'Rinnovo il',
    manageInPortal: 'Gestisci nel Portale Stripe',
    upgradeToPro: 'Passa al piano PRO',

    historyTitle: 'Cronologia ricerche',
    historyEmpty: 'Non hai ancora effettuato ricerche.',
    historyDelete: 'Elimina',
    historyDeleteAll: 'Elimina tutto',
    historyQuery: 'Ricerca',
    historyDate: 'Data',
    historyStatus: 'Stato',

    settingsTitle: 'Impostazioni account',
    languageLabel: 'Lingua preferita',
    languageAuto: 'Automatica (in base al browser)',
    languageSaved: 'Lingua aggiornata',

    deleteTitle: 'Eliminazione account',
    deleteWarning:
      'Questa azione è definitiva e non può essere annullata. Verranno cancellate tutte le tue ricerche e i dati associati.',
    deleteConfirmLabel: 'Per confermare, scrivi "DELETE" nel campo qui sotto:',
    deletePlaceholder: 'Scrivi DELETE per confermare',
    deleteButton: 'Elimina definitivamente',
    deleteConfirmText: 'DELETE',
  },

  // Puoi rifinire le traduzioni: qui solo versione base EN/FR/DE/ES
  en: {
    account: 'Account',
    overview: 'Overview',
    history: 'Search history',
    settings: 'Settings',
    logout: 'Logout',

    planTitle: 'Plan details',
    currentPlanFree: 'Current plan: Free',
    currentPlanPro: 'Current plan: PRO',
    renewsAt: 'Renews on',
    manageInPortal: 'Manage in Stripe Portal',
    upgradeToPro: 'Upgrade to PRO',

    historyTitle: 'Search history',
    historyEmpty: 'You have no searches yet.',
    historyDelete: 'Delete',
    historyDeleteAll: 'Delete all',
    historyQuery: 'Search',
    historyDate: 'Date',
    historyStatus: 'Status',

    settingsTitle: 'Account settings',
    languageLabel: 'Preferred language',
    languageAuto: 'Automatic (browser-based)',
    languageSaved: 'Language updated',

    deleteTitle: 'Delete account',
    deleteWarning:
      'This action is permanent and cannot be undone. All your searches and data will be deleted.',
    deleteConfirmLabel: 'To confirm, type "DELETE" in the field below:',
    deletePlaceholder: 'Type DELETE to confirm',
    deleteButton: 'Delete permanently',
    deleteConfirmText: 'DELETE',
  },

  fr: {
    account: 'Compte',
    overview: 'Vue d’ensemble',
    history: 'Historique des recherches',
    settings: 'Paramètres',
    logout: 'Déconnexion',

    planTitle: 'Détails du plan',
    currentPlanFree: 'Plan actuel : Free',
    currentPlanPro: 'Plan actuel : PRO',
    renewsAt: 'Renouvellement le',
    manageInPortal: 'Gérer dans le portail Stripe',
    upgradeToPro: 'Passer au plan PRO',

    historyTitle: 'Historique des recherches',
    historyEmpty: 'Vous n’avez pas encore de recherches.',
    historyDelete: 'Supprimer',
    historyDeleteAll: 'Tout supprimer',
    historyQuery: 'Recherche',
    historyDate: 'Date',
    historyStatus: 'Statut',

    settingsTitle: 'Paramètres du compte',
    languageLabel: 'Langue préférée',
    languageAuto: 'Automatique (selon le navigateur)',
    languageSaved: 'Langue mise à jour',

    deleteTitle: 'Suppression du compte',
    deleteWarning:
      'Cette action est définitive et ne peut pas être annulée. Toutes vos recherches et vos données seront supprimées.',
    deleteConfirmLabel:
      'Pour confirmer, tapez "DELETE" dans le champ ci-dessous :',
    deletePlaceholder: 'Tapez DELETE pour confirmer',
    deleteButton: 'Supprimer définitivement',
    deleteConfirmText: 'DELETE',
  },

  de: {
    account: 'Konto',
    overview: 'Übersicht',
    history: 'Suchverlauf',
    settings: 'Einstellungen',
    logout: 'Abmelden',

    planTitle: 'Plandetails',
    currentPlanFree: 'Aktueller Plan: Free',
    currentPlanPro: 'Aktueller Plan: PRO',
    renewsAt: 'Verlängert am',
    manageInPortal: 'Im Stripe-Portal verwalten',
    upgradeToPro: 'Auf PRO upgraden',

    historyTitle: 'Suchverlauf',
    historyEmpty: 'Du hast noch keine Suchvorgänge.',
    historyDelete: 'Löschen',
    historyDeleteAll: 'Alles löschen',
    historyQuery: 'Suche',
    historyDate: 'Datum',
    historyStatus: 'Status',

    settingsTitle: 'Kontoeinstellungen',
    languageLabel: 'Bevorzugte Sprache',
    languageAuto: 'Automatisch (Browser-basiert)',
    languageSaved: 'Sprache aktualisiert',

    deleteTitle: 'Konto löschen',
    deleteWarning:
      'Diese Aktion ist endgültig und kann nicht rückgängig gemacht werden. Alle deine Suchvorgänge und Daten werden gelöscht.',
    deleteConfirmLabel:
      'Zum Bestätigen schreibe "DELETE" in das Feld unten:',
    deletePlaceholder: 'Schreibe DELETE zur Bestätigung',
    deleteButton: 'Endgültig löschen',
    deleteConfirmText: 'DELETE',
  },

  es: {
    account: 'Cuenta',
    overview: 'Resumen',
    history: 'Historial de búsquedas',
    settings: 'Configuración',
    logout: 'Salir',

    planTitle: 'Detalles del plan',
    currentPlanFree: 'Plan actual: Free',
    currentPlanPro: 'Plan actual: PRO',
    renewsAt: 'Renueva el',
    manageInPortal: 'Gestionar en el portal de Stripe',
    upgradeToPro: 'Pasar a PRO',

    historyTitle: 'Historial de búsquedas',
    historyEmpty: 'Todavía no tienes búsquedas.',
    historyDelete: 'Eliminar',
    historyDeleteAll: 'Eliminar todo',
    historyQuery: 'Búsqueda',
    historyDate: 'Fecha',
    historyStatus: 'Estado',

    settingsTitle: 'Configuración de la cuenta',
    languageLabel: 'Idioma preferido',
    languageAuto: 'Automático (según el navegador)',
    languageSaved: 'Idioma actualizado',

    deleteTitle: 'Eliminar cuenta',
    deleteWarning:
      'Esta acción es definitiva y no se puede deshacer. Se eliminarán todas tus búsquedas y datos.',
    deleteConfirmLabel:
      'Para confirmar, escribe "DELETE" en el campo de abajo:',
    deletePlaceholder: 'Escribe DELETE para confirmar',
    deleteButton: 'Eliminar definitivamente',
    deleteConfirmText: 'DELETE',
  },
}

export function getDashboardCopy(locale: string): DashboardCopy {
  const l = (locale || 'en').split('-')[0] as Locale
  return dashboardCopy[l] ?? dashboardCopy.en
}
