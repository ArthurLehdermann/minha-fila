import type { OrderStatus } from '@/types'

type Theme = 'light' | 'dark'

const config: Record<OrderStatus, { label: string; dark: string; light: string }> = {
  waiting:   { label: 'Aguardando', dark: 'bg-slate-800 text-slate-400 ring-1 ring-white/5',       light: 'bg-slate-200 text-slate-600 ring-1 ring-slate-300/50' },
  preparing: { label: 'Preparando', dark: 'bg-brand-600/10 text-brand-500 ring-1 ring-brand-500/20', light: 'bg-brand-100 text-brand-700 ring-1 ring-brand-300/50' },
  ready:     { label: 'Pronto!',    dark: 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20', light: 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300/50' },
  done:      { label: 'Entregue',   dark: 'bg-[#111] text-slate-600 ring-1 ring-white/5',          light: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200' },
  cancelled: { label: 'Cancelado',  dark: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20',     light: 'bg-red-50 text-red-600 ring-1 ring-red-200' },
}

export function StatusBadge({ status, theme = 'dark' }: { status: OrderStatus; theme?: Theme }) {
  const safeStatus = config[status] ? status : 'waiting'
  const { label, dark, light } = config[safeStatus]

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? dark : light}`}>
      {label}
    </span>
  )
}
