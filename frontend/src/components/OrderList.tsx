'use client'

import type { Order, OrderStatus } from '@/types'
import { OrderCard } from './OrderCard'

interface Props {
  title: string
  orders: Order[]
  onStatusChange?: (orderId: string, status: OrderStatus) => void
  updatingId?: string | null
  collapsible?: boolean
  defaultOpen?: boolean
  emptyMessage?: string
  highlight?: boolean
}

export function OrderList({
  title,
  orders = [],
  onStatusChange,
  updatingId,
  emptyMessage = 'Nenhum pedido hoje',
  highlight = false,
}: Props) {
  const safeOrders = Array.isArray(orders) ? orders : []

  return (
    <section className="mb-6 animate-in fade-in duration-500">
      <h2
        className={`mb-3 flex items-center justify-between text-xs font-black uppercase tracking-[0.1em] ${
          highlight ? 'text-brand-500' : 'text-slate-500'
        }`}
      >
        <span>{title}</span>
        <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-slate-400 ring-1 ring-white/5">
          {safeOrders.length}
        </span>
      </h2>

      {safeOrders.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/5 bg-slate-900/30 py-6 text-center text-xs font-medium text-slate-600">
          {emptyMessage}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {safeOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onStatusChange={onStatusChange}
              isUpdating={updatingId === order.id}
            />
          ))}
        </div>
      )}
    </section>
  )
}
