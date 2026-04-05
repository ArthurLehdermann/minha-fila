'use client'

import { use, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { OrderList } from '@/components/OrderList'
import { createOrder, updateOrderStatus, resetSequence } from '@/lib/api'
import { getUser, isAuthenticated } from '@/lib/auth'
import type { OrderStatus } from '@/types'
import { ConfirmDialog } from '@/components/ConfirmDialog'

export default function AdminPage({ params }: { params: { uuid: string } }) {
  const { uuid } = params
  const router = useRouter()

  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)
  const [isResetModalOpen, setIsResetModalOpen] = useState(false)
  const [toast, setToast] = useState('')

  const { orders, waiting, preparing, ready, done, mutate, isLoading } = useOrders(uuid)

  // Guard: must be authenticated
  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/login')
      return
    }
    // We remove the strict company_uuid check here if we want to allow 
    // managing multiple companies, or we add a proper backend check.
  }, [uuid, router])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)
    try {
      const { data } = await createOrder(uuid, label.trim() || '')
      mutate((current: any) => (current ? { ...current, data: [data, ...current.data] } : { data: [data] }), false)
      setLabel('')
      showToast(`Pedido #${data.number} criado!`)
    } catch {
      showToast('Erro ao criar pedido.')
    } finally {
      setCreating(false)
    }
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId)
    try {
      const { data } = await updateOrderStatus(orderId, status)
      mutate(
        (current: any) =>
          current
            ? { ...current, data: current.data.map((o: any) => (o.id === data.id ? data : o)) }
            : current,
        false,
      )
    } catch {
      showToast('Erro ao atualizar status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleReset() {
    setResetting(true)
    try {
      await resetSequence(uuid)
      mutate({ data: [] }, false) // Clear orders locally immediately
      showToast('Fila zerada com sucesso.')
    } catch {
      showToast('Erro ao zerar numeração.')
    } finally {
      setResetting(false)
      setIsResetModalOpen(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <ConfirmDialog
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
        title="Zerar Fila do Dia"
        message="Tem certeza que deseja zerar a numeração? Isso apagará TODOS os pedidos existentes e recomeçará do número 1."
        confirmText="Sim, zerar tudo"
        variant="danger"
        isLoading={resetting}
      />
      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-xl bg-gray-900 px-4 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}

      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-gray-900">Painel Admin</h1>
          <p className="text-xs text-gray-400">{uuid}</p>
        </div>
        <a
          href={`/fila/${uuid}`}
          target="_blank"
          className="rounded-lg border border-gray-100 bg-white px-4 py-2 text-xs font-bold text-gray-600 shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          Ver Fila Pública ↗
        </a>
      </header>

      <div className="mx-auto max-w-4xl p-4">
        {/* Create order */}
        <form onSubmit={handleCreate} className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Descrição do pedido (opcional)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
          <button
            type="submit"
            disabled={creating}
            className="rounded-xl bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-50 whitespace-nowrap transition-colors"
          >
            {creating ? '…' : '+ Novo pedido'}
          </button>
        </form>

        {/* Prontos */}
        <OrderList
          title="🎉 Prontos"
          orders={ready}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
          highlight
          emptyMessage=""
        />

        {/* Preparando */}
        <OrderList
          title="🍳 Preparando"
          orders={preparing}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />

        {/* Aguardando */}
        <OrderList
          title="⏳ Aguardando"
          orders={waiting}
          onStatusChange={handleStatusChange}
          updatingId={updatingId}
        />

        {/* Finalizados (colapsado) */}
        {done.length > 0 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-gray-400 hover:text-gray-600">
              ✅ Entregues ({done.length})
            </summary>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {done.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 opacity-60"
                >
                  <span className="font-bold text-gray-500">#{order.number}</span>
                  {order.label && (
                    <span className="text-xs text-gray-400">{order.label}</span>
                  )}
                </div>
              ))}
            </div>
          </details>
        )}

        {/* Reset sequence */}
        <div className="mt-8 border-t border-gray-200 pt-4">
          <button
            onClick={() => setIsResetModalOpen(true)}
            disabled={resetting}
            className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-50"
          >
            {resetting ? 'Zerando…' : 'Zerar numeração do dia'}
          </button>
        </div>
      </div>
    </main>
  )
}
