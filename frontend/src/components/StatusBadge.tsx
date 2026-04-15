import type { OrderStatus } from '@/types'

type Theme = 'light' | 'dark'

const config: Record<OrderStatus, { label: string; dark: string; light: string }> = {
  waiting:   { label: 'Aguardando', dark: 'bg-slate-800 text-slate-400 ring-1 ring-white/5',       light: 'bg-slate-200 text-slate-600 ring-1 ring-slate-300/50' },
  preparing: { label: 'Preparando', dark: 'bg-brand-600/10 text-brand-500 ring-1 ring-brand-500/20', light: 'bg-brand-100 text-brand-700 ring-1 ring-brand-300/50' },
  ready:     { label: 'Concluído',    dark: 'text-white',       light: 'text-brand-600' },
  done:      { label: 'Entregue',   dark: 'bg-[#111] text-slate-600 ring-1 ring-white/5',          light: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  cancelled: { label: 'Cancelado',  dark: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',     light: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
}

export function StatusBadge({ status, theme = 'dark' }: { status: OrderStatus; theme?: Theme }) {
  const safeStatus = config[status] ? status : 'waiting'
  const { label, dark, light } = config[safeStatus]

  const isReady = safeStatus === 'ready'

  return (
    <span className={`inline-flex items-center text-[10px] font-black uppercase tracking-wider lg:text-sm 2xl:text-base ${isReady ? '' : 'rounded-full px-2 py-0.5 lg:px-3 lg:py-1'} ${theme === 'dark' ? dark : light}`}>
      {label}
    </span>
  )
}
