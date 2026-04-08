import type { OrderStatus } from '@/types'

const config: Record<OrderStatus, { label: string; className: string }> = {
  waiting:   { label: 'Aguardando', className: 'bg-slate-800 text-slate-400 ring-1 ring-white/5' },
  preparing: { label: 'Preparando',  className: 'bg-brand-600/10 text-brand-500 ring-1 ring-brand-500/20' },
  ready:     { label: 'Pronto!',     className: 'bg-emerald-400/10 text-emerald-400 ring-1 ring-emerald-400/20' },
  done:      { label: 'Entregue',    className: 'bg-[#111] text-slate-600 ring-1 ring-white/5' },
  cancelled: { label: 'Cancelado',   className: 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20' },
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const safeStatus = config[status] ? status : 'waiting'
  const { label, className } = config[safeStatus]
  
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${className}`}>
      {label}
    </span>
  )
}
