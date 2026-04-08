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
  theme?: 'light' | 'dark'
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

export function OrderCard({ order, onStatusChange, isUpdating, theme = 'dark' }: Props) {
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)

  if (!order) return null // Fatal safeguard

  const status = order.status || 'waiting'
  const isReady = status === 'ready'
  const isCancelled = status === 'cancelled'

  if (isCancelled) return null

  const cardBase = theme === 'dark'
    ? isReady
      ? 'border-brand-500/30 bg-[#111] shadow-lg shadow-black/10 ring-1 ring-brand-500/10'
      : 'border-white/5 bg-[#111]/50 shadow-sm'
    : isReady
      ? 'border-brand-500/30 bg-white shadow-lg shadow-black/5 ring-1 ring-brand-500/10'
      : 'border-slate-200 bg-white shadow-sm'

  const numberColor = theme === 'dark'
    ? isReady ? 'text-white' : 'text-slate-200'
    : isReady ? 'text-slate-900' : 'text-slate-700'

  const labelColor = theme === 'dark' ? 'text-slate-500' : 'text-slate-400'

  const actionBarBg = theme === 'dark'
    ? 'border-white/5 bg-slate-950/20'
    : 'border-slate-100 bg-slate-50'

  const backBtnClass = theme === 'dark'
    ? 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
    : 'border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-200'

  const cancelBtnClass = theme === 'dark'
    ? 'border-white/5 bg-white/5 text-slate-500 hover:bg-red-500/10 hover:text-red-400'
    : 'border-slate-200 bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-500'

  return (
    <div
      className={`relative animate-in fade-in zoom-in-95 duration-300 rounded-2xl border transition-all ${cardBase}`}
    >
      <div className="flex items-start justify-between gap-4 p-4">
        <div>
          <span className={`text-2xl font-black tracking-tighter ${numberColor}`}>
            #{order.number ?? '?'}
          </span>
          {order.label && (
            <p className={`mt-1 text-xs font-bold truncate max-w-[140px] uppercase tracking-wide ${labelColor}`}>
              {order.label}
            </p>
          )}
        </div>
        <StatusBadge status={status} theme={theme} />
      </div>

      {onStatusChange && status !== 'done' && (
        <div className={`mt-2 flex gap-1 p-1 border-t rounded-b-2xl ${actionBarBg}`}>
          {PREV_STATUS[status] && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, PREV_STATUS[status]!)}
              className={`rounded-xl border px-2.5 py-2 text-[10px] font-black uppercase tracking-wider disabled:opacity-50 transition-colors ${backBtnClass}`}
            >
              Voltar
            </button>
          )}
          {NEXT_STATUS[status] && (
            <button
              disabled={isUpdating}
              onClick={() => onStatusChange(order.id, NEXT_STATUS[status]!)}
              className="flex-1 rounded-xl bg-brand-600 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-950 hover:bg-brand-500 disabled:opacity-50 shadow-sm transition-colors"
            >
              {status === 'waiting' ? 'Preparar' : status === 'preparing' ? 'Pronto!' : 'Entregar'}
            </button>
          )}

          <button
            disabled={isUpdating}
            onClick={() => setIsCancelModalOpen(true)}
            className={`flex items-center justify-center rounded-xl border p-2 disabled:opacity-50 transition-all font-black ${cancelBtnClass}`}
            title="Cancelar"
          >
            <Trash2 size={14} />
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
        message={`Tem certeza que deseja cancelar o pedido #${order.number}?`}
        confirmText="Confirmar"
        variant="danger"
        isLoading={isUpdating}
      />
    </div>
  )
}
