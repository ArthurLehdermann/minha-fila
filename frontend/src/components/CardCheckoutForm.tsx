'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2, Lock } from 'lucide-react'
import { getMercadoPago } from '@/lib/mercadopago'
import { createCheckoutCartao } from '@/lib/api'

interface CardCheckoutFormProps {
  ciclo: 'mensal' | 'anual'
  onSuccess: () => unknown
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/**
 * Formulário de assinatura no cartão. Número, validade e CVV são Secure
 * Fields do Mercado Pago (iframes hospedados por eles) — o front só recebe
 * de volta um `card_token_id`, nunca os dados do cartão em si.
 */
export function CardCheckoutForm({ ciclo, onSuccess }: CardCheckoutFormProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [loadError, setLoadError] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [cpf, setCpf] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(false)

  const mpRef = useRef<any>(null)
  const fieldsRef = useRef<{ cardNumber?: any; expirationDate?: any; securityCode?: any }>({})

  const cardNumberId = `mf-card-number-${ciclo}`
  const expirationId = `mf-card-expiration-${ciclo}`
  const securityCodeId = `mf-card-cvv-${ciclo}`

  useEffect(() => {
    let cancelled = false

    getMercadoPago()
      .then((mp) => {
        if (cancelled) return
        mpRef.current = mp

        fieldsRef.current.cardNumber = mp.fields
          .create('cardNumber', { placeholder: 'Número do cartão' })
          .mount(cardNumberId)
        fieldsRef.current.expirationDate = mp.fields
          .create('expirationDate', { placeholder: 'MM/AA' })
          .mount(expirationId)
        fieldsRef.current.securityCode = mp.fields
          .create('securityCode', { placeholder: 'CVV' })
          .mount(securityCodeId)

        setStatus('ready')
      })
      .catch((e: Error) => {
        if (cancelled) return
        setLoadError(e.message || 'Não foi possível carregar o pagamento por cartão.')
        setStatus('error')
      })

    return () => {
      cancelled = true
      Object.values(fieldsRef.current).forEach((field) => field?.unmount?.())
      fieldsRef.current = {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ciclo])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError('')

    const cpfDigits = cpf.replace(/\D/g, '')
    if (!cardholderName.trim()) {
      setSubmitError('Informe o nome impresso no cartão.')
      return
    }
    if (cpfDigits.length !== 11) {
      setSubmitError('Informe um CPF válido.')
      return
    }
    if (!mpRef.current) {
      setSubmitError('Pagamento por cartão ainda não carregou. Tente de novo em instantes.')
      return
    }

    setSubmitting(true)
    try {
      const token = await mpRef.current.fields.createCardToken({
        cardholderName: cardholderName.trim(),
        identificationType: 'CPF',
        identificationNumber: cpfDigits,
      })

      await createCheckoutCartao(ciclo, token.id)
      setDone(true)
      await onSuccess()
    } catch {
      setSubmitError('Não foi possível confirmar o cartão. Confira os dados e tente de novo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] p-5 text-sm font-bold text-[var(--app-fg)]">
        Assinatura criada! A primeira cobrança está sendo processada — o acesso libera assim que o Mercado Pago confirmar.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] p-5">
      <p className="flex items-center gap-2 text-sm font-bold text-[var(--app-fg)]">
        <Lock className="h-4 w-4 text-brand-400" />
        Dados do cartão
      </p>
      <p className="mt-1 text-xs text-[var(--text-soft)]">
        Cobrança recorrente ({ciclo === 'anual' ? 'anual' : 'mensal'}). Cancele quando quiser.
      </p>

      {status === 'error' && (
        <p className="mt-4 text-xs font-semibold text-red-400">{loadError}</p>
      )}

      <div className="mt-4 space-y-3">
        <div id={cardNumberId} className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-white px-3" />

        <div className="grid grid-cols-2 gap-3">
          <div id={expirationId} className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-white px-3" />
          <div id={securityCodeId} className="h-11 w-full rounded-xl border border-[var(--border-soft)] bg-white px-3" />
        </div>

        <input
          type="text"
          placeholder="Nome impresso no cartão"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          autoComplete="cc-name"
          className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--app-bg)] px-4 py-3 text-sm text-[var(--app-fg)] placeholder:text-[var(--text-soft)] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />

        <input
          type="text"
          inputMode="numeric"
          placeholder="CPF do titular"
          value={cpf}
          onChange={(e) => setCpf(formatCpf(e.target.value))}
          maxLength={14}
          className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--app-bg)] px-4 py-3 text-sm text-[var(--app-fg)] placeholder:text-[var(--text-soft)] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
        />
      </div>

      {submitError && <p className="mt-3 text-xs font-semibold text-red-400">{submitError}</p>}

      <button
        type="submit"
        disabled={status !== 'ready' || submitting}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting || status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirmar assinatura'}
      </button>

      <p className="mt-3 flex items-center gap-1.5 text-[11px] text-[var(--text-soft)]">
        <Lock className="h-3 w-3" />
        Número, validade e CVV vão direto ao Mercado Pago — não passam pelos nossos servidores.
      </p>
    </form>
  )
}
