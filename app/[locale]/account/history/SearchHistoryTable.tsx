// app/[locale]/account/history/SearchHistoryTable.tsx
'use client'

import { useEffect, useState } from 'react'
import { getDashboardCopy } from '@/lib/i18n/dashboard'

type Props = {
  locale: string
}

type SearchItem = {
  id: string
  query: string
  createdAt: string
  status?: string
}

export function SearchHistoryTable({ locale }: Props) {
  const t = getDashboardCopy(locale)
  const [items, setItems] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const res = await fetch('/api/my-searches')
      if (!res.ok) throw new Error('Failed to fetch history')
      const data = await res.json()
      setItems(data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function deleteOne(id: string) {
    try {
      const res = await fetch(`/api/my-searches/delete?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteAll() {
    if (!confirm('Sei sicuro di voler eliminare tutte le ricerche?')) return
    try {
      const res = await fetch(`/api/my-searches/delete?all=true`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete all')
      setItems([])
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <p className="text-sm text-slate-500">Loading...</p>
    )
  }

  if (!items.length) {
    return (
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{t.historyEmpty}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">
          {t.historyTitle}
        </p>
        <button
          onClick={deleteAll}
          className="text-xs text-red-600 hover:underline"
        >
          {t.historyDeleteAll}
        </button>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-4 py-2">{t.historyQuery}</th>
              <th className="text-left px-4 py-2">{t.historyDate}</th>
              <th className="text-left px-4 py-2">{t.historyStatus}</th>
              <th className="text-right px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="px-4 py-2 max-w-xs truncate">
                  {item.query}
                </td>
                <td className="px-4 py-2 text-xs text-slate-500">
                  {new Date(item.createdAt).toLocaleString(locale)}
                </td>
                <td className="px-4 py-2 text-xs text-slate-500">
                  {item.status || '-'}
                </td>
                <td className="px-4 py-2 text-right">
                  <button
                    onClick={() => deleteOne(item.id)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    {t.historyDelete}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
