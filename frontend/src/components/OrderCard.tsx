import type { Order, OrderStatus } from '@/types'
import { StatusBadge } from './StatusBadge'

interface Props {
  order: Order
  /** If provided, renders status action buttons */
  onStatusChange?: (orderId: string, status: OrderStatus) => void
  isUpdating?: boolean
}

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  waiting: 'preparing',
  preparing: 'ready',
  ready: 'done',
}

const PREV_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  preparing: 'waiting',
  ready: 'preparing',
  done: 'ready',
}

export function OrderCard({ order, onStatusChange, isUpdating }: Props) {
  const isReady = order.status === 'ready'

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isReady
          ? 'border-green-300 bg-green-50 shadow-md'
          : 'border-gray-200 bg-white shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span
            className={`text-2xl font-bold leading-none ${
              isReady ? 'text-green-700' : 'text-gray-800'
            }`}
          >
            #{order.number}
          </span>
          {order.label && (
            <p className="mt-1 text-sm text-gray-600">{order.label}</p>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {onStatusChange && order.status !== 'done' && (
        <div className="mt-3 flex gap-2">
          {PREV_STATUS[order.status] && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, PREV_STATUS[order.status]!)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50"
            >
              ← Voltar
            </button>
          )}
          {NEXT_STATUS[order.status] && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, NEXT_STATUS[order.status]!)}
              className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {order.status === 'waiting' ? 'Preparar →' : order.status === 'preparing' ? 'Pronto! →' : 'Entregar →'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
