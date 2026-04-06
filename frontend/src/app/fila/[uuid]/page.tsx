'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { StatusBadge } from '@/components/StatusBadge'
import { Bell, Clock, Info, Loader2, Sparkles } from 'lucide-react'

export default function PublicQueuePage() {
  const params = useParams<{ uuid?: string | string[] }>()
  const uuid = Array.isArray(params?.uuid) ? params.uuid[0] : params?.uuid
  const { waiting, preparing, ready, isLoading } = useOrders(uuid ?? '')

  const active = [...ready, ...preparing, ...waiting]

  if (!uuid || isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-cyan-400" />
        <p className="mt-4 text-sm font-bold text-slate-500 uppercase tracking-widest">Carregando Fila...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 pb-20 text-slate-50">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden border-b border-white/5 bg-slate-900/50 px-6 pt-12 pb-8 backdrop-blur-md">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/10 opacity-30 blur-3xl"></div>
        <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400 text-slate-950 font-black">
                    F
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-cyan-200/60">Minha Fila Live</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Status do Pedido</h1>
            <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black text-cyan-300 ring-1 ring-cyan-400/20 uppercase tracking-wider">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400"></span>
                    </span>
                    Live Update
                </div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1">
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
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-cyan-400">
              <Sparkles className="h-4 w-4" />
              Retirada Imediata
            </h2>
            <div className="grid gap-4">
              {ready.map((order) => (
                <div
                  key={order.id}
                  className="relative flex items-center justify-between overflow-hidden rounded-3xl border border-cyan-400/30 bg-slate-900 p-6 shadow-2xl shadow-cyan-900/20"
                >
                  <div className="absolute top-0 right-0 p-2">
                    <Bell className="h-5 w-5 text-cyan-400 animate-bounce" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-slate-500 uppercase tracking-wide">Senha</span>
                    <span className="text-6xl font-black text-white">#{order.number}</span>
                    {order.label && (
                      <p className="mt-1 text-lg font-black text-cyan-400">{order.label}</p>
                    )}
                  </div>
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-cyan-400 text-slate-950 shadow-lg ring-4 ring-cyan-400/20">
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
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500">
              <Clock className="h-4 w-4" />
              Em Preparação
            </h2>
            <div className="grid gap-3">
              {[...preparing, ...waiting].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/50 px-5 py-4 shadow-sm transition-transform active:scale-95 hover:border-white/10"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-white tracking-tighter">#{order.number}</span>
                    {order.label && (
                      <span className="text-sm font-bold text-slate-400 truncate max-w-[120px]">{order.label}</span>
                    )}
                  </div>
                  <StatusBadge status={order.status} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!isLoading && active.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-500">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-slate-700 ring-1 ring-white/5">
              <Info className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-black text-white">Nenhum pedido ativo</h3>
            <p className="mt-2 text-slate-400 font-medium">Aguardando novos pedidos...</p>
          </div>
        )}
      </div>

      {/* Sticky Footer Info */}
      <footer className="fixed bottom-0 left-0 w-full bg-slate-950/80 px-6 py-4 text-center backdrop-blur-md border-t border-white/5">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            Powered by <span className="text-cyan-400">Minha Fila SaaS</span>
        </p>
      </footer>
    </main>
  )
}
