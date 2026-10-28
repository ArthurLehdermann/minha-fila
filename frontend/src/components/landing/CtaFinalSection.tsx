'use client'

import Link from 'next/link'
import { loginHref, useLandingLocale, useLandingT } from '@/lib/i18n'

export function CtaFinalSection() {
  const locale = useLandingLocale()
  const t = useLandingT()

  return (
    <section
      className="border-t border-[var(--lp-cta-border)] px-4 py-24 text-center sm:px-6"
      style={{ background: 'var(--lp-cta-grad)' }}
    >
      <h2 className="mb-4 text-4xl font-black leading-tight tracking-tight text-[var(--lp-h)] lg:text-5xl">
        {t('cta.title1')}
        <br />
        <span className="text-brand-400">{t('cta.title2')}</span>
      </h2>
      <p className="mx-auto mb-10 max-w-md text-lg text-[var(--lp-muted)]">
        {t('cta.sub')}
      </p>
      <Link
        href={loginHref(locale)}
        className="inline-block rounded-2xl bg-brand-600 px-10 py-5 text-xl font-black text-white transition hover:bg-brand-500"
      >
        {t('cta.button')}
      </Link>
    </section>
  )
}
