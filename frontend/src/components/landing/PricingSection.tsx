'use client'

import Link from 'next/link'
import { loginHref, useLandingLocale, useLandingT } from '@/lib/i18n'

export function PricingSection() {
  const locale = useLandingLocale()
  const t = useLandingT()
  const login = loginHref(locale)

  return (
    <section className="border-t border-[var(--lp-border)] bg-[var(--lp-bg2)] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
          {t('pricing.eyebrow')}
        </p>
        <h2 className="mb-12 text-4xl font-extrabold text-[var(--lp-h)]">{t('pricing.title')}</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-8 py-10">
            <p className="mb-2 text-sm text-[var(--lp-muted)]">{t('pricing.monthly')}</p>
            <p className="text-5xl font-black text-[var(--lp-h)]">
              {t('pricing.monthlyPrice')}
              <span className="text-lg font-normal text-[var(--lp-muted)]">{t('pricing.monthlyPeriod')}</span>
            </p>
            <p className="mt-3 text-sm text-[var(--lp-faint)]">{t('pricing.monthlyNote')}</p>
            <Link
              href={login}
              className="mt-8 block rounded-xl border border-[var(--lp-outline-border)] bg-[var(--lp-outline-bg)] px-6 py-3 text-sm font-bold text-[var(--lp-outline-text)] transition hover:bg-[var(--lp-outline-hover)]"
            >
              {t('pricing.cta')}
            </Link>
          </div>

          <div className="relative rounded-2xl border-2 border-brand-500 bg-[var(--lp-card-warm)] px-8 py-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-4 py-1 text-xs font-black text-white">
              {t('pricing.badge')}
            </div>
            <p className="mb-2 text-sm text-brand-400">{t('pricing.yearly')}</p>
            <p className="text-5xl font-black text-[var(--lp-h)]">
              {t('pricing.yearlyPrice')}
              <span className="text-lg font-normal text-[var(--lp-muted)]">{t('pricing.yearlyPeriod')}</span>
            </p>
            <p className="mt-3 text-sm text-[var(--lp-faint)]">{t('pricing.yearlyNote')}</p>
            <Link
              href={login}
              className="mt-8 block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
            >
              {t('pricing.cta')}
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--lp-faint)]">{t('pricing.trial')}</p>
      </div>
    </section>
  )
}
