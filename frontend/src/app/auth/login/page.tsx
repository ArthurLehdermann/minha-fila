'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail, Chrome } from 'lucide-react'
import { sendMagicLink, googleRedirectUrl } from '@/lib/api'
import { isAuthenticated } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace('/fila')
    }
  }, [router])

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await sendMagicLink(email)
      setSent(true)
    } catch {
      setError('Erro ao enviar o link. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center p-6 overflow-hidden">
        <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-50 via-transparent to-transparent opacity-60"></div>
        
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl text-center border border-gray-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-brand-50 text-brand-500">
            <Mail className="h-10 w-10" />
          </div>
          <h1 className="mb-2 text-2xl font-black text-gray-900">Verifique seu e-mail</h1>
          <p className="text-gray-500 leading-relaxed">
            Enviamos um link de acesso seguro para <br />
            <strong className="text-gray-900 font-bold">{email}</strong>.
            <br />O link expira em 15 minutos.
          </p>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={() => setSent(false)}
              className="w-full rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg hover:bg-black transition-all"
            >
              Tentar outro e-mail
            </button>
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
      
      <div className="w-full max-w-md">
        <div className="mb-12 text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-8">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white font-bold text-2xl shadow-lg ring-4 ring-brand-50">
                M
                </div>
                <span className="text-2xl font-black tracking-tight text-gray-900">Minha Fila</span>
            </Link>
            <h1 className="text-3xl font-black text-gray-900">Bem-vindo de volta!</h1>
            <p className="mt-2 text-gray-500 font-medium">Entre para gerenciar suas filas</p>
        </div>

        <div className="rounded-3xl bg-white p-8 shadow-2xl border border-gray-100">
          {/* Google OAuth */}
          <a
            href={googleRedirectUrl()}
            className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm active:scale-95"
          >
            <Chrome className="h-5 w-5 text-[#4285F4]" />
            Entrar com Google
          </a>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase tracking-widest">
              <span className="bg-white px-4 text-gray-400">ou via e-mail</span>
            </div>
          </div>

          {/* Magic Link */}
          <form onSubmit={handleMagicLink} className="space-y-4">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide px-1">E-mail Corporativo</label>
                <input
                type="email"
                required
                placeholder="seu@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border-0 bg-gray-50 px-6 py-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm font-medium"
                />
            </div>
            {error && <p className="px-1 text-xs font-bold text-red-500">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-500 px-6 py-4 text-sm font-black text-white shadow-xl hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50 transition-all active:scale-95"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Enviar Link de Acesso
                </>
              )}
            </button>
          </form>
          
          <p className="mt-8 text-center text-xs text-gray-400 font-medium leading-relaxed">
            Ao entrar, você concorda com nossos <br />
            <Link href="#" className="text-gray-600 hover:underline">Termos de Uso</Link> e <Link href="#" className="text-gray-600 hover:underline">Privacidade</Link>
          </p>
        </div>

        <div className="mt-8 text-center">
            <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-brand-500 transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Voltar para o site
            </Link>
        </div>
      </div>
    </main>
  )
}
