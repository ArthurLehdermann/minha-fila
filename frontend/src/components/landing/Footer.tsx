'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LegalModal } from '@/components/LegalModal'
import { Privacidade } from '@/content/Privacidade'
import { Termos } from '@/content/Termos'
import { LandingLocaleSwitcher } from './LandingLocaleSwitcher'
import { loginHref, useLandingLocale, useLandingT } from '@/lib/i18n'

export function Footer() {
  const locale = useLandingLocale()
  const t = useLandingT()
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
          <p>{t('footer.copy')}</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <LandingLocaleSwitcher />
            <button
              onClick={() => setPrivacyOpen(true)}
              className="transition hover:text-[var(--lp-body)]"
            >
              {t('footer.privacy')}
            </button>
            <button
              onClick={() => setTermsOpen(true)}
              className="transition hover:text-[var(--lp-body)]"
            >
              {t('footer.terms')}
            </button>
            <Link href={loginHref(locale)} className="transition hover:text-[var(--lp-body)]">
              {t('footer.login')}
            </Link>
          </div>
        </div>
      </footer>

      <LegalModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title={t('footer.privacyTitle')}
        subtitle={t('footer.legalUpdated')}
        closeLabel={t('footer.close')}
        footerLink={
          <button
            onClick={() => { setPrivacyOpen(false); setTermsOpen(true) }}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            {t('footer.terms')}
          </button>
        }
      >
        <Privacidade locale={locale} />
      </LegalModal>

      <LegalModal
        open={termsOpen}
        onClose={() => setTermsOpen(false)}
        title={t('footer.termsTitle')}
        subtitle={t('footer.legalUpdated')}
        closeLabel={t('footer.close')}
        footerLink={
          <button
            onClick={() => { setTermsOpen(false); setPrivacyOpen(true) }}
            className="text-brand-400 hover:text-brand-300 transition-colors"
          >
            {t('footer.privacy')}
          </button>
        }
      >
        <Termos locale={locale} />
      </LegalModal>
    </>
  )
}
