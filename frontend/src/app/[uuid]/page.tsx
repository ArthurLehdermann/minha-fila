'use client'

import { useOrders } from '@/hooks/useOrders'
import { StatusBadge } from '@/components/StatusBadge'

export default function PublicQueuePage({ params }: { params: { uuid: string } }) {
  const { uuid } = params
  const { waiting, preparing, ready, isLoading } = useOrders(uuid)

  const active = [...ready, ...preparing, ...waiting]

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <header className="mb-6 text-center">
        <h1 className="text-xl font-bold text-gray-800">Acompanhe seu pedido</h1>
        <p className="text-xs text-gray-400">Atualização em tempo real</p>
      </header>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
        </div>
      )}

      {/* Prontos — destaque */}
      {ready.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-3 text-center text-sm font-bold uppercase tracking-wide text-green-700">
            🎉 Prontos para retirada
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {ready.map((order) => (
              <div
                key={order.id}
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-green-400 bg-green-50 p-6 shadow-md"
              >
                <span className="text-5xl font-black text-green-700">#{order.number}</span>
                {order.label && (
                  <span className="mt-1 text-sm text-green-600">{order.label}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Em preparação e aguardando */}
      {(preparing.length > 0 || waiting.length > 0) && (
        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Na fila
          </h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {[...preparing, ...waiting].map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
              >
                <span className="text-lg font-bold text-gray-800">#{order.number}</span>
                <div className="flex flex-col items-end gap-1">
                  {order.label && (
                    <span className="text-xs text-gray-500">{order.label}</span>
                  )}
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {!isLoading && active.length === 0 && (
        <div className="py-16 text-center text-gray-400">
          <p className="text-4xl mb-2">🏖️</p>
          <p className="text-sm">Nenhum pedido no momento</p>
        </div>
      )}
    </main>
  )
}
