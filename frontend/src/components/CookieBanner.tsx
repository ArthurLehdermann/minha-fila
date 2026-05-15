'use client'

import { useEffect, useState } from 'react'

const CONSENT_KEY = 'meugarcom_cookie_consent'

export type CookieConsent = 'essential' | 'all'

export function getCookieConsent(): CookieConsent | null {
  try {
    return localStorage.getItem(CONSENT_KEY) as CookieConsent | null
  } catch {
    return null
  }
}

function fireConsentEvent(level: CookieConsent) {
  window.dispatchEvent(new CustomEvent('meugarcom:cookie-consent', { detail: { level } }))
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const stored = getCookieConsent()
    if (!stored) {
      setVisible(true)
    } else {
      fireConsentEvent(stored)
    }
  }, [])

  function accept(level: CookieConsent) {
    try { localStorage.setItem(CONSENT_KEY, level) } catch { /* noop */ }
    setVisible(false)
    fireConsentEvent(level)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#0d0d0d] shadow-2xl"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">Sua privacidade importa</p>
          <p className="mt-1 text-sm text-gray-400">
            Usamos cookies essenciais para o funcionamento da plataforma e, com seu consentimento,
            cookies analíticos do <strong className="text-gray-300">Google Analytics</strong> para
            entender como os visitantes utilizam o serviço.{' '}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('minhafila:open-privacy'))}
              className="underline text-brand-400 hover:text-brand-300 whitespace-nowrap"
            >
              Política de Privacidade
            </button>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button
            onClick={() => accept('essential')}
            className="rounded-xl border border-white/20 bg-transparent px-4 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 transition-colors"
          >
            Apenas essenciais
          </button>
          <button
            onClick={() => accept('all')}
            className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500 transition-colors"
          >
            Aceitar tudo
          </button>
        </div>
      </div>
    </div>
  )
}
