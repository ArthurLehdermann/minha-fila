'use client'

import type { OrderStatus } from '@/types'
import { useI18n } from '@/lib/i18n'

type Theme = 'light' | 'dark'

const styles: Record<OrderStatus, { dark: string; light: string }> = {
  waiting:   { dark: 'bg-slate-800 text-slate-400 ring-1 ring-white/5',       light: 'bg-slate-200 text-slate-600 ring-1 ring-slate-300/50' },
  preparing: { dark: 'bg-brand-600/10 text-brand-500 ring-1 ring-brand-500/20', light: 'bg-brand-100 text-brand-700 ring-1 ring-brand-300/50' },
  ready:     { dark: 'text-white',       light: 'text-brand-600' },
  done:      { dark: 'bg-slate-900 text-slate-400 ring-1 ring-white/5',         light: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  cancelled: { dark: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',     light: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
}

export function StatusBadge({ status, theme = 'dark' }: { status: OrderStatus; theme?: Theme }) {
  const { t } = useI18n()
  const safeStatus = styles[status] ? status : 'waiting'
  const { dark, light } = styles[safeStatus]
  const label = t(`status.${safeStatus}`)

  const isReady = safeStatus === 'ready'

  return (
    <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider ${isReady ? '' : 'rounded-full px-2 py-0.5'} ${theme === 'dark' ? dark : light}`}>
      {label}
    </span>
  )
}
