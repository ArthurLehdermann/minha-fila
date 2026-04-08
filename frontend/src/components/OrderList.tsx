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
  theme?: 'light' | 'dark'
}

export function OrderList({
  title,
  orders = [],
  onStatusChange,
  updatingId,
  emptyMessage = 'Nenhum pedido hoje',
  highlight = false,
  theme = 'dark',
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
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ${
            theme === 'dark'
              ? 'bg-slate-900 text-slate-400 ring-white/5'
              : 'bg-slate-100 text-slate-500 ring-slate-200'
          }`}
        >
          {safeOrders.length}
        </span>
      </h2>

      {safeOrders.length === 0 ? (
        <p
          className={`rounded-2xl border border-dashed py-6 text-center text-xs font-medium ${
            theme === 'dark'
              ? 'border-white/5 bg-slate-900/30 text-slate-600'
              : 'border-slate-200 bg-slate-50 text-slate-400'
          }`}
        >
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
              theme={theme}
            />
          ))}
        </div>
      )}
    </section>
  )
}
