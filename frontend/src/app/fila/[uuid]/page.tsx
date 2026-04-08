'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { useThemePreference } from '@/lib/theme'
import { StatusBadge } from '@/components/StatusBadge'
import { Bell, Clock, Info, Loader2, Moon, Sparkles, Sun } from 'lucide-react'

export default function PublicQueuePage() {
  const params = useParams<{ uuid?: string | string[] }>()
  const uuid = Array.isArray(params?.uuid) ? params.uuid[0] : params?.uuid
  const { waiting, preparing, ready, isLoading, isInactive } = useOrders(uuid ?? '')
  const { resolvedTheme, preference, updatePreference } = useThemePreference()

  const active = [...ready, ...preparing, ...waiting]
  const isDark = resolvedTheme === 'dark'

  function toggleTheme() {
    updatePreference(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  if (!uuid || isLoading) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
        <Loader2 className={`h-10 w-10 animate-spin ${isDark ? 'text-brand-500' : 'text-brand-600'}`} />
        <p className={`mt-4 text-sm font-bold uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Carregando Fila...</p>
      </div>
    )
  }

  if (isInactive) {
    return (
      <div className={`flex min-h-screen flex-col items-center justify-center px-4 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'}`}>
        <div className={`w-full max-w-md rounded-3xl border p-10 text-center ${isDark ? 'border-white/10 bg-[#111]' : 'border-slate-200 bg-white shadow-sm'}`}>
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-500/15 text-yellow-400">
            <span className="text-3xl">⏸</span>
          </div>
          <h1 className="text-2xl font-black">Fila pausada</h1>
          <p className={`mt-3 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Esta fila está temporariamente inativa. Volte mais tarde.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className={`min-h-screen pb-20 ${isDark ? 'bg-slate-950 text-slate-50' : 'bg-slate-100 text-slate-900'}`}>
      {/* Header */}
      <div
        className={`relative overflow-hidden border-b px-6 pt-12 pb-8 backdrop-blur-md ${
          isDark ? 'border-white/5 bg-[#111]/50' : 'border-slate-200 bg-white/80'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-500/10 opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-slate-950 font-black">
                F
              </div>
              <span className="text-sm font-black uppercase tracking-widest text-brand-300/60">Minha Fila Live</span>
            </div>
            <button
              onClick={toggleTheme}
              className={`rounded-xl border p-2 transition ${
                isDark
                  ? 'border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
              aria-label="Alternar tema"
              title={isDark ? 'Mudar para claro' : 'Mudar para escuro'}
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
          <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Status do Pedido
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full bg-brand-600/10 px-3 py-1 text-[10px] font-black text-brand-400 ring-1 ring-brand-500/20 uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-600 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-600" />
              </span>
              Live Update
            </div>
            <p className={`text-[10px] uppercase font-black tracking-widest flex items-center gap-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock className="h-3 w-3" />
              Atualizado agora
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Prontos — High Priority Section */}
        {ready.length > 0 && (
          <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-500">
              <Sparkles className="h-4 w-4" />
              Retirada Imediata
            </h2>
            <div className="grid gap-4">
              {ready.map((order) => (
                <div
                  key={order.id}
                  className={`relative flex items-center justify-between overflow-hidden rounded-3xl border border-brand-500/30 p-6 shadow-2xl ${
                    isDark ? 'bg-[#111] shadow-black/20' : 'bg-white shadow-black/5'
                  }`}
                >
                  <div className="absolute top-0 right-0 p-2">
                    <Bell className="h-5 w-5 text-brand-500 animate-bounce" />
                  </div>
                  <div>
                    <span className={`block text-xs font-bold uppercase tracking-wide ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Senha</span>
                    <span className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>#{order.number}</span>
                    {order.label && (
                      <p className="mt-1 text-lg font-black text-brand-500">{order.label}</p>
                    )}
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600 text-slate-950 shadow-lg ring-4 ring-brand-500/20">
                    <span className="text-xs font-black text-center leading-tight uppercase">Pronto!</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Fila Geral */}
        {(preparing.length > 0 || waiting.length > 0) && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className={`mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock className="h-4 w-4" />
              Em Preparação
            </h2>
            <div className="grid gap-3">
              {[...preparing, ...waiting].map((order) => (
                <div
                  key={order.id}
                  className={`flex items-center justify-between rounded-2xl border px-5 py-4 shadow-sm transition-transform active:scale-95 ${
                    isDark
                      ? 'border-white/5 bg-[#111]/50 hover:border-white/10'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      #{order.number}
                    </span>
                    {order.label && (
                      <span className={`text-sm font-bold truncate max-w-[120px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {order.label}
                      </span>
                    )}
                  </div>
                  <StatusBadge status={order.status} theme={resolvedTheme} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && active.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
            <div
              className={`mb-6 flex h-24 w-24 items-center justify-center rounded-full ring-1 ${
                isDark ? 'bg-[#111] text-slate-700 ring-white/5' : 'bg-white text-slate-300 ring-slate-200'
              }`}
            >
              <Info className="h-12 w-12" />
            </div>
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Nenhum pedido ativo</h3>
            <p className={`mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aguardando novos pedidos...</p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <footer
        className={`fixed bottom-0 left-0 w-full px-6 py-4 text-center backdrop-blur-md border-t ${
          isDark ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200'
        }`}
      >
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          Powered by <span className="text-brand-500">Minha Fila SaaS</span>
        </p>
      </footer>
    </main>
  )
}
