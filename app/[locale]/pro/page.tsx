import type { Metadata } from "next";
import { i18n, isSupportedLocale, type Locale } from "@/lib/i18n-config";
import { buildInfoMetadata } from "@/lib/seo/info-metadata";
import ProCheckoutButtons from "./ProCheckoutButtons";


type Props = {
  params: Promise<{ locale: string }>;
};

const COPY: Record<Locale, { title: string; subtitle: string; choose: string; hint: string }> = {
  it: {
    title: "Pro",
    subtitle: "Attiva Pro per sbloccare funzionalità avanzate e gestire il tuo abbonamento.",
    choose: "Scegli un piano",
    hint: "Verrai reindirizzato al checkout Stripe.",
  },
  en: {
    title: "Pro",
    subtitle: "Activate Pro to unlock advanced features and manage your subscription.",
    choose: "Choose a plan",
    hint: "You will be redirected to Stripe Checkout.",
  },
  fr: {
    title: "Pro",
    subtitle: "Activez Pro pour débloquer des fonctionnalités avancées et gérer votre abonnement.",
    choose: "Choisir une offre",
    hint: "Vous serez redirigé vers Stripe Checkout.",
  },
  de: {
    title: "Pro",
    subtitle: "Aktiviere Pro, um erweiterte Funktionen freizuschalten und dein Abo zu verwalten.",
    choose: "Plan wählen",
    hint: "Du wirst zu Stripe Checkout weitergeleitet.",
  },
  es: {
    title: "Pro",
    subtitle: "Activa Pro para desbloquear funciones avanzadas y gestionar tu suscripción.",
    choose: "Elige un plan",
    hint: "Serás redirigido a Stripe Checkout.",
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : i18n.defaultLocale;

  return buildInfoMetadata({
    locale,
    path: "/pro",
    title: COPY[locale].title,
    description: COPY[locale].subtitle,
  });
}

export default async function ProPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const t = COPY[locale];

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold">{t.title}</h1>
        <p className="mt-3 text-slate-700">{t.subtitle}</p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">{t.choose}</h2>

          <ProCheckoutButtons locale={locale} />

          <p className="mt-3 text-sm text-slate-500">{t.hint}</p>
        </div>
      </div>
    </main>
  );
}
