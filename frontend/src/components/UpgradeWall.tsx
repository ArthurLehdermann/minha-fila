'use client'

import { useState } from 'react'
import { Loader2, Zap } from 'lucide-react'
import { createCheckoutSession } from '@/lib/api'

export function UpgradeWall() {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)

  async function handleCheckout(plan: 'monthly' | 'yearly') {
    setLoading(plan)
    try {
      const { url } = await createCheckoutSession(plan)
      window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#111] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-400">
          <Zap className="h-8 w-8" />
        </div>

        <h2 className="text-2xl font-black text-white">Seu trial expirou</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Escolha um plano para continuar gerenciando suas filas. Sem taxas escondidas.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Mensal */}
          <div className="rounded-2xl border border-white/10 bg-[#161616] p-6 text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Mensal</p>
            <p className="mt-2 text-3xl font-black text-white">
              R$&nbsp;9,90
              <span className="text-sm font-normal text-gray-500">/mês</span>
            </p>
            <p className="mt-1 text-xs text-gray-600">Cancele quando quiser</p>
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loading !== null}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/12 disabled:opacity-50"
            >
              {loading === 'monthly' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assinar mensal'}
            </button>
          </div>

          {/* Anual */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-[#1a0e00] p-6 text-left">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-black text-black">
              MELHOR VALOR
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">Anual</p>
            <p className="mt-2 text-3xl font-black text-white">
              R$&nbsp;99,90
              <span className="text-sm font-normal text-gray-500">/ano</span>
            </p>
            <p className="mt-1 text-xs text-gray-600">Menos de R$&nbsp;8,33/mês</p>
            <button
              onClick={() => handleCheckout('yearly')}
              disabled={loading !== null}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-500 disabled:opacity-50"
            >
              {loading === 'yearly' ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Assinar anual'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
