'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import QRCode from 'qrcode'
import { useParams } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { useThemePreference } from '@/lib/theme'
import { StatusBadge } from '@/components/StatusBadge'
import { getCompany } from '@/lib/api'
import { Bell, BellRing, Clock, Info, Loader2, Moon, Sparkles, Sun, X } from 'lucide-react'
import type { Company, OrderStatus } from '@/types'

// Play a two-note chime (E5 → C5) — pleasant notification sound
function playReadyChime(ctx: AudioContext) {
  const now = ctx.currentTime
  const notes = [
    { freq: 1319, start: 0, duration: 0.9 },
    { freq: 1047, start: 0.32, duration: 1.1 },
  ]
  notes.forEach(({ freq, start, duration }) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0, now + start)
    gain.gain.linearRampToValueAtTime(0.35, now + start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration)
    osc.start(now + start)
    osc.stop(now + start + duration)
  })
}

// Short confirmation tick played on button click to unlock AudioContext
function playConfirmTick(ctx: AudioContext) {
  const now = ctx.currentTime
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.type = 'sine'
  osc.frequency.value = 880
  gain.gain.setValueAtTime(0.12, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1)
  osc.start(now)
  osc.stop(now + 0.1)
}

async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  const result = await Notification.requestPermission()
  return result === 'granted'
}

// Register the notify service worker once and return its registration
let swRegistrationPromise: Promise<ServiceWorkerRegistration | null> | null = null
function getSwRegistration(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return Promise.resolve(null)
  if (!swRegistrationPromise) {
    swRegistrationPromise = navigator.serviceWorker
      .register('/sw-notify.js')
      .catch(() => null)
  }
  return swRegistrationPromise
}

async function sendNotification(orderId: string, number: number | string, label?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return
  // Prefer SW notification API from page context (mais confiável que postMessage)
  const reg = await getSwRegistration()
  if (reg) {
    reg.showNotification('🔔 Senha chamada:', {
      body: label
        ? `#${number} - ${label}`
        : `#${number}`,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: `order-ready-${orderId}`,
      requireInteraction: true,
    })
  } else {
    // Fallback: direct Notification (no OS sound in some browsers)
    new Notification('🔔 Senha chamada:', {
      body: label
        ? `#${number} - ${label}`
        : `#${number}`,
      icon: '/icon-192.png',
      requireInteraction: true,
    })
  }
}

export default function PublicQueuePage() {
  const params = useParams<{ uuid?: string | string[] }>()
  const uuid = Array.isArray(params?.uuid) ? params.uuid[0] : params?.uuid
  const { orders, waiting, preparing, ready, isLoading, isInactive } = useOrders(uuid ?? '')
  const { resolvedTheme, updatePreference } = useThemePreference()
  const [company, setCompany] = useState<Company | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!uuid) return
    getCompany(uuid).then(setCompany).catch(() => {})
  }, [uuid])

  useEffect(() => {
    if (!uuid) return
    const publicUrl = `https://minha-fila.meugarcom.app/filas/${uuid}`
    const size = 200
    const canvas = document.createElement('canvas')
    QRCode.toCanvas(canvas, publicUrl, { width: size, margin: 1, errorCorrectionLevel: 'H' })
      .then(() => {
        const ctx = canvas.getContext('2d')
        if (!ctx) { setQrDataUrl(canvas.toDataURL()); return }
        const logo = new window.Image()
        logo.crossOrigin = 'anonymous'
        logo.src = '/logo.png'
        logo.onload = () => {
          const logoSize = Math.round(size * 0.22)
          const x = Math.round((size - logoSize) / 2)
          const y = Math.round((size - logoSize) / 2)
          const pad = 5
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          try {
            ctx.roundRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2, 8)
          } catch {
            ctx.rect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2)
          }
          ctx.fill()
          ctx.drawImage(logo, x, y, logoSize, logoSize)
          setQrDataUrl(canvas.toDataURL())
        }
        logo.onerror = () => setQrDataUrl(canvas.toDataURL())
      })
      .catch(() => {})
  }, [uuid])

  const active = [...ready, ...preparing, ...waiting]
  const isDark = resolvedTheme === 'dark'

  // Track which orders the user wants to be notified about
  const [watchedIds, setWatchedIds] = useState<Set<string>>(new Set())

  // In-page alert banner
  const [alert, setAlert] = useState<{ number: number | string; label?: string } | null>(null)

  // AudioContext kept alive across renders so it stays unlocked after user gesture
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioUnlockedRef = useRef(false)

  function getAudioCtx(): AudioContext | null {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext()
      return audioCtxRef.current
    } catch { return null }
  }

  // Track previous statuses to detect transitions → ready
  const prevStatusRef = useRef<Map<string, OrderStatus>>(new Map())
  const originalTitleRef = useRef<string>('')
  const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const originalFaviconsRef = useRef<Array<{ element: HTMLLinkElement; href: string }>>([])
  const createdAttentionFaviconRef = useRef<HTMLLinkElement | null>(null)

  function getAlertFavicon() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#dc2626"/><circle cx="32" cy="32" r="18" fill="#fff"/><circle cx="32" cy="32" r="10" fill="#dc2626"/></svg>`
    return `data:image/svg+xml,${encodeURIComponent(svg)}`
  }

  function captureOriginalFavicons() {
    if (originalFaviconsRef.current.length > 0) return
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']"))
    originalFaviconsRef.current = links.map((element) => ({ element, href: element.href }))
  }

  function setAttentionFavicon(href: string) {
    const links = Array.from(document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']"))
    if (links.length === 0) {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.href = href
      document.head.appendChild(link)
      createdAttentionFaviconRef.current = link
      return
    }
    links.forEach((link) => {
      link.href = href
    })
  }

  function startAttention(orderNumber: number | string) {
    if (!originalTitleRef.current) originalTitleRef.current = document.title
    captureOriginalFavicons()
    if (!blinkIntervalRef.current) {
      let highlighted = false
      blinkIntervalRef.current = setInterval(() => {
        highlighted = !highlighted
        document.title = highlighted
          ? `🔔 Senha #${orderNumber} chamada!`
          : (originalTitleRef.current || 'Minha Fila')
        if (highlighted) {
          setAttentionFavicon(getAlertFavicon())
          return
        }
        restoreOriginalFavicons()
      }, 1000)
    }
  }

  function restoreOriginalFavicons() {
    originalFaviconsRef.current.forEach(({ element, href }) => {
      element.href = href
    })
    if (createdAttentionFaviconRef.current) {
      createdAttentionFaviconRef.current.remove()
      createdAttentionFaviconRef.current = null
    }
  }

  function stopAttention() {
    if (blinkIntervalRef.current) {
      clearInterval(blinkIntervalRef.current)
      blinkIntervalRef.current = null
    }
    if (originalTitleRef.current) document.title = originalTitleRef.current
    restoreOriginalFavicons()
  }

  async function playReadySound() {
    const ctx = getAudioCtx()
    if (!ctx) return
    try {
      if (ctx.state === 'suspended') await ctx.resume()
      playReadyChime(ctx)
    } catch {
      // noop: browsers podem bloquear áudio sem gesto prévio
    }
  }

  useEffect(() => {
    const unlockAudio = async () => {
      if (audioUnlockedRef.current) return
      const ctx = getAudioCtx()
      if (!ctx) return
      try {
        if (ctx.state === 'suspended') await ctx.resume()
        audioUnlockedRef.current = true
      } catch {
        // noop
      }
    }
    window.addEventListener('pointerdown', unlockAudio, { passive: true })
    window.addEventListener('keydown', unlockAudio)
    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible') stopAttention()
    }
    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
    }
  }, [])

  useEffect(() => () => stopAttention(), [])

  useEffect(() => {
    for (const order of orders) {
      const prev = prevStatusRef.current.get(order.id)
      if (prev && prev !== order.status && watchedIds.has(order.id)) {
        // Som em qualquer movimentação de status
        playReadySound()

        if (order.status === 'ready') {
          // Notificação + title só quando vira "pronto"
          sendNotification(order.id, order.number, order.label ?? undefined)
          startAttention(order.number)
          setAlert({ number: order.number, label: order.label ?? undefined })
          setWatchedIds((prev) => { const next = new Set(prev); next.delete(order.id); return next })
        }
      }
      prevStatusRef.current.set(order.id, order.status)
    }
  }, [orders, watchedIds])

  async function handleWatch(orderId: string) {
    // Play tick immediately on user gesture → unlocks AudioContext for future playback
    const ctx = getAudioCtx()
    if (ctx) {
      try {
        if (ctx.state === 'suspended') await ctx.resume()
        playConfirmTick(ctx)
        audioUnlockedRef.current = true
      } catch {
        // noop
      }
    }

    await requestNotificationPermission()
    // Eagerly register SW so it's ready when the order is called
    getSwRegistration()
    setWatchedIds((prev) => new Set(prev).add(orderId))
  }

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
      {/* In-page alert banner */}
      {alert && (
        <div className="fixed inset-x-0 top-4 z-[9999] flex justify-center px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className={`flex items-center gap-4 rounded-2xl border px-5 py-4 shadow-2xl max-w-sm w-full ${
            isDark
              ? 'border-brand-500/30 bg-[#111] shadow-black/40'
              : 'border-brand-400/40 bg-white shadow-black/10'
          }`}>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black">Senha chamada:</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                #{alert.number}{alert.label ? ` — ${alert.label}` : ''}
              </p>
            </div>
            <button
              onClick={() => {
                setAlert(null)
                stopAttention()
              }}
              className={`rounded-lg p-1 transition ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-700'}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        className={`relative overflow-hidden border-b px-6 pt-6 pb-5 backdrop-blur-md ${
          isDark ? 'border-white/5 bg-[#111]/50' : 'border-slate-200 bg-white/80'
        }`}
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-brand-500/10 opacity-30 blur-3xl" />
        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-start justify-between mb-4 gap-4">
            {/* Left: logo + title + status */}
            <div className="flex-1 min-w-0">
              <div className="mb-3">
                <Image
                  src="https://minhafila.meugarcom.app/_next/image?url=%2Flogo.png&w=128&q=75"
                  alt="Minha Fila"
                  width={120}
                  height={120}
                  className="h-[120px] w-[120px] rounded-xl object-contain"
                  unoptimized
                />
              </div>
              <h1 className={`text-3xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Situação da Senha
              </h1>
              <div className="mt-4 flex items-center gap-3">
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

            {/* Right: QR Code */}
            {qrDataUrl && (
              <div className={`shrink-0 rounded-2xl border p-2 ${isDark ? 'border-white/10 bg-white' : 'border-slate-200 bg-white'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="QR Code da fila"
                  width={160}
                  height={160}
                  className="h-[160px] w-[160px] rounded-lg"
                />
                <p className="mt-1.5 text-center text-[9px] font-black uppercase tracking-wider text-slate-500">
                  Escaneie para acompanhar
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* Prontos — High Priority Section */}
        {ready.length > 0 && (
          <section className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-brand-500">
              <Sparkles className="h-4 w-4" />
              {company?.label_ready ?? 'Prontos para Retirada'}
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg ring-4 ring-brand-500/20">
                    <span className="text-xs font-black text-center leading-tight uppercase">Concluído</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Em Atendimento / Na Espera */}
        {(preparing.length > 0 || waiting.length > 0) && (
          <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <h2 className={`mb-4 flex items-center gap-2 text-xs font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
              <Clock className="h-4 w-4" />
              {company?.label_preparing ?? 'Em Atendimento'}
            </h2>
            <div className="grid gap-3">
              {[...preparing, ...waiting].map((order) => {
                const isWatched = watchedIds.has(order.id)
                const canWatch = order.status === 'preparing' || order.status === 'waiting'
                return (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between rounded-2xl border px-5 py-4 shadow-sm ${
                      isDark
                        ? 'border-white/5 bg-[#111]/50'
                        : 'border-slate-200 bg-white'
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
                    <div className="flex items-center gap-2">
                      {canWatch && (
                        isWatched ? (
                          <span className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider ${
                            isDark ? 'bg-brand-600/15 text-brand-400' : 'bg-brand-50 text-brand-600'
                          }`}>
                            <BellRing className="h-3 w-3" />
                            Avisando
                          </span>
                        ) : (
                          <button
                            onClick={() => handleWatch(order.id)}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition ${
                              isDark
                                ? 'border-white/10 bg-white/5 text-slate-400 hover:border-brand-500/40 hover:bg-brand-600/10 hover:text-brand-400'
                                : 'border-slate-200 bg-white text-slate-500 hover:border-brand-400/40 hover:bg-brand-50 hover:text-brand-600'
                            }`}
                          >
                            <Bell className="h-3 w-3" />
                            Me avisar
                          </button>
                        )
                      )}
                      <StatusBadge status={order.status} theme={resolvedTheme} />
                    </div>
                  </div>
                )
              })}
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
            <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Nenhuma senha ativa</h3>
            <p className={`mt-2 font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Aguardando novas chamadas...</p>
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
          Powered by <a href="https://minha-fila.meugarcom.app" className="text-brand-500" target="_blank">Minha Fila</a>
        </p>
      </footer>
    </main>
  )
}
