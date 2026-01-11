// lib/pro-copy.ts
import type { Locale } from "@/lib/lang";

export const PRO_COPY: Record<
  Locale,
  {
    title: string;
    subtitle: string;
    choosePlan: string;
    monthly: string;
    yearly: string;
    redirectNote: string;
  }
> = {
  it: {
    title: "PRO",
    subtitle: "Attiva PRO per ricerche illimitate.",
    choosePlan: "Scegli un piano",
    monthly: "Mensile",
    yearly: "Annuale",
    redirectNote: "Sarai reindirizzato a Stripe Checkout.",
  },
  en: {
    title: "PRO",
    subtitle: "Activate PRO for unlimited searches.",
    choosePlan: "Choose a plan",
    monthly: "Monthly",
    yearly: "Yearly",
    redirectNote: "You’ll be redirected to Stripe Checkout.",
  },
  fr: {
    title: "PRO",
    subtitle: "Active PRO pour des recherches illimitées.",
    choosePlan: "Choisir un abonnement",
    monthly: "Mensuel",
    yearly: "Annuel",
    redirectNote: "Vous serez redirigé vers Stripe Checkout.",
  },
  de: {
    title: "PRO",
    subtitle: "Aktiviere PRO für unbegrenzte Suchen.",
    choosePlan: "Tarif wählen",
    monthly: "Monatlich",
    yearly: "Jährlich",
    redirectNote: "Du wirst zu Stripe Checkout weitergeleitet.",
  },
  es: {
    title: "PRO",
    subtitle: "Activa PRO para búsquedas ilimitadas.",
    choosePlan: "Elige un plan",
    monthly: "Mensual",
    yearly: "Anual",
    redirectNote: "Serás redirigido a Stripe Checkout.",
  },
};
