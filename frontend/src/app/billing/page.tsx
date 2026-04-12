'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CreditCard, Loader2, Zap } from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'
import { createCheckoutSession, createPortalSession, cancelSubscription, resumeSubscription } from '@/lib/api'
import { useBillingStatus } from '@/hooks/useBillingStatus'
import { useThemePreference } from '@/lib/theme'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { dialogConfirm, dialogAlert } from '@/lib/dialog'
import { formatDateByUserTimezone } from '@/lib/datetime'

export default function BillingPage() {
  const router = useRouter()
  const { billing, isLoading, mutate: mutateBilling } = useBillingStatus()
  const { preference, updatePreference } = useThemePreference()
  const [checkoutLoading, setCheckoutLoading] = useState<'monthly' | 'yearly' | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [resumeLoading, setResumeLoading] = useState(false)
  const isDark = useThemePreference().resolvedTheme === 'dark'

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/auth/login')
  }, [router])

  async function handleCheckout(plan: 'monthly' | 'yearly') {
    setCheckoutLoading(plan)
    try {
      const { url } = await createCheckoutSession(plan)
      window.location.href = url
    } catch {
      setCheckoutLoading(null)
    }
  }

  async function handleCancel() {
    const ok = await dialogConfirm({
      title: 'Cancelar assinatura?',
      text: 'Você continuará com acesso até o fim do período pago. Pode reativar a qualquer momento.',
      confirmText: 'Sim, cancelar',
      variant: 'warning',
      isDark,
    })
    if (!ok) return
    setCancelLoading(true)
    try {
      await cancelSubscription()
      await mutateBilling()
      dialogAlert({ title: 'Assinatura cancelada', text: 'Seu acesso continua até o fim do período pago.', variant: 'info', isDark })
    } catch {
      dialogAlert({ title: 'Erro', text: 'Não foi possível cancelar. Tente pelo portal Stripe.', variant: 'danger', isDark })
    } finally {
      setCancelLoading(false)
    }
  }

  async function handleResume() {
    setResumeLoading(true)
    try {
      await resumeSubscription()
      await mutateBilling()
      dialogAlert({ title: 'Assinatura reativada!', text: 'Tudo certo, você continua com acesso completo.', variant: 'info', isDark })
    } catch {
      dialogAlert({ title: 'Erro', text: 'Não foi possível reativar. Tente pelo portal Stripe.', variant: 'danger', isDark })
    } finally {
      setResumeLoading(false)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const { url } = await createPortalSession()
      window.location.href = url
    } catch {
      setPortalLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  const status = billing?.plan_status
  const trialEnd = billing?.trial_ends_at ? formatDateByUserTimezone(billing.trial_ends_at) : null
  const renewsAt = billing?.renews_at ? formatDateByUserTimezone(billing.renews_at) : null

  const statusLabel =
    status === 'active' ? 'Ativo' :
    status === 'trial' ? `Trial — expira em ${trialEnd}` :
    status === 'grace' ? 'Assinatura encerra em breve' :
    status === 'blocked' ? 'Bloqueado' : '—'

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-4 py-6 text-[var(--app-fg)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
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
              <h1 className="text-2xl font-black sm:text-3xl">Plano & Faturamento</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">Gerencie sua assinatura e método de pagamento.</p>
            </div>
            <div className="self-start sm:self-auto">
              <AdminUserMenu
                themePreference={preference}
                onChangeTheme={updatePreference}
                planStatus={billing?.plan_status}
              />
            </div>
          </div>
        </header>

        {/* Status + actions row */}
        <div className="grid gap-6 lg:grid-cols-3">

          {/* Status card */}
          <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-soft)]">Status atual</p>
            <div className="mt-4 flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                status === 'active' ? 'bg-green-500/15 text-green-400' :
                status === 'trial' ? 'bg-brand-500/15 text-brand-400' :
                status === 'grace' ? 'bg-orange-500/15 text-orange-400' :
                'bg-red-500/15 text-red-400'
              }`}>
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-[var(--app-fg)]">{statusLabel}</p>
                {billing?.stripe_status && (
                  <p className="mt-0.5 text-xs text-[var(--text-soft)]">
                    Stripe: {billing.stripe_status}
                    {renewsAt && !billing.cancel_at_period_end && ` · renova em ${renewsAt}`}
                  </p>
                )}
              </div>
            </div>

            {billing?.cancel_at_period_end && renewsAt && (
              <p className="mt-4 rounded-2xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-300">
                Cancela em {renewsAt}. Acesso garantido até lá.
              </p>
            )}
          </div>

          {/* Active/Grace: portal */}
          {(status === 'active' || status === 'grace') && (
            <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 lg:col-span-2">
              <h2 className="font-black text-lg">Gerenciar assinatura</h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                Atualize o método de pagamento, veja o histórico de faturas ou cancele.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] px-5 py-3 text-sm font-bold text-[var(--app-fg)] transition hover:border-brand-500/30 disabled:opacity-50"
                >
                  {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                  Portal Stripe
                </button>

                {billing?.cancel_at_period_end ? (
                  <button
                    onClick={handleResume}
                    disabled={resumeLoading}
                    className="inline-flex items-center gap-2 rounded-2xl border border-brand-500/30 bg-brand-600/10 px-5 py-3 text-sm font-bold text-brand-400 transition hover:bg-brand-600/20 disabled:opacity-50"
                  >
                    {resumeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Reativar assinatura
                  </button>
                ) : (
                  <button
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                    Cancelar assinatura
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Trial/Blocked: plans */}
          {(status === 'trial' || status === 'blocked') && (
            <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 lg:col-span-2">
              <h2 className="font-black text-lg">Escolha um plano</h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">Sem taxas escondidas. Cancele quando quiser.</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* Mensal */}
                <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">Mensal</p>
                  <p className="mt-2 text-3xl font-black">
                    R$&nbsp;9,90
                    <span className="text-sm font-normal text-[var(--text-soft)]">/mês</span>
                  </p>
                  <button
                    onClick={() => handleCheckout('monthly')}
                    disabled={checkoutLoading !== null}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-[var(--border-soft)] px-4 py-3 text-sm font-black uppercase tracking-widest text-[var(--app-fg)] transition hover:border-brand-500/30 disabled:opacity-50"
                  >
                    {checkoutLoading === 'monthly' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assinar mensal'}
                  </button>
                </div>

                {/* Anual */}
                <div className="relative rounded-2xl border-2 border-brand-500 bg-brand-600/5 p-5">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-950">
                    Melhor valor
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-400">Anual</p>
                  <p className="mt-2 text-3xl font-black">
                    R$&nbsp;99,90
                    <span className="text-sm font-normal text-[var(--text-soft)]">/ano</span>
                  </p>
                  <button
                    onClick={() => handleCheckout('yearly')}
                    disabled={checkoutLoading !== null}
                    className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-brand-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-500 disabled:opacity-50"
                  >
                    {checkoutLoading === 'yearly' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assinar anual'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
