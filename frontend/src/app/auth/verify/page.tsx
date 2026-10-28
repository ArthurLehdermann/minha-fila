'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, ShieldCheck, XCircle, ArrowLeft } from 'lucide-react'
import { verifyMagicLink } from '@/lib/api'
import { saveAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'

function VerifyContent() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token') ?? ''
  const email = params.get('email') ?? ''
  const { t } = useI18n()
  const [status, setStatus] = useState<'loading' | 'error'>(() => (token && email ? 'loading' : 'error'))

  useEffect(() => {
    if (!token || !email) return

    verifyMagicLink(token, email)
      .then(({ data }) => {
        saveAuth(data.user)
        router.replace('/filas')
      })
      .catch(() => setStatus('error'))
  }, [token, email, router])

  if (status === 'error') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] p-6 text-[var(--app-fg)]">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-8 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
            <XCircle className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-xl font-black">{t('verify.invalidTitle')}</h1>
          <p className="mb-8 text-sm leading-relaxed text-[var(--text-soft)]">
            {t('verify.invalidText')}
          </p>
          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full rounded-2xl bg-brand-600 px-6 py-3.5 text-sm font-black uppercase tracking-widest text-white transition hover:bg-brand-500"
            >
              {t('verify.requestNew')}
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-bold text-[var(--text-soft)] transition hover:text-[var(--app-fg)]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('verify.backHome')}
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
        <h2 className="text-xl font-black">{t('verify.checking')}</h2>
        <p className="mt-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-soft)]">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {t('verify.connecting')}
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
