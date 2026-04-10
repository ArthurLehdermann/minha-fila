'use client'

import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Download, ExternalLink, Loader2, RotateCcw, Pencil } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderList } from '@/components/OrderList'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { createOrder, getCompany, listCompanies, resetSequence, updateCompanyLabels, updateOrderStatus } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'
import { useThemePreference } from '@/lib/theme'
import { useBillingStatus } from '@/hooks/useBillingStatus'
import { dialogConfirm, dialogInput } from '@/lib/dialog'
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
  const [allCompanies, setAllCompanies] = useState<Company[]>([])
  const [stageLabels, setStageLabels] = useState({
    ready: 'Prontos para Retirada',
    preparing: 'Em Atendimento',
    waiting: 'Na Espera',
  })
  const { preference, resolvedTheme, updatePreference } = useThemePreference()
  const { billing } = useBillingStatus()

  useEffect(() => {
    if (!companyUuid) return
    getCompany(companyUuid).then((c) => {
      setCompany(c)
      setStageLabels({
        ready: c.label_ready ?? 'Prontos para Retirada',
        preparing: c.label_preparing ?? 'Em Atendimento',
        waiting: c.label_waiting ?? 'Na Espera',
      })
    }).catch(() => {})
    listCompanies().then(({ data }) => setAllCompanies(Array.isArray(data) ? data : [])).catch(() => {})
  }, [companyUuid])

  const activeCount = allCompanies.filter((c) => c.status === 'active').length
  const totalCount = allCompanies.length
  const trialDaysLeft = billing?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(billing.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null

  async function handleDownloadQr() {
    const publicUrl = `https://minha-fila.meugarcom.app/filas/${companyUuid}`
    try {
      const size = 512
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, publicUrl, { width: size, margin: 2, errorCorrectionLevel: 'H' })
      const ctx = canvas.getContext('2d')
      if (ctx) {
        await new Promise<void>((resolve) => {
          const logo = new window.Image()
          logo.src = '/logo.png'
          logo.onload = () => {
            const logoSize = Math.round(size * 0.22)
            const x = Math.round((size - logoSize) / 2)
            const y = Math.round((size - logoSize) / 2)
            const pad = 10
            ctx.fillStyle = '#ffffff'
            ctx.beginPath()
            try { ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, 12) }
            catch { ctx.rect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2) }
            ctx.fill()
            ctx.drawImage(logo, x, y, logoSize, logoSize)
            resolve()
          }
          logo.onerror = () => resolve()
        })
      }
      const a = document.createElement('a')
      a.href = canvas.toDataURL('image/png')
      a.download = `qrcode-fila-${companyUuid}.png`
      a.click()
    } catch (err) {
      console.error('Erro ao gerar QR Code:', err)
    }
  }

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

  async function handleRenameStage(key: 'ready' | 'preparing' | 'waiting') {
    const currentName = stageLabels[key]
    const newName = await dialogInput({ title: 'Renomear etapa', inputValue: currentName, isDark: resolvedTheme === 'dark' })
    if (!newName || newName === currentName) return

    const next = { ...stageLabels, [key]: newName }
    setStageLabels(next)

    try {
      await updateCompanyLabels(companyUuid, {
        label_ready: next.ready,
        label_preparing: next.preparing,
        label_waiting: next.waiting,
      })
    } catch {
      setStageLabels(stageLabels)
      showToast('Erro ao salvar nome da etapa.')
    }
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
      showToast(`Senha #${newOrder.number} criada`)
    } catch (err) {
      console.error('Erro ao criar senha:', err)
      showToast('Erro ao criar senha.')
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
    const ok = await dialogConfirm({
      title: 'Zerar a numeração do dia?',
      text: 'Todas as senhas serão removidas e a sequência reiniciada.',
      confirmText: 'Sim, resetar',
      variant: 'warning',
      isDark: resolvedTheme === 'dark',
    })
    if (!ok) return

    setResetting(true)
    try {
      await resetSequence(companyUuid)
      mutate({ data: [] }, false)
      showToast('Fila reiniciada com sucesso.')
    } catch (err) {
      console.error('Erro ao resetar:', err)
      showToast('Erro ao resetar. Tente novamente.')
    } finally {
      setResetting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
        <Loader2 className="h-9 w-9 animate-spin text-brand-500" />
      </div>
    )
  }

  if (isInactive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4 bg-[var(--app-bg)] text-[var(--app-fg)]">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/15 text-yellow-400">
            <span className="text-3xl">⏸</span>
          </div>
          <h1 className="text-2xl font-black">Fila inativa</h1>
          <p className="mt-3 text-sm leading-relaxed text-[var(--text-muted)]">
            Esta fila está pausada. Reative-a no painel para continuar operando.
          </p>
          <a href="/filas" className="mt-6 inline-flex items-center justify-center rounded-2xl bg-brand-600 px-6 py-3 text-sm font-black text-white hover:bg-brand-500 transition">
            Ir ao painel
          </a>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-4 py-6 text-[var(--app-fg)] sm:px-6 lg:px-8">
      {toast && (
        <div className="fixed left-1/2 top-6 z-[9999] -translate-x-1/2 rounded-2xl border border-brand-500/20 bg-[var(--surface-1)] px-6 py-3 text-xs font-black uppercase tracking-widest shadow-2xl animate-in fade-in slide-in-from-top-4">
          {toast}
        </div>
      )}

      <div className="mx-auto max-w-6xl space-y-6">
        <header className="rounded-3xl border border-[var(--border-soft)] bg-gradient-to-br from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <a
                href="/filas"
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-brand-300 hover:text-brand-200 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                Painel
              </a>
              <h1 className="text-2xl font-black sm:text-3xl">Gestão da Fila</h1>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                {company?.name ?? companyUuid}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <a
                href={`/filas/${companyUuid}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--app-fg)] transition hover:border-brand-500/30"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Público
              </a>
              <button
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-[var(--app-fg)] transition hover:border-brand-500/30"
              >
                <Download className="h-3.5 w-3.5" />
                QR Code
              </button>
              <AdminUserMenu
                themePreference={preference}
                onChangeTheme={updatePreference}
                activeCount={activeCount}
                totalCount={totalCount}
                planStatus={billing?.plan_status}
                trialDaysLeft={trialDaysLeft}
              />
            </div>
          </div>

        </header>

        <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 sm:p-6">
          <form onSubmit={handleCreate} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Nome da pessoa ou observação..."
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] px-5 py-3.5 text-sm text-[var(--app-fg)] placeholder:text-[var(--text-soft)] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
            />
            <button
              type="submit"
              disabled={creating}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-8 py-3.5 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:bg-brand-500 disabled:opacity-50 active:scale-95"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Chamar Próximo'}
            </button>
          </form>
        </section>

        <section className="grid gap-8">
          <OrderList
            title={`🔔 ${stageLabels.ready}`}
            orders={ready}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            highlight
            emptyMessage="Nenhuma senha pronta ainda."
            theme={resolvedTheme}
            onRename={() => handleRenameStage('ready')}
          />

          <OrderList
            title={`🍳 ${stageLabels.preparing}`}
            orders={preparing}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            theme={resolvedTheme}
            onRename={() => handleRenameStage('preparing')}
          />

          <OrderList
            title={`⏳ ${stageLabels.waiting}`}
            orders={waiting}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
            theme={resolvedTheme}
            onRename={() => handleRenameStage('waiting')}
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

        <div className="flex justify-center border-t border-[var(--border-soft)] pt-8">
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
