'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { ExternalLink, Loader2, RotateCcw } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderList } from '@/components/OrderList'
import { createOrder, resetSequence, updateOrderStatus } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import type { OrderStatus } from '@/types'

export default function AdminPage({ params }: { params: { uuid: string } }) {
  const { uuid } = params
  const router = useRouter()

  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)
  const [toast, setToast] = useState('')

  const { waiting, preparing, ready, done, mutate, isLoading } = useOrders(uuid)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/login')
    }
  }, [router])

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
      showToast(`Pedido #${data.number} criado`) 
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
          current ? { ...current, data: current.data.map((order: any) => (order.id === data.id ? data : order)) } : current,
        false,
      )
    } catch {
      showToast('Erro ao atualizar status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleReset() {
    const result = await Swal.fire({
      title: 'Excluir a fila atual?',
      text: 'Todos os pedidos serão removidos e a sequência reiniciada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, resetar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        container: 'z-[1000]',
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    })

    if (!result.isConfirmed) return

    setResetting(true)
    try {
      await resetSequence(uuid)
      mutate({ data: [] }, false)
      Swal.fire({
        title: 'Fila reiniciada',
        text: 'A sequência foi zerada com sucesso.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: 'rounded-2xl' },
      })
    } catch {
      Swal.fire({
        title: 'Não foi possível resetar',
        text: 'Tente novamente em instantes.',
        icon: 'error',
        customClass: { popup: 'rounded-2xl' },
      })
    } finally {
      setResetting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-9 w-9 animate-spin text-cyan-300" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-4 text-slate-50 sm:px-6 lg:px-8">
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border border-white/10 bg-slate-900 px-4 py-2 text-sm text-slate-100 shadow-lg">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header className="mb-5 rounded-3xl border border-white/10 bg-slate-900/70 p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Painel Admin</p>
              <h1 className="mt-1 text-2xl font-black text-white">Gestão da fila</h1>
              <p className="mt-1 text-xs text-slate-400 sm:text-sm">ID: {uuid}</p>
            </div>

            <a
              href={`/fila/${uuid}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <ExternalLink className="h-4 w-4" />
              Visualizar fila pública
            </a>
          </div>

          <form onSubmit={handleCreate} className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              type="text"
              placeholder="Descrição do pedido (opcional)"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-950/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50"
            >
              {creating ? 'Criando...' : '+ Novo pedido'}
            </button>
          </form>
        </header>

        <section className="space-y-3">
          <OrderList
            title="🎉 Prontos"
            orders={ready}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            highlight
            emptyMessage=""
          />

          <OrderList
            title="🍳 Preparando"
            orders={preparing}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />

          <OrderList
            title="⏳ Aguardando"
            orders={waiting}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />

          {done.length > 0 && (
            <details className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
              <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-300">
                ✅ Entregues ({done.length})
              </summary>
              <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {done.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-800/80 px-4 py-3"
                  >
                    <span className="font-bold text-slate-200">#{order.number}</span>
                    {order.label && <span className="max-w-[140px] truncate text-xs text-slate-400">{order.label}</span>}
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>

        <div className="mt-6 border-t border-white/10 pt-4">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20 disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {resetting ? 'Resetando...' : 'Zerar numeração do dia'}
          </button>
        </div>
      </div>
    </main>
  )
}
