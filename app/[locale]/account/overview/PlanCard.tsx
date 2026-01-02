import Link from "next/link";

type Props = {
  locale: string;
  isPro: boolean;
};

export default function PlanCard({ locale, isPro }: Props) {
  const copy = {
    it: {
      title: "Sblocca ricerche illimitate, storico completo e priorità.",
      plan: "Piano",
      free: "Gratis",
      pro: "PRO",
      cta: "Passa a PRO",
    },
    en: {
      title: "Unlock unlimited searches, full history and priority access.",
      plan: "Plan",
      free: "Free",
      pro: "PRO",
      cta: "Upgrade to PRO",
    },
    fr: {
      title: "Débloquez des recherches illimitées, l’historique complet et la priorité.",
      plan: "Forfait",
      free: "Gratuit",
      pro: "PRO",
      cta: "Passer à PRO",
    },
    de: {
      title: "Unbegrenzte Suchen, vollständiger Verlauf und Priorität freischalten.",
      plan: "Plan",
      free: "Kostenlos",
      pro: "PRO",
      cta: "Zu PRO wechseln",
    },
    es: {
      title: "Desbloquea búsquedas ilimitadas, historial completo y prioridad.",
      plan: "Plan",
      free: "Gratis",
      pro: "PRO",
      cta: "Pasar a PRO",
    },
  }[locale] ?? {
    title: "Unlock unlimited searches.",
    plan: "Plan",
    free: "Free",
    pro: "PRO",
    cta: "Upgrade",
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-white">
      <p className="text-sm text-slate-300">{copy.title}</p>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{copy.plan}:</span>
          <span className="rounded-md bg-slate-800 px-2 py-1 text-sm font-medium">
            {isPro ? copy.pro : copy.free}
          </span>
        </div>

        {!isPro && (
          <Link
            href={`/${locale}/pro`}
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400 transition"
          >
            {copy.cta}
          </Link>
        )}
      </div>
    </div>
  );
}
