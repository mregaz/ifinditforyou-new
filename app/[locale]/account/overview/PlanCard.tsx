// app/[locale]/account/overview/PlanCard.tsx
import Link from "next/link";

type PlanCardProps = {
  locale: string;
  isPro: boolean;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null; // ISO string o timestamptz
};

function formatDate(locale: string, iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

export default function PlanCard({
  locale,
  isPro,
  cancelAtPeriodEnd = false,
  currentPeriodEnd = null,
}: PlanCardProps) {
  const planLabel = isPro ? "PRO" : "Gratis";
  const endDate = currentPeriodEnd ? formatDate(locale, currentPeriodEnd) : null;

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-950/40 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-slate-300">Sblocca ricerche illimitate, storico completo e priorità.</p>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-slate-300">Piano:</span>
            <span className="rounded-md bg-slate-800 px-3 py-1 text-sm text-slate-100">
              {planLabel}
            </span>
          </div>

          {isPro && cancelAtPeriodEnd && endDate ? (
            <p className="mt-2 text-sm text-slate-300">
              Abbonamento PRO attivo fino al{" "}
              <span className="font-medium text-slate-100">{endDate}</span>
            </p>
          ) : null}
        </div>

        {!isPro ? (
          <Link
            href={`/${locale}/pro`}
            className="rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Passa a PRO
          </Link>
        ) : (
          <Link
            href={`/${locale}/account/settings`}
            className="rounded-lg border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-100 hover:bg-slate-900"
          >
            Gestisci abbonamento
          </Link>
        )}
      </div>
    </div>
  );
}
