'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Mail, ShieldCheck } from 'lucide-react'
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
      setError('Não conseguimos enviar o link agora. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-50">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.2),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_35%)]" />

        <section className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-2xl backdrop-blur sm:p-8">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-cyan-400/15 text-cyan-200">
            <Mail className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-white">Confira seu e-mail</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Enviamos um link seguro para <strong className="text-white">{email}</strong>. O acesso expira em 15
            minutos.
          </p>

          <div className="mt-7 space-y-3">
            <button
              onClick={() => setSent(false)}
              className="w-full rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300"
            >
              Usar outro e-mail
            </button>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden bg-slate-950 text-slate-50 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.16),transparent_35%),radial-gradient(circle_at_85%_85%,rgba(99,102,241,0.16),transparent_32%)]" />

      <section className="relative hidden px-8 py-14 lg:flex lg:flex-col lg:justify-between xl:px-14">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-400 font-black text-slate-950">
            M
          </span>
          <span className="text-base font-semibold">Minha Fila</span>
        </Link>

        <div className="max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Acesso seguro</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">Painel profissional para operar suas filas.</h1>
          <p className="mt-4 text-slate-300">
            Login sem senha com link e autenticação social. Mais rápido para entrar, mais seguro para gerenciar.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 text-sm text-slate-300">
          <ShieldCheck className="h-4 w-4 text-cyan-200" />
          Sessão protegida e controle por empresa.
        </div>
      </section>

      <section className="relative flex items-center px-4 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur sm:p-8">
          <div className="mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-300 to-violet-400 font-black text-slate-950">
                M
              </span>
              <span className="text-sm font-semibold">Minha Fila</span>
            </Link>
          </div>

          <h2 className="text-2xl font-black text-white">Entrar na plataforma</h2>
          <p className="mt-1 text-sm text-slate-300">Use Google ou receba um link de acesso por e-mail.</p>

          <a
            href={googleRedirectUrl()}
            className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5">
              <path
                fill="#EA4335"
                d="M12 10.2v3.9h5.4c-.2 1.3-1.5 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.7C17.1 3.3 14.8 2.3 12 2.3A9.7 9.7 0 0 0 2.3 12 9.7 9.7 0 0 0 12 21.7c5.6 0 9.3-3.9 9.3-9.4 0-.6-.1-1.1-.2-1.6H12Z"
              />
              <path
                fill="#34A853"
                d="M3.4 7.5 6.6 9.8C7.5 7 9.5 5.8 12 5.8c1.9 0 3.2.8 4 1.5l2.7-2.7C17.1 3.3 14.8 2.3 12 2.3c-3.8 0-7 2.2-8.6 5.2Z"
              />
              <path
                fill="#4A90E2"
                d="M12 21.7c2.7 0 5-1 6.6-2.7l-3-2.4c-.8.6-2 1.1-3.6 1.1-3.9 0-5.1-2.6-5.4-3.9l-3.2 2.5c1.6 3.1 4.8 5.4 8.6 5.4Z"
              />
              <path
                fill="#FBBC05"
                d="M3.4 16.3A9.8 9.8 0 0 1 2.3 12c0-1.5.3-3 .9-4.5l3.4 2.6a6 6 0 0 0 0 3.8l-3.2 2.4Z"
              />
            </svg>
            Entrar com Google
          </a>

          <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-widest text-slate-400">
            <span className="h-px flex-1 bg-white/10" />
            ou com e-mail
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form onSubmit={handleMagicLink} className="space-y-4">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="voce@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
            />

            {error && <p className="text-xs font-semibold text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enviar link'}
            </button>
          </form>

          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-300 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Voltar para o site
          </Link>
        </div>
      </section>
    </main>
  )
}
