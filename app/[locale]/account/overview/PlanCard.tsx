// app/[locale]/account/overview/PlanCard.tsx
'use client'

import { useEffect, useState } from 'react'
import { getDashboardCopy } from '@/lib/i18n/dashboard'

type Props = {
  locale: string
}

type SubscriptionStatus =
  | { plan: 'free' }
  | { plan: 'pro'; status: string; renewsAt: number }

export function PlanCard({ locale }: Props) {
  const t = getDashboardCopy(locale)
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/subscription-status')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setStatus(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const renewDate =
    status && 'renewsAt' in status
      ? new Date(status.renewsAt).toLocaleDateString(locale)
      : null

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">{t.planTitle}</h2>

      {loading && <p className="text-sm text-slate-500">Loading...</p>}

      {!loading && status?.plan === 'free' && (
        <div className="space-y-4">
          <p className="text-sm">{t.currentPlanFree}</p>
          <a
            href={`/${locale}/pro`}
            className="inline-flex items-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
          >
            {t.upgradeToPro}
          </a>
        </div>
      )}

      {!loading && status?.plan === 'pro' && (
        <div className="space-y-4">
          <p className="text-sm">{t.currentPlanPro}</p>
          {renewDate && (
            <p className="text-xs text-slate-500">
              {t.renewsAt} {renewDate}
            </p>
          )}
          <form action="/api/create-portal-session" method="POST">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 rounded-md bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
              {t.manageInPortal}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
