'use client'

import React from 'react'
import { useOrders } from '@/hooks/useOrders'
import { StatusBadge } from '@/components/StatusBadge'
import { Bell, Clock, Info, Loader2, Sparkles } from 'lucide-react'

export default function PublicQueuePage({ params }: { params: { uuid: string } }) {
  const { uuid } = params
  const { waiting, preparing, ready, isLoading } = useOrders(uuid)

  const active = [...ready, ...preparing, ...waiting]

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-brand-500" />
        <p className="mt-4 text-sm font-bold text-gray-400 uppercase tracking-widest">Carregando Fila...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50/30 pb-20">
      {/* Dynamic Header */}
      <div className="relative overflow-hidden bg-white px-6 pt-12 pb-8 shadow-sm">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-50 opacity-50 blur-3xl"></div>
        <div className="relative mx-auto max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white font-bold">
                    M
                </div>
                <span className="text-sm font-black uppercase tracking-widest text-gray-400">Minha Fila Live</span>
            </div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Status do Pedido</h1>
            <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600 ring-1 ring-green-100">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                    Live Update
                </div>
                <p className="text-xs font-medium text-gray-400 flex items-center gap-1">
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
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-brand-600">
              <Sparkles className="h-4 w-4" />
              Retirada Imediata
            </h2>
            <div className="grid gap-4">
              {ready.map((order) => (
                <div
                  key={order.id}
                  className="relative flex items-center justify-between overflow-hidden rounded-3xl border-2 border-brand-500 bg-white p-6 shadow-xl shadow-brand-100/50"
                >
                  <div className="absolute top-0 right-0 p-2">
                    <Bell className="h-5 w-5 text-brand-500 animate-bounce" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-gray-400 uppercase tracking-wide">Senha</span>
                    <span className="text-6xl font-black text-gray-900">#{order.number}</span>
                    {order.label && (
                      <p className="mt-1 text-lg font-bold text-brand-600">{order.label}</p>
                    )}
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg">
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
            <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-gray-400">
              <Clock className="h-4 w-4" />
              Em Preparação
            </h2>
            <div className="grid gap-3">
              {[...preparing, ...waiting].map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm transition-transform active:scale-95"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-gray-900 tracking-tighter">#{order.number}</span>
                    {order.label && (
                      <span className="text-sm font-bold text-gray-500 truncate max-w-[120px]">{order.label}</span>
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
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-300">
              <Info className="h-12 w-12" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Nenhum pedido ativo</h3>
            <p className="mt-2 text-gray-500 font-medium">Aguardando novos pedidos...</p>
          </div>
        )}
      </div>

      {/* Sticky Footer Info */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 px-6 py-4 text-center backdrop-blur-md border-t border-gray-100">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            Powered by <span className="text-brand-500">Minha Fila SaaS</span>
        </p>
      </footer>
    </main>
  )
}
