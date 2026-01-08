import Link from "next/link";
import { i18n, isSupportedLocale, type Locale } from "@/lib/i18n-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ session_id?: string }>;
};

function uiCopy(locale: Locale) {
  const copy = {
    it: {
      title: "Pagamento completato",
      subtitlePaid:
        "Grazie. Il pagamento risulta completato. Se non vedi subito i benefici, ricarica la pagina o vai al tuo account.",
      subtitleMissing:
        "Pagamento completato. Se non vedi subito i benefici, ricarica la pagina o vai al tuo account.",
      ctaAccount: "Vai al tuo account",
      ctaPortal: "Gestisci abbonamento",
      backHome: "Torna alla Home",
      detailLabel: "Dettagli",
      status: "Stato",
      statusPaid: "paid",
      statusMissing: "missing",
    },
    en: {
      title: "Payment successful",
      subtitlePaid:
        "Thank you. Your payment is confirmed. If you don’t see updates, refresh the page or go to your account.",
      subtitleMissing:
        "Payment completed. If you don’t see updates, refresh the page or go to your account.",
      ctaAccount: "Go to your account",
      ctaPortal: "Manage subscription",
      backHome: "Back to Home",
      detailLabel: "Details",
      status: "Status",
      statusPaid: "paid",
      statusMissing: "missing",
    },
    fr: {
      title: "Paiement réussi",
      subtitlePaid:
        "Merci. Votre paiement est confirmé. Si rien ne change, actualisez la page ou allez sur votre compte.",
      subtitleMissing:
        "Paiement terminé. Si rien ne change, actualisez la page ou allez sur votre compte.",
      ctaAccount: "Aller à mon compte",
      ctaPortal: "Gérer l’abonnement",
      backHome: "Retour à l’accueil",
      detailLabel: "Détails",
      status: "Statut",
      statusPaid: "paid",
      statusMissing: "missing",
    },
    de: {
      title: "Zahlung erfolgreich",
      subtitlePaid:
        "Danke. Deine Zahlung ist bestätigt. Wenn du keine Änderungen siehst, lade die Seite neu oder gehe zu deinem Konto.",
      subtitleMissing:
        "Zahlung abgeschlossen. Wenn du keine Änderungen siehst, lade die Seite neu oder gehe zu deinem Konto.",
      ctaAccount: "Zum Konto",
      ctaPortal: "Abo verwalten",
      backHome: "Zur Startseite",
      detailLabel: "Details",
      status: "Status",
      statusPaid: "paid",
      statusMissing: "missing",
    },
    es: {
      title: "Pago completado",
      subtitlePaid:
        "Gracias. Tu pago está confirmado. Si no ves cambios, recarga la página o ve a tu cuenta.",
      subtitleMissing:
        "Pago completado. Si no ves cambios, recarga la página o ve a tu cuenta.",
      ctaAccount: "Ir a tu cuenta",
      ctaPortal: "Gestionar suscripción",
      backHome: "Volver al inicio",
      detailLabel: "Detalles",
      status: "Estado",
      statusPaid: "paid",
      statusMissing: "missing",
    },
  } as const;

  return copy[locale] ?? copy.it;
}

export default async function PaySuccessPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const sp = (await searchParams) ?? {};
  const sessionId = sp.session_id;

  const t = uiCopy(locale);

  // IMPORTANT:
  // - Non facciamo retrieve Stripe qui (evita env/build issues)
  // - La fonte di verità è il webhook Stripe -> Supabase (is_pro / plan)
  const status = sessionId ? "paid" : "missing";
  const subtitle = sessionId ? t.subtitlePaid : t.subtitleMissing;

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-emerald-500" />
            <div>
              <h1 className="text-2xl font-semibold">{t.title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-slate-50 p-4">
            <div className="mb-2 text-sm font-medium">{t.detailLabel}</div>

            <div className="space-y-2 text-sm text-slate-800">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-600">{t.status}</span>
                <span className="font-medium">
                  {status === "paid" ? t.statusPaid : t.statusMissing}
                </span>
              </div>

              {sessionId && (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-600">session_id</span>
                  <span className="font-medium">{sessionId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/account`}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              {t.ctaAccount}
            </Link>

            <Link
              href={`/${locale}/account/settings`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              {t.ctaPortal}
            </Link>

            <Link
              href={`/${locale}/`}
              className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {t.backHome}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
