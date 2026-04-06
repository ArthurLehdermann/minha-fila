'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'
import { ExternalLink, Loader2, RotateCcw } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderList } from '@/components/OrderList'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { createOrder, resetSequence, updateOrderStatus } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { useThemePreference } from '@/lib/theme'
import type { Order, OrderStatus, LaravelResponse } from '@/types'

export default function AdminPage({ params }: { params: { uuid: string } }) {
  const { uuid } = params
  const router = useRouter()

  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)
  const [toast, setToast] = useState('')
  const { preference, resolvedTheme, updatePreference } = useThemePreference()

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
      // api.ts already returns LaravelResponse<Order>
      const res = await createOrder(uuid, label.trim() || '')
      const newOrder = res.data
      
      mutate((current?: LaravelResponse<Order[]>) => {
        const currentOrders = current?.data || []
        return { 
          data: [newOrder, ...currentOrders] 
        }
      }, false)
      
      setLabel('')
      showToast(`Pedido #${newOrder.number} criado`)
    } catch (err) {
      console.error('Erro ao criar pedido:', err)
      showToast('Erro ao criar pedido.')
    } finally {
      setCreating(false)
    }
  }

  async function handleStatusChange(orderId: string, status: OrderStatus) {
    setUpdatingId(orderId)

    try {
      const res = await updateOrderStatus(orderId, status)
      const updatedOrder = res.data
      
      mutate((current?: LaravelResponse<Order[]>) => {
        const currentOrders = current?.data || []
        return {
          data: currentOrders.map((o: Order) => (o.id === updatedOrder.id ? updatedOrder : o))
        }
      }, false)
    } catch (err) {
      console.error('Erro ao atualizar status:', err)
      showToast('Erro ao atualizar status.')
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleReset() {
    const result = await Swal.fire({
      title: 'Zerar a numeração do dia?',
      text: 'Todos os pedidos serão removidos e a sequência reiniciada.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#06b6d4',
      cancelButtonColor: '#1e293b',
      confirmButtonText: 'Sim, resetar',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      background: '#0f172a',
      color: '#f8fafc',
      customClass: {
        container: 'z-[9999]',
        popup: 'rounded-3xl border border-white/10',
        confirmButton: 'rounded-xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px]',
        cancelButton: 'rounded-xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px]',
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
        background: '#0f172a',
        color: '#f8fafc',
        customClass: { popup: 'rounded-3xl border border-white/10' },
      })
    } catch (err) {
      console.error('Erro ao resetar:', err)
      Swal.fire({
        title: 'Erro no reset',
        text: 'Tente novamente em instantes.',
        icon: 'error',
        background: '#0f172a',
        color: '#f8fafc',
        customClass: { popup: 'rounded-3xl border border-white/10' },
      })
    } finally {
      setResetting(false)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${resolvedTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <Loader2 className={`h-9 w-9 animate-spin ${resolvedTheme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`} />
      </div>
    )
  }

  return (
    <main
      className={`min-h-screen px-4 py-8 sm:px-6 lg:px-8 ${
        resolvedTheme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {toast && (
        <div
          className={`fixed left-1/2 top-8 z-[9999] -translate-x-1/2 rounded-2xl border px-6 py-3 text-xs font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4 ${
            resolvedTheme === 'dark'
              ? 'border-cyan-400/20 bg-slate-900 text-cyan-400 shadow-cyan-900/20'
              : 'border-cyan-500/30 bg-white text-cyan-700 shadow-cyan-500/10'
          }`}
        >
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header
          className={`mb-8 rounded-[2.5rem] border p-6 backdrop-blur-md sm:p-8 ${
            resolvedTheme === 'dark' ? 'border-white/5 bg-slate-900/40' : 'border-slate-200 bg-white/95 shadow-sm'
          }`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/80">Painel de Controle</p>
                </div>
              <h1 className={`text-3xl font-black tracking-tight ${resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Gestão da Fila</h1>
              <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${resolvedTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Hash: {uuid}</p>
            </div>

            <div className="flex items-center gap-3">
                <a
                  href={`/fila/${uuid}`}
                  target="_blank"
                  className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                    resolvedTheme === 'dark'
                      ? 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <ExternalLink className="h-4 w-4" />
                  Público
                </a>
                <AdminUserMenu themePreference={preference} onChangeTheme={updatePreference} />
            </div>
          </div>

          <form onSubmit={handleCreate} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Nome do cliente ou observação..."
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className={`w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none transition focus:border-cyan-400/50 focus:ring-4 focus:ring-cyan-400/10 ${
                    resolvedTheme === 'dark'
                      ? 'border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-2xl bg-cyan-400 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-slate-950 transition hover:bg-cyan-300 disabled:opacity-50 shadow-lg shadow-cyan-900/20 active:scale-95"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Chamar Próximo'}
            </button>
          </form>
        </header>

        <section className="grid gap-8">
          <OrderList
            title="🔔 Prontos para Retirada"
            orders={ready}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            highlight
            emptyMessage="Nenhum pedido pronto ainda."
          />

          <OrderList
            title="🍳 Em Preparação"
            orders={preparing}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />

          <OrderList
            title="⏳ Na Espera"
            orders={waiting}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />

          {done && done.length > 0 && (
            <details className="group rounded-[2rem] border border-white/5 bg-slate-900/20 p-6 transition-all hover:bg-slate-900/30">
              <summary className="flex cursor-pointer items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-open:text-slate-400">
                <span>Histórico do Dia ({done.length} Entregues)</span>
                <span className="text-xl leading-none transition-transform group-open:rotate-180">↓</span>
              </summary>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {done.map((order: Order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-950/40 px-5 py-4"
                  >
                    <span className="text-lg font-black text-slate-300 tracking-tighter">#{order.number}</span>
                    {order.label && <span className="max-w-[120px] truncate text-[10px] font-bold text-slate-500 uppercase tracking-wide">{order.label}</span>}
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>

        <div className="mt-12 flex justify-center border-t border-white/5 pt-8">
          <button
            onClick={handleReset}
            disabled={resetting}
            className="group inline-flex items-center gap-3 rounded-2xl border border-red-500/10 bg-red-500/5 px-6 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-red-400/80 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-180" />
            {resetting ? 'Limpando...' : 'Zerar Numeração'}
          </button>
        </div>
      </div>
    </main>
  )
}
