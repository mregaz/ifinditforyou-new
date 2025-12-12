// app/[locale]/account/history/page.tsx
import { SearchHistoryTable } from './SearchHistoryTable'
import { getDashboardCopy } from '@/lib/i18n/dashboard'

type Props = { params: { locale: string } }

export default function HistoryPage({ params }: Props) {
  const t = getDashboardCopy(params.locale)

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold mb-2">{t.history}</h1>
        <p className="text-sm text-slate-500">{t.historyTitle}</p>
      </header>

      <SearchHistoryTable locale={params.locale} />
    </div>
  )
}
