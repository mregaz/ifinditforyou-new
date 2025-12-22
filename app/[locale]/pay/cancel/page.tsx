import Link from "next/link";
import { i18n, isSupportedLocale, type Locale } from "@/lib/i18n-config";

export const dynamic = "force-static";

type Props = {
  params: Promise<{ locale: string }>;
};

function uiCopy(locale: Locale) {
  const copy = {
    it: {
      title: "Pagamento annullato",
      subtitle:
        "Nessun addebito è stato effettuato. Se vuoi, puoi riprovare quando sei pronto.",
      ctaRetry: "Riprova",
      ctaAccount: "Vai al tuo account",
      backHome: "Torna alla Home",
    },
    en: {
      title: "Payment canceled",
      subtitle:
        "No charge was made. You can try again whenever you’re ready.",
      ctaRetry: "Try again",
      ctaAccount: "Go to your account",
      backHome: "Back to Home",
    },
    fr: {
      title: "Paiement annulé",
      subtitle:
        "Aucun débit n’a été effectué. Vous pouvez réessayer quand vous le souhaitez.",
      ctaRetry: "Réessayer",
      ctaAccount: "Aller à mon compte",
      backHome: "Retour à l’accueil",
    },
    de: {
      title: "Zahlung abgebrochen",
      subtitle:
        "Es wurde nichts berechnet. Du kannst jederzeit erneut versuchen.",
      ctaRetry: "Erneut versuchen",
      ctaAccount: "Zum Konto",
      backHome: "Zur Startseite",
    },
    es: {
      title: "Pago cancelado",
      subtitle:
        "No se realizó ningún cargo. Puedes intentarlo de nuevo cuando quieras.",
      ctaRetry: "Reintentar",
      ctaAccount: "Ir a tu cuenta",
      backHome: "Volver al inicio",
    },
  } as const;

  return copy[locale] ?? copy.it;
}

export default async function PayCancelPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: Locale = isSupportedLocale(rawLocale)
    ? rawLocale
    : i18n.defaultLocale;

  const t = uiCopy(locale);

  return (
    <main className="min-h-screen bg-white text-slate-900 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="mb-4 flex items-start gap-3">
            <div className="mt-1 h-3 w-3 rounded-full bg-amber-500" />
            <div>
              <h1 className="text-2xl font-semibold">{t.title}</h1>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {t.subtitle}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/${locale}/pro`}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {t.ctaRetry}
            </Link>

            <Link
              href={`/${locale}/account`}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50"
            >
              {t.ctaAccount}
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
