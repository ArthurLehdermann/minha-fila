'use client'

import { Zap } from 'lucide-react'
import Link from 'next/link'

export function UpgradeWall() {
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

        <Link
          href="/billing"
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
        >
          Ver planos
        </Link>
      </div>
    </div>
  )
}
