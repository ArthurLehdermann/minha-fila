'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyMagicLink } from '@/lib/api'
import { saveAuth } from '@/lib/auth'

export default function VerifyPage() {
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
        const dest = data.user.company_uuid
          ? `/${data.user.company_uuid}/admin`
          : '/'
        router.replace(dest)
      })
      .catch(() => setStatus('error'))
  }, [params, router])

  if (status === 'error') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h1 className="text-xl font-bold mb-2">Link inválido ou expirado</h1>
        <p className="text-sm text-gray-500 mb-4">
          O link pode ter expirado ou já foi utilizado.
        </p>
        <a href="/" className="text-brand-500 text-sm hover:underline">
          Solicitar novo link
        </a>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-brand-500 border-t-transparent mx-auto" />
        <p className="text-sm text-gray-500">Autenticando…</p>
      </div>
    </main>
  )
}
