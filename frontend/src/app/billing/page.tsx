'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreditCard, Loader2, Zap } from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'
import { createCheckoutSession, createPortalSession } from '@/lib/api'
import { useBillingStatus } from '@/hooks/useBillingStatus'
import { useState } from 'react'

export default function BillingPage() {
  const router = useRouter()
  const { billing, isLoading } = useBillingStatus()
  const [checkoutLoading, setCheckoutLoading] = useState<'monthly' | 'yearly' | null>(null)
  const [portalLoading, setPortalLoading] = useState(false)

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
  const trialEnd = billing?.trial_ends_at ? new Date(billing.trial_ends_at).toLocaleDateString('pt-BR') : null
  const renewsAt = billing?.renews_at ? new Date(billing.renews_at).toLocaleDateString('pt-BR') : null

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-4 py-10 text-[var(--app-fg)]">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-2xl font-black">Plano & Faturamento</h1>
          <p className="mt-1 text-sm text-[var(--text-soft)]">Gerencie sua assinatura e método de pagamento.</p>
        </header>

        {/* Status card */}
        <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
              <Zap className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-soft)]">Status atual</p>
              <p className="font-black capitalize text-white">
                {status === 'active' && 'Ativo'}
                {status === 'trial' && `Trial — expira em ${trialEnd}`}
                {status === 'grace' && 'Grace period (cancela em breve)'}
                {status === 'blocked' && 'Bloqueado'}
              </p>
            </div>
          </div>

          {billing?.cancel_at_period_end && renewsAt && (
            <p className="mt-4 rounded-xl border border-orange-500/20 bg-orange-500/10 px-4 py-3 text-sm text-orange-300">
              Sua assinatura será cancelada em {renewsAt}. Você ainda tem acesso até lá.
            </p>
          )}

          {billing?.stripe_status && (
            <p className="mt-2 text-xs text-[var(--text-soft)]">
              Stripe status: <span className="font-semibold">{billing.stripe_status}</span>
              {renewsAt && !billing.cancel_at_period_end && ` · Renova em ${renewsAt}`}
            </p>
          )}
        </div>

        {/* Active subscription actions */}
        {(status === 'active' || status === 'grace') && (
          <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
            <h2 className="font-black">Gerenciar assinatura</h2>
            <p className="mt-1 text-sm text-[var(--text-soft)]">
              Atualize o método de pagamento, cancele ou veja o histórico de faturas.
            </p>
            <button
              onClick={handlePortal}
              disabled={portalLoading}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] px-5 py-3 text-sm font-bold text-[var(--app-fg)] transition hover:bg-white/5 disabled:opacity-50"
            >
              {portalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
              Portal do cliente Stripe
            </button>
          </div>
        )}

        {/* Plans for trial/blocked */}
        {(status === 'trial' || status === 'blocked') && (
          <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6">
            <h2 className="font-black">Escolha um plano</h2>
            <p className="mt-1 text-sm text-[var(--text-soft)]">Sem taxas escondidas. Cancele quando quiser.</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] p-5 text-left">
                <p className="text-xs text-[var(--text-soft)]">Mensal</p>
                <p className="mt-1 text-2xl font-black">R$&nbsp;9,90<span className="text-sm font-normal text-[var(--text-soft)]">/mês</span></p>
                <button
                  onClick={() => handleCheckout('monthly')}
                  disabled={checkoutLoading !== null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-white/5 disabled:opacity-50"
                >
                  {checkoutLoading === 'monthly' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assinar mensal'}
                </button>
              </div>

              <div className="relative rounded-2xl border-2 border-brand-500 bg-[#1a0e00] p-5 text-left">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-black text-black">
                  MELHOR VALOR
                </div>
                <p className="text-xs text-brand-400">Anual</p>
                <p className="mt-1 text-2xl font-black">R$&nbsp;99,90<span className="text-sm font-normal text-gray-500">/ano</span></p>
                <button
                  onClick={() => handleCheckout('yearly')}
                  disabled={checkoutLoading !== null}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-500 disabled:opacity-50"
                >
                  {checkoutLoading === 'yearly' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assinar anual'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
