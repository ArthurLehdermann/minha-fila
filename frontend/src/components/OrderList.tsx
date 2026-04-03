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
  orders,
  onStatusChange,
  updatingId,
  emptyMessage = 'Nenhum pedido',
  highlight = false,
}: Props) {
  return (
    <section className="mb-6">
      <h2
        className={`mb-3 text-sm font-semibold uppercase tracking-wide ${
          highlight ? 'text-green-700' : 'text-gray-500'
        }`}
      >
        {title}
        <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-normal text-gray-600">
          {orders.length}
        </span>
      </h2>

      {orders.length === 0 ? (
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
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
