'use client'

import Link from 'next/link'
import { ArrowRight, BadgeCheck, Gauge, QrCode, ShieldCheck, Sparkles } from 'lucide-react'

const highlights = [
  {
    title: 'Entrada por QR Code',
    description: 'Cliente entra na fila em segundos, sem baixar aplicativo.',
    icon: QrCode,
  },
  {
    title: 'Atualização ao vivo',
    description: 'Painel e fila pública sincronizados em tempo real com baixa latência.',
    icon: Gauge,
  },
  {
    title: 'Operação confiável',
    description: 'Fluxo simples para equipe, com histórico e controle por status.',
    icon: ShieldCheck,
  },
]

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-slate-50">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.22),transparent_42%),radial-gradient(circle_at_85%_8%,rgba(124,58,237,0.2),transparent_36%),linear-gradient(to_bottom,#020617,#020617)]" />

      <nav className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-black text-slate-950">
              M
            </span>
            <span className="text-sm font-semibold tracking-wide text-slate-200 sm:text-base">Minha Fila</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 sm:px-4 sm:text-sm">
              Entrar
            </Link>
            <Link
              href="/auth/login"
              className="rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-900 transition hover:opacity-90 sm:px-4 sm:text-sm"
            >
              Testar grátis
            </Link>
          </div>
        </div>
      </nav>

      <main>
        <section className="relative mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:px-8 lg:pb-24">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200 sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              Moderno, fluido e mobile first
            </span>

            <h1 className="mt-5 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Gestão de filas com
              <span className="block bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                experiência premium
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base lg:text-lg">
              Transforme espera em organização. Seu cliente acompanha a posição em tempo real e sua equipe opera com
              um painel rápido, limpo e profissional.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/auth/login"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-6 py-3.5 text-sm font-black text-slate-950 transition hover:bg-cyan-300 sm:w-auto"
              >
                Criar minha fila
                <ArrowRight className="h-4 w-4" />
              </Link>
              <span className="text-xs font-medium text-slate-400 sm:text-sm">Setup em menos de 1 minuto</span>
            </div>
          </div>

          <div className="mt-12 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-cyan-900/20 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {highlights.map(({ title, description, icon: Icon }) => (
                <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 sm:p-5">
                  <div className="mb-3 inline-flex rounded-xl bg-cyan-400/15 p-2 text-cyan-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-sm font-bold text-white sm:text-base">{title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-900/60">
          <div className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-black text-cyan-200 sm:text-3xl">99.9%</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-300">Disponibilidade</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-black text-cyan-200 sm:text-3xl">Tempo real</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-300">Sincronização da fila</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p className="text-2xl font-black text-cyan-200 sm:text-3xl">SEO ready</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-300">Estrutura profissional</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-8 text-xs text-slate-400 sm:px-6 lg:px-8">
        <p>© 2026 Minha Fila</p>
        <p className="inline-flex items-center gap-1">
          <BadgeCheck className="h-3.5 w-3.5" />
          Plataforma de filas digitais
        </p>
      </footer>
    </div>
  )
}
