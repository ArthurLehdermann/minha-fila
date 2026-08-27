'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ShieldCheck, XCircle, ArrowLeft } from 'lucide-react'
import { verifyMagicLink } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

function VerifyContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const token = params.get('token') ?? ''
    const email = params.get('email') ?? ''

    if (!token || !email) {
      setStatus('error')
      return
    }

    verifyMagicLink(token, email)
      .then(({ data }) => {
        saveAuth(data.user)
        router.replace('/filas')
      })
      .catch(() => setStatus('error'))
  }, [params, router])

  if (status === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6 text-[var(--app-fg)]">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-xl font-black">Link inválido ou expirado</h1>
          <p className="mb-8 text-sm leading-relaxed text-[var(--text-soft)]">
            O link de acesso pode ter expirado por segurança ou já foi utilizado em outro navegador.
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-500"
            >
              Solicitar novo link
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--text-soft)] transition hover:text-[var(--app-fg)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao início
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6 text-[var(--app-fg)]">
      <div className="w-full max-w-md rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600/15 text-brand-400">
          <ShieldCheck className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-black">Verificando credenciais</h2>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Estabelecendo conexão segura
        </p>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6 text-[var(--app-fg)]">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
