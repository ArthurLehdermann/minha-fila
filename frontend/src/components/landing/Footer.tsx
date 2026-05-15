'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LegalModal } from '@/components/LegalModal'
import { Privacidade } from '@/content/Privacidade'
import { Termos } from '@/content/Termos'

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)

  useEffect(() => {
    const openPrivacy = () => setPrivacyOpen(true)
    const openTerms = () => setTermsOpen(true)
    window.addEventListener('minhafila:open-privacy', openPrivacy)
    window.addEventListener('minhafila:open-terms', openTerms)
    return () => {
      window.removeEventListener('minhafila:open-privacy', openPrivacy)
      window.removeEventListener('minhafila:open-terms', openTerms)
    }
  }, [])

  return (
    <>
      <footer className="border-t border-[var(--lp-border)] bg-[var(--lp-bg1)] px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 text-xs text-[var(--lp-faint)]">
          <p>© 2026 Minha Fila · Fila virtual para qualquer operação</p>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="transition hover:text-[var(--lp-body)]"
            >
              Privacidade
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="transition hover:text-[var(--lp-body)]"
            >
              Termos de Uso
            </button>
            <Link href="/auth/login" className="transition hover:text-[var(--lp-body)]">
              Entrar
            </Link>
          </div>
        </div>
      </footer>

      <LegalModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Política de Privacidade"
        subtitle="Última atualização: maio de 2026"
        footerLink={
          <button
            onClick={() => { setPrivacyOpen(false); setTermsOpen(true) }}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            Termos de Uso
          </button>
        }
      >
        <Privacidade />
      </LegalModal>

      <LegalModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Termos de Uso"
        subtitle="Última atualização: maio de 2026"
        footerLink={
          <button
            onClick={() => { setTermsOpen(false); setPrivacyOpen(true) }}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            Política de Privacidade
          </button>
        }
      >
        <Termos />
      </LegalModal>
    </>
  )
}
