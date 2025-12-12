// app/[locale]/account/overview/page.tsx
import { PlanCard } from './PlanCard'
import { getDashboardCopy } from '@/lib/i18n/dashboard'

type Props = { params: { locale: string } }

export default function OverviewPage({ params }: Props) {
  const t = getDashboardCopy(params.locale)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t.overview}</h1>
        <p className="text-sm text-slate-500">
          {t.planTitle}
        </p>
      </header>

      <PlanCard locale={params.locale} />
    </div>
  )
}
