'use client'

import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { useParams, useRouter } from 'next/navigation'
import { Download, ExternalLink, Loader2, RotateCcw } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderList } from '@/components/OrderList'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { createOrder, getCompany, resetSequence, updateOrderStatus } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { useThemePreference } from '@/lib/theme'
import type { Company, Order, OrderStatus, LaravelResponse } from '@/types'

export default function AdminPage() {
  const params = useParams<{ uuid?: string | string[] }>()
  const uuid = Array.isArray(params?.uuid) ? params.uuid[0] : params?.uuid
  const companyUuid = uuid ?? ''
  const router = useRouter()

  const [label, setLabel] = useState('')
  const [creating, setCreating] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)
  const [toast, setToast] = useState('')
  const [company, setCompany] = useState<Company | null>(null)

  useEffect(() => {
    if (!companyUuid) return
    getCompany(companyUuid).then(setCompany).catch(() => {})
  }, [companyUuid])

  function handleDownloadQr() {
    if (!company?.qr_code_url) return
    const a = document.createElement('a')
    a.href = company.qr_code_url
    a.download = `qrcode-fila-${companyUuid}.png`
    a.click()
  }
  const { preference, resolvedTheme, updatePreference } = useThemePreference()

  const { waiting, preparing, ready, done, mutate, isLoading, isInactive } = useOrders(companyUuid)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/auth/login')
    }
  }, [router])

  if (!uuid) {
    return (
      <div className={`flex min-h-screen items-center justify-center ${resolvedTheme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <Loader2 className={`h-9 w-9 animate-spin ${resolvedTheme === 'dark' ? 'text-brand-500' : 'text-brand-600'}`} />
      </div>
    )
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2500)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreating(true)

    try {
      // api.ts already returns LaravelResponse<Order>
      const res = await createOrder(companyUuid, label.trim() || '')
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
      confirmButtonColor: '#d97706',
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
      await resetSequence(companyUuid)
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
        <Loader2 className={`h-9 w-9 animate-spin ${resolvedTheme === 'dark' ? 'text-brand-500' : 'text-brand-600'}`} />
      </div>
    )
  }

  if (isInactive) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center px-4 ${resolvedTheme === 'dark' ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'}`}>
        <div className={`w-full max-w-md rounded-3xl border p-8 text-center ${resolvedTheme === 'dark' ? 'border-white/10 bg-[#111]' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/15 text-yellow-400">
            <span className="text-3xl">⏸</span>
          </div>
          <h1 className="text-2xl font-black">Fila inativa</h1>
          <p className={`mt-3 text-sm leading-relaxed ${resolvedTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Esta fila está pausada. Reative-a no painel para continuar operando.
          </p>
          <a href="/fila" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-slate-950 hover:bg-brand-500 transition">
            Ir ao painel
          </a>
        </div>
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
              ? 'border-brand-500/20 bg-[#111] text-brand-500 shadow-black/20'
              : 'border-brand-500/30 bg-white text-brand-700 shadow-black/10'
          }`}
        >
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl">
        <header
          className={`mb-8 rounded-[2.5rem] border p-6 backdrop-blur-md sm:p-8 ${
            resolvedTheme === 'dark' ? 'border-white/5 bg-[#111]/40' : 'border-slate-200 bg-white/95 shadow-sm'
          }`}
        >
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-2 w-2 rounded-full bg-brand-600 animate-pulse" />
                    <a href="https://minha-fila.meugarcom.app/fila" className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-500/80 hover:text-brand-400 transition-colors">Painel de Controle</a>
                </div>
              <h1 className={`text-3xl font-black tracking-tight ${resolvedTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Gestão da Fila</h1>
              <p className={`mt-1 text-xs font-bold uppercase tracking-widest ${resolvedTheme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Hash: {companyUuid}</p>
            </div>

            <div className="flex items-center gap-3">
                <a
                  href={`/fila/${companyUuid}`}
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
                {company?.qr_code_url && (
                  <button
                    onClick={handleDownloadQr}
                    className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-xs font-black uppercase tracking-widest transition ${
                      resolvedTheme === 'dark'
                        ? 'border-white/5 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Download className="h-4 w-4" />
                    QR Code
                  </button>
                )}
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
                  className={`w-full rounded-2xl border px-5 py-4 text-sm font-medium outline-none transition focus:border-brand-500/50 focus:ring-4 focus:ring-brand-500/10 ${
                    resolvedTheme === 'dark'
                      ? 'border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600'
                      : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400'
                  }`}
                />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-2xl bg-brand-600 px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-brand-500 disabled:opacity-50 shadow-lg shadow-black/20 active:scale-95"
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
            theme={resolvedTheme}
          />

          <OrderList
            title="🍳 Em Preparação"
            orders={preparing}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            theme={resolvedTheme}
          />

          <OrderList
            title="⏳ Na Espera"
            orders={waiting}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            theme={resolvedTheme}
          />

          {done && done.length > 0 && (
            <details
              className={`group rounded-[2rem] border p-6 transition-all ${
                resolvedTheme === 'dark'
                  ? 'border-white/5 bg-[#111]/20 hover:bg-[#111]/30'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <summary
                className={`flex cursor-pointer items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] ${
                  resolvedTheme === 'dark' ? 'text-slate-500 group-open:text-slate-400' : 'text-slate-400 group-open:text-slate-600'
                }`}
              >
                <span>Histórico do Dia ({done.length} Entregues)</span>
                <span className="text-xl leading-none transition-transform group-open:rotate-180">↓</span>
              </summary>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {done.map((order: Order) => (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-4 ${
                      resolvedTheme === 'dark'
                        ? 'border-white/5 bg-slate-950/40'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <span
                        className={`text-lg font-black tracking-tighter ${
                          resolvedTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        #{order.number}
                      </span>
                      {order.label && (
                        <p
                          className={`mt-0.5 max-w-[120px] truncate text-[10px] font-bold uppercase tracking-wide ${
                            resolvedTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                          }`}
                        >
                          {order.label}
                        </p>
                      )}
                    </div>
                    {order.updated_at && (
                      <span
                        className={`text-[11px] font-bold tabular-nums ${
                          resolvedTheme === 'dark' ? 'text-slate-500' : 'text-slate-400'
                        }`}
                      >
                        {new Date(order.updated_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </details>
          )}
        </section>

        <div className={`mt-12 flex justify-center border-t pt-8 ${resolvedTheme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}>
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
