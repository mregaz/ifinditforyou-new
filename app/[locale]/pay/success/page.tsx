import Link from "next/link";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
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
      subtitlePaid: "Grazie. Il pagamento risulta completato.",
      subtitleUnpaid:
        "Abbiamo ricevuto la sessione, ma il pagamento non risulta completato (ancora).",
      subtitleMissing:
        "Pagamento completato. Se non vedi subito i benefici, ricarica la pagina o vai al tuo account.",
      ctaAccount: "Vai al tuo account",
      ctaPortal: "Gestisci abbonamento",
      detailLabel: "Dettagli",
      status: "Stato",
      amount: "Importo",
      email: "Email",
      backHome: "Torna alla Home",
    },
    en: {
      title: "Payment successful",
      subtitlePaid: "Thank you. Your payment is confirmed.",
      subtitleUnpaid:
        "We received the session, but payment is not confirmed (yet).",
      subtitleMissing:
        "Payment completed. If you don’t see updates, refresh the page or go to your account.",
      ctaAccount: "Go to your account",
      ctaPortal: "Manage subscription",
      detailLabel: "Details",
      status: "Status",
      amount: "Amount",
      email: "Email",
      backHome: "Back to Home",
    },
    fr: {
      title: "Paiement réussi",
      subtitlePaid: "Merci. Votre paiement est confirmé.",
      subtitleUnpaid:
        "Nous avons reçu la session, mais le paiement n’est pas confirmé (pour le moment).",
      subtitleMissing:
        "Paiement terminé. Si rien ne change, actualisez la page ou allez sur votre compte.",
      ctaAccount: "Aller à mon compte",
      ctaPortal: "Gérer l’abonnement",
      detailLabel: "Détails",
      status: "Statut",
      amount: "Montant",
      email: "Email",
      backHome: "Retour à l’accueil",
    },
    de: {
      title: "Zahlung erfolgreich",
      subtitlePaid: "Danke. Deine Zahlung ist bestätigt.",
      subtitleUnpaid:
        "Wir haben die Session erhalten, aber die Zahlung ist (noch) nicht bestätigt.",
      subtitleMissing:
        "Zahlung abgeschlossen. Wenn du keine Änderungen siehst, lade die Seite neu oder gehe zu deinem Konto.",
      ctaAccount: "Zum Konto",
      ctaPortal: "Abo verwalten",
      detailLabel: "Details",
      status: "Status",
      amount: "Betrag",
      email: "E-Mail",
      backHome: "Zur Startseite",
    },
    es: {
      title: "Pago completado",
      subtitlePaid: "Gracias. Tu pago está confirmado.",
      subtitleUnpaid:
        "Hemos recibido la sesión, pero el pago aún no está confirmado.",
      subtitleMissing:
        "Pago completado. Si no ves cambios, recarga la página o ve a tu cuenta.",
      ctaAccount: "Ir a tu cuenta",
      ctaPortal: "Gestionar suscripción",
      detailLabel: "Detalles",
      status: "Estado",
      amount: "Importe",
      email: "Email",
      backHome: "Volver al inicio",
    },
  } as const;

  return copy[locale] ?? copy.it;
}

function formatAmount(session: Stripe.Checkout.Session) {
  const total = session.amount_total;
  const currency = session.currency?.toUpperCase();
  if (!total || !currency) return null;
  const value = (total / 100).toFixed(2);
  return `${value} ${currency}`;
}

export default async function PaySuccessPage({ params, searchParams }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const sp = (await searchParams) ?? {};
  const sessionId = sp.session_id;

  const t = uiCopy(locale);

  let session: Stripe.Checkout.Session | null = null;
  let status: "paid" | "unpaid" | "missing" = "missing";

  if (sessionId) {
    try {
      session = await stripe.checkout.sessions.retrieve(sessionId);
      // payment_status: 'paid' | 'unpaid' | 'no_payment_required'
      status = session.payment_status === "paid" ? "paid" : "unpaid";
    } catch {
      // Se retrieve fallisce (id errato / permessi), non blocchiamo UX.
      status = "missing";
      session = null;
    }
  }

  const subtitle =
    status === "paid"
      ? t.subtitlePaid
      : status === "unpaid"
      ? t.subtitleUnpaid
      : t.subtitleMissing;

  const amount = session ? formatAmount(session) : null;
  const email =
    session?.customer_details?.email ?? session?.customer_email ?? null;

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

          {(amount || email || session?.payment_status) && (
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <div className="mb-2 text-sm font-medium">{t.detailLabel}</div>

              <div className="space-y-2 text-sm text-slate-800">
                {session?.payment_status && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600">{t.status}</span>
                    <span className="font-medium">{session.payment_status}</span>
                  </div>
                )}

                {amount && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600">{t.amount}</span>
                    <span className="font-medium">{amount}</span>
                  </div>
                )}

                {email && (
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-slate-600">{t.email}</span>
                    <span className="font-medium">{email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

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
