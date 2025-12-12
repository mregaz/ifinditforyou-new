// app/[locale]/account/layout.tsx
import { ReactNode } from 'react'
import Link from 'next/link'
import { getDashboardCopy } from '@/lib/i18n/dashboard'

type Props = {
  children: ReactNode
  params: { locale: string }
}

export default function AccountLayout({ children, params }: Props) {
  const t = getDashboardCopy(params.locale)
  const base = `/${params.locale}/account`

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto py-8 px-4 flex gap-8">
        <aside className="w-64 flex-shrink-0">
          <div className="mb-6">
            <h1 className="text-xl font-semibold">{t.account}</h1>
            <p className="text-sm text-slate-500">
              {t.overview} / {t.history} / {t.settings}
            </p>
          </div>

          <nav className="space-y-2 text-sm">
            <Link
              href={`${base}/overview`}
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              {t.overview}
            </Link>
            <Link
              href={`${base}/history`}
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              {t.history}
            </Link>
            <Link
              href={`${base}/settings`}
              className="block rounded-md px-3 py-2 hover:bg-slate-100"
            >
              {t.settings}
            </Link>
            {/* Se hai una route di logout, collegala qui */}
          </nav>
        </aside>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
