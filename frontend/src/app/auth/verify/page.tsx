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
        saveAuth(data.token, data.user)
        router.replace('/fila')
      })
      .catch(() => setStatus('error'))
  }, [params, router])

  if (status === 'error') {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-50 via-transparent to-transparent opacity-60"></div>
        
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center border border-gray-100">
           <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
            <XCircle className="h-10 w-10" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Link inválido ou expirado</h1>
          <p className="text-gray-500 font-medium leading-relaxed mb-8">
            O link de acesso pode ter expirado por segurança ou já foi utilizado em outro navegador.
          </p>
          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-black transition-all"
            >
              Solicitar Novo Link
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
      <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-50 via-transparent to-transparent opacity-60"></div>
      
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-500 relative">
            <Loader2 className="h-12 w-12 animate-spin opacity-20" />
            <ShieldCheck className="h-10 w-10 absolute" />
        </div>
        <h2 className="text-xl font-black text-gray-900">Verificando Credenciais</h2>
        <p className="mt-2 text-sm font-bold text-brand-500 uppercase tracking-widest animate-pulse">Estabelecendo conexão segura...</p>
      </div>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen flex-col items-center justify-center p-6">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-brand-500 mx-auto mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Iniciando...</p>
          </div>
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
