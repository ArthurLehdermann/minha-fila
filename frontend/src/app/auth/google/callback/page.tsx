'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Loader2, ShieldCheck, XCircle } from 'lucide-react'
import { saveAuth } from '@/lib/auth'
import type { User } from '@/types'

function GoogleCallbackContent() {
  const router = useRouter()
  const params = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'error'>('loading')

  useEffect(() => {
    const token = params.get('token') ?? ''
    const rawUser = params.get('user') ?? ''

    if (!token || !rawUser) {
      setStatus('error')
      return
    }

    try {
      const user = JSON.parse(rawUser) as User
      saveAuth(token, user)
      router.replace('/filas')
    } catch {
      setStatus('error')
    }
  }, [params, router])

  if (status === 'error') {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
        <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-50 via-transparent to-transparent opacity-60" />

        <div className="w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-black text-gray-900">Erro ao entrar com Google</h1>
          <p className="mb-8 leading-relaxed text-gray-500">Não foi possível concluir o login. Tente novamente.</p>
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-black"
            >
              Voltar para o login
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 transition-colors hover:text-gray-900"
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
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-50 via-transparent to-transparent opacity-60" />

      <div className="text-center">
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-500">
          <Loader2 className="h-12 w-12 animate-spin opacity-20" />
          <ShieldCheck className="absolute h-10 w-10" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Conectando sua conta</h2>
        <p className="mt-2 animate-pulse text-sm font-bold uppercase tracking-widest text-brand-500">
          Finalizando autenticação segura...
        </p>
      </div>
    </main>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-brand-500" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Iniciando...</p>
          </div>
        </main>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  )
}
