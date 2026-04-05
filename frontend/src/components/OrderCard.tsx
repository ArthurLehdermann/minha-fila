import { useState } from 'react'
import type { Order, OrderStatus } from '@/types'
import { StatusBadge } from './StatusBadge'
import { ConfirmDialog } from './ConfirmDialog'
import { Trash2 } from 'lucide-react'

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
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const isReady = order.status === 'ready'
  const isCancelled = order.status === 'cancelled'

  if (isCancelled) return null

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all ${
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
            <p className="mt-1 text-sm text-gray-600 font-medium">{order.label}</p>
          )}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {onStatusChange && order.status !== 'done' && (
        <div className="mt-4 flex gap-2">
          {PREV_STATUS[order.status] && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, PREV_STATUS[order.status]!)}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              ← Voltar
            </button>
          )}
          {NEXT_STATUS[order.status] && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, NEXT_STATUS[order.status]!)}
              className="flex-1 rounded-lg bg-brand-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-700 disabled:opacity-50 shadow-sm transition-colors"
            >
              {order.status === 'waiting' ? 'Preparar →' : order.status === 'preparing' ? 'Pronto! →' : 'Entregar →'}
            </button>
          )}
          
          <button
            disabled={isUpdating}
            onClick={() => setIsCancelModalOpen(true)}
            className="flex items-center justify-center rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 hover:text-red-600 disabled:opacity-50 transition-all"
            title="Cancelar pedido"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      <ConfirmDialog
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={() => {
          onStatusChange?.(order.id, 'cancelled')
          setIsCancelModalOpen(false)
        }}
        title="Cancelar Pedido"
        message={`Tem certeza que deseja cancelar o pedido #${order.number}? Esta ação não pode ser desfeita.`}
        confirmText="Sim, cancelar"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  )
}
