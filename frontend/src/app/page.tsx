'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle, Clock, Smartphone, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold text-xl shadow-lg">
              M
            </div>
            <span className="text-xl font-bold tracking-tight">Minha Fila</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-sm font-semibold text-gray-600 hover:text-brand-500 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-brand-600 transition-all hover:scale-105 active:scale-95"
            >
              Criar Fila Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center pt-32 pb-16 lg:pt-48 lg:pb-32">
        <div className="absolute top-0 -z-10 h-full w-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-100 via-transparent to-transparent opacity-60"></div>
        
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="mb-6 inline-flex items-center rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-600 ring-1 ring-brand-200">
            <Zap className="mr-2 h-3.5 w-3.5" />
            O SaaS de filas mais rápido para o seu negócio
          </div>
          
          <h1 className="mb-6 text-5xl font-black tracking-tight text-gray-900 sm:text-7xl">
            Sua fila <br />
            <span className="heading-gradient">digital e sem estresse</span>
          </h1>
          
          <p className="mb-10 text-lg leading-8 text-gray-600 lg:text-xl">
            Dê adeus às aglomerações e filas manuais. Ofereça uma experiência premium aos seus clientes com acompanhamento em tempo real via QR Code.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/login"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-8 py-4 text-lg font-bold text-white shadow-xl hover:bg-black transition-all sm:w-auto hover:shadow-brand-300/50"
            >
              Começar Agora
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <div className="text-sm font-medium text-gray-500">
              Gratuito para pequenos negócios • Setup em 1 minuto
            </div>
          </div>
        </div>
        
        {/* Abstract Preview Placeholder */}
        <div className="mt-16 mx-auto max-w-5xl px-6 lg:px-8">
          <div className="rounded-3xl border border-gray-200 bg-white p-2 shadow-2xl overflow-hidden group">
            <div className="aspect-[16/9] w-full rounded-2xl bg-gray-50 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-brand-100/30 to-brand-50/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="flex flex-col items-center gap-4 text-gray-400">
                  <Smartphone className="h-16 w-16" />
                  <span className="text-sm font-medium uppercase tracking-widest">Interface de Gestão em Tempo Real</span>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-gray-50/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-brand-600">Performance</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Tudo o que você precisa para dominar sua audiência
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand-200 shadow-lg">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  QR Code Inteligente
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-none">Seus clientes escaneiam e entram na fila instantaneamente. Sem baixar app.</p>
                </dd>
              </div>

              <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand-200 shadow-lg">
                    <Clock className="h-6 w-6" />
                  </div>
                  Real-time Update
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-none">Notificações automáticas e atualização da posição na fila via WebSockets.</p>
                </dd>
              </div>

              <div className="flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-200 hover:shadow-lg transition-shadow">
                <dt className="flex items-center gap-x-3 text-lg font-bold leading-7 text-gray-900">
                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-brand-200 shadow-lg">
                    <Zap className="h-6 w-6" />
                  </div>
                  Dashboard Simples
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-none">Foque no atendimento. Nós cuidamos da organização e dos dados para você.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 shadow-2xl rounded-3xl sm:px-24 xl:py-32">
            <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto para profissionalizar seu atendimento?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-8 text-gray-300">
              Junte-se a centenas de negócios que já transformaram a espera em uma experiência positiva.
            </p>
            <div className="mt-10 flex justify-center gap-x-6">
              <Link
                href="/auth/login"
                className="rounded-2xl bg-white px-8 py-4 text-lg font-bold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
              >
                Criar Minha Primeira Fila
              </Link>
            </div>
            
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#8d958581-43e2-453e-919e-5ec7042c09d8)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="8d958581-43e2-453e-919e-5ec7042c09d8">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-gray-100 bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-gray-500">
          <p>© 2026 Minha Fila by Meu Garçom. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
