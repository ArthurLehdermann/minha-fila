'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Copy, Loader2, Zap, UtensilsCrossed, ExternalLink, Check } from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'
import { createCheckoutPix, getPixStatus, cancelSubscription } from '@/lib/api'
import { useBillingStatus } from '@/hooks/useBillingStatus'
import { useThemePreference } from '@/lib/theme'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { CardCheckoutForm } from '@/components/CardCheckoutForm'
import { dialogConfirm, dialogAlert } from '@/lib/dialog'
import { formatDateByUserTimezone } from '@/lib/datetime'
import { useI18n } from '@/lib/i18n'
import type { PixCheckout } from '@/types'

// Cross-sell: site de vendas do Meu Garçom (outro SaaS do mesmo time).
// Configurável via env para apontar pro domínio de marketing correto.
const MEU_GARCOM_URL = process.env.NEXT_PUBLIC_MEU_GARCOM_URL ?? 'https://meugarcom.app'

const PRECOS: Record<'mensal' | 'anual', string> = {
  mensal: 'R$ 9,90',
  anual: 'R$ 99,90',
}

export default function BillingPage() {
  const router = useRouter()
  const { t } = useI18n()
  const { billing, isLoading, mutate: mutateBilling } = useBillingStatus()
  const { preference, updatePreference } = useThemePreference()
  const [checkoutLoading, setCheckoutLoading] = useState<'mensal' | 'anual' | null>(null)
  const [pix, setPix] = useState<PixCheckout | null>(null)
  const [pixAprovado, setPixAprovado] = useState(false)
  const [copied, setCopied] = useState(false)
  const [metodo, setMetodo] = useState<'pix' | 'cartao'>('pix')
  const [cartaoCiclo, setCartaoCiclo] = useState<'mensal' | 'anual' | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)
  const isDark = useThemePreference().resolvedTheme === 'dark'
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const cardFormRef = useRef<HTMLDivElement | null>(null)
  const pixBoxRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) router.replace('/auth/login')
  }, [router])

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  useEffect(() => {
    if (cartaoCiclo) {
      cardFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [cartaoCiclo])

  useEffect(() => {
    if (pix) {
      pixBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [pix])

  async function handleCheckoutPix(ciclo: 'mensal' | 'anual') {
    setCheckoutLoading(ciclo)
    setPixAprovado(false)
    try {
      const dados = await createCheckoutPix(ciclo)
      setPix(dados)

      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = setInterval(async () => {
        try {
          const status = await getPixStatus(dados.id)
          if (status.aprovado) {
            clearInterval(pollRef.current!)
            setPixAprovado(true)
            await mutateBilling()
          } else if (status.expirado) {
            clearInterval(pollRef.current!)
          }
        } catch {
          // tenta de novo no próximo ciclo
        }
      }, 4000)
    } catch {
      dialogAlert({ title: t('common.error'), text: t('billing.pixError'), variant: 'danger', isDark })
    } finally {
      setCheckoutLoading(null)
    }
  }

  async function handleCopyPix() {
    if (!pix?.pix_qr_code) return
    await navigator.clipboard.writeText(pix.pix_qr_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCancel() {
    const ok = await dialogConfirm({
      title: t('billing.cancelTitle'),
      text: t('billing.cancelText'),
      confirmText: t('billing.cancelConfirm'),
      cancelText: t('common.cancel'),
      variant: 'warning',
      isDark,
    })
    if (!ok) return
    setCancelLoading(true)
    try {
      await cancelSubscription()
      await mutateBilling()
      dialogAlert({ title: t('billing.cancelOkTitle'), text: t('billing.cancelOkText'), variant: 'info', isDark })
    } catch {
      dialogAlert({ title: t('common.error'), text: t('billing.cancelError'), variant: 'danger', isDark })
    } finally {
      setCancelLoading(false)
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
  const assinaturaCartao = billing?.assinatura_cartao

  const statusLabel =
    status === 'active' ? t('billing.active') :
    status === 'trial' ? t('billing.trialExpires', { date: trialEnd ?? '' }) :
    status === 'blocked' ? t('billing.blocked') : '—'

  return (
    <main className="min-h-screen bg-[var(--app-bg)] px-4 py-6 text-[var(--app-fg)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Header */}
        <header className="rounded-3xl border border-[var(--border-soft)] bg-gradient-to-br from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] p-5 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Link
                href="/filas"
                className="mb-2 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] text-brand-300 hover:text-brand-200 transition-colors"
              >
                <ArrowLeft className="h-3 w-3" />
                {t('billing.panel')}
              </Link>
              <h1 className="text-2xl font-black sm:text-3xl">{t('billing.title')}</h1>
              <p className="mt-1 text-sm text-[var(--text-muted)]">{t('billing.subtitle')}</p>
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
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-soft)]">{t('billing.status')}</p>
            <div className="mt-4 flex items-center gap-3">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
                status === 'active' ? 'bg-green-500/15 text-green-400' :
                status === 'trial' ? 'bg-brand-500/15 text-brand-400' :
                'bg-red-500/15 text-red-400'
              }`}>
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <p className="font-black text-[var(--app-fg)]">{statusLabel}</p>
                {renewsAt && (
                  <p className="mt-0.5 text-xs text-[var(--text-soft)]">
                    {assinaturaCartao ? t('billing.renews', { date: renewsAt }) : t('billing.accessUntil', { date: renewsAt })}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Active: gerenciar assinatura de cartão */}
          {status === 'active' && assinaturaCartao && (
            <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 lg:col-span-2">
              <h2 className="font-black text-lg">{t('billing.manageTitle')}</h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                {t('billing.manageText', {
                  ciclo: t(`billing.ciclo.${assinaturaCartao.ciclo}`),
                })}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                >
                  {cancelLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {t('billing.cancelSub')}
                </button>
              </div>
            </div>
          )}

          {/* Active via Pix avulso: nada pra gerenciar, só informar */}
          {status === 'active' && !assinaturaCartao && (
            <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 lg:col-span-2">
              <h2 className="font-black text-lg">{t('billing.pixOnlyTitle')}</h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                {t('billing.pixOnlyText')}
              </p>
            </div>
          )}

          {/* Trial/Blocked: escolher plano e método de pagamento */}
          {(status === 'trial' || status === 'blocked') && (
            <div className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-6 lg:col-span-2">
              <h2 className="font-black text-lg">{t('billing.choosePlan')}</h2>
              <p className="mt-1 text-sm text-[var(--text-soft)]">
                {metodo === 'pix' ? t('billing.pixHint') : t('billing.cardHint')}
              </p>

              {/* Alternância Pix / Cartão */}
              <div className="mt-4 inline-flex rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] p-1">
                <button
                  type="button"
                  onClick={() => setMetodo('pix')}
                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition ${
                    metodo === 'pix' ? 'bg-brand-600 text-white' : 'text-[var(--text-soft)] hover:text-[var(--app-fg)]'
                  }`}
                >
                  {t('billing.pix')}
                </button>
                <button
                  type="button"
                  onClick={() => setMetodo('cartao')}
                  className={`rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition ${
                    metodo === 'cartao' ? 'bg-brand-600 text-white' : 'text-[var(--text-soft)] hover:text-[var(--app-fg)]'
                  }`}
                >
                  {t('billing.card')}
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {(['mensal', 'anual'] as const).map((ciclo) => (
                  <div
                    key={ciclo}
                    className={`relative rounded-2xl border p-5 ${
                      ciclo === 'anual' ? 'border-2 border-brand-500 bg-brand-600/5' : 'border-[var(--border-soft)] bg-[var(--surface-solid)]'
                    }`}
                  >
                    {ciclo === 'anual' && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-slate-950">
                        {t('billing.bestValue')}
                      </div>
                    )}
                    <p className={`text-xs font-bold uppercase tracking-widest ${ciclo === 'anual' ? 'text-brand-400' : 'text-[var(--text-soft)]'}`}>
                      {ciclo === 'mensal' ? t('billing.monthly') : t('billing.yearly')}
                    </p>
                    <p className="mt-2 text-3xl font-black">
                      {PRECOS[ciclo]}
                      <span className="text-sm font-normal text-[var(--text-soft)]">{ciclo === 'mensal' ? t('billing.perMonth') : t('billing.perYear')}</span>
                    </p>
                    {metodo === 'pix' ? (
                      <button
                        onClick={() => handleCheckoutPix(ciclo)}
                        disabled={checkoutLoading !== null}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-widest transition disabled:opacity-50 ${
                          ciclo === 'anual'
                            ? 'bg-brand-600 text-white hover:bg-brand-500'
                            : 'border border-[var(--border-soft)] text-[var(--app-fg)] hover:border-brand-500/30'
                        }`}
                      >
                        {checkoutLoading === ciclo ? <Loader2 className="h-4 w-4 animate-spin" /> : t('billing.payPix')}
                      </button>
                    ) : (
                      <button
                        onClick={() => setCartaoCiclo(cartaoCiclo === ciclo ? null : ciclo)}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-black uppercase tracking-widest transition ${
                          ciclo === 'anual'
                            ? 'bg-brand-600 text-white hover:bg-brand-500'
                            : 'border border-[var(--border-soft)] text-[var(--app-fg)] hover:border-brand-500/30'
                        } ${cartaoCiclo === ciclo ? 'ring-2 ring-brand-400' : ''}`}
                      >
                        {cartaoCiclo === ciclo ? t('billing.selected') : t('billing.subscribeCard')}
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {metodo === 'pix' && pix && (
                <div ref={pixBoxRef} className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] p-5">
                  {pixAprovado ? (
                    <p className="flex items-center gap-2 font-bold text-green-400">
                      <Check className="h-5 w-5" /> {t('billing.pixApproved')}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-[var(--app-fg)]">{t('billing.scanPix')}</p>
                      {pix.pix_qr_code_base64 && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={`data:image/png;base64,${pix.pix_qr_code_base64}`}
                          alt="QR Code Pix"
                          className="mx-auto mt-4 h-48 w-48 rounded-xl bg-white p-2"
                        />
                      )}
                      {pix.pix_qr_code && (
                        <button
                          onClick={handleCopyPix}
                          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-soft)] px-4 py-3 text-sm font-bold text-[var(--app-fg)] transition hover:border-brand-500/30"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          {copied ? t('billing.copied') : t('billing.copyPix')}
                        </button>
                      )}
                      <p className="mt-3 text-xs text-[var(--text-soft)]">{t('billing.waitingPayment')}</p>
                    </>
                  )}
                </div>
              )}

              {metodo === 'cartao' && cartaoCiclo && (
                <div ref={cardFormRef}>
                  <CardCheckoutForm key={cartaoCiclo} ciclo={cartaoCiclo} onSuccess={mutateBilling} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Cross-sell: Meu Garçom */}
        <a
          href={MEU_GARCOM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col gap-4 rounded-3xl border border-[var(--border-soft)] bg-gradient-to-br from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] p-6 transition hover:border-brand-500/40 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
              <UtensilsCrossed className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-brand-300">{t('billing.crossTitle')}</p>
              <h2 className="mt-1 text-lg font-black text-[var(--app-fg)]">{t('billing.crossHeading')}</h2>
              <p className="mt-1 max-w-xl text-sm text-[var(--text-soft)]">
                {t('billing.crossText')}
              </p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 self-start rounded-2xl border border-brand-500/30 bg-brand-600/10 px-5 py-3 text-sm font-black uppercase tracking-widest text-brand-400 transition group-hover:bg-brand-600/20 sm:self-auto">
            {t('billing.seePlans')} <ExternalLink className="h-4 w-4" />
          </span>
        </a>
      </div>
    </main>
  )
}
