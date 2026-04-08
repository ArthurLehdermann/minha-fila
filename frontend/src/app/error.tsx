'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0d0d0d] px-4 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.08),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(217,119,6,0.06),transparent_35%)]" />

      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-black text-white">Algo deu errado</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-400">
          Ocorreu um erro inesperado. Tente recarregar a página ou voltar para o início.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            onClick={reset}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-black text-white transition hover:bg-brand-500"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar novamente
          </button>
          <Link
            href="/fila"
            className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 px-4 py-3 text-sm font-semibold text-gray-400 transition hover:bg-white/5 hover:text-white"
          >
            Voltar ao painel
          </Link>
        </div>
      </div>
    </main>
  )
}
