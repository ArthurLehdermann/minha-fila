import type { OrderStatus } from '@/types'

const config: Record<OrderStatus, { label: string; className: string }> = {
  waiting:   { label: 'Aguardando', className: 'bg-gray-100 text-gray-700' },
  preparing: { label: 'Preparando',  className: 'bg-yellow-100 text-yellow-800' },
  ready:     { label: 'Pronto!',     className: 'bg-green-100 text-green-800' },
  done:      { label: 'Entregue',    className: 'bg-slate-100 text-slate-500' },
  cancelled: { label: 'Cancelado',   className: 'bg-red-100 text-red-700' },
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, className } = config[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
