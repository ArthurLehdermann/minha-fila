'use client'

import Link from 'next/link'
import { loginHref, useLandingLocale, useLandingT } from '@/lib/i18n'

export function HeroSection() {
  const locale = useLandingLocale()
  const t = useLandingT()
  const login = loginHref(locale)

  const mockRows = [
    { pos: 1, nome: t('hero.mockName1'), status: t('hero.mockStatus1'), color: 'text-brand-400' },
    { pos: 2, nome: t('hero.mockName2'), status: t('hero.mockStatus2'), color: 'text-gray-400' },
    { pos: 3, nome: t('hero.mockName3'), status: t('hero.mockStatus3'), color: 'text-gray-400' },
  ]

  return (
    <section className="px-4 py-24 sm:px-6" style={{ background: 'var(--lp-hero-grad)' }}>
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-400">
          {t('hero.badge')}
        </div>

        <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-[var(--lp-h)] lg:text-6xl">
          {t('hero.title1')}
          <br />
          <span className="text-brand-400">{t('hero.title2')}</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-[var(--lp-body)]">
          {t('hero.sub')}
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={login}
            className="w-full rounded-xl bg-brand-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-brand-500 sm:w-auto"
          >
            {t('hero.cta')}
          </Link>
          <a
            href="#como-funciona"
            className="w-full rounded-xl border border-[var(--lp-outline-border)] bg-[var(--lp-outline-bg)] px-8 py-4 text-lg font-medium text-[var(--lp-outline-text)] transition hover:bg-[var(--lp-outline-hover)] sm:w-auto"
          >
            {t('hero.how')}
          </a>
        </div>

        <p className="mt-4 text-sm text-[var(--lp-faint)]">{t('hero.trial')}</p>

        <div className="mx-auto mt-14 max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/60">
          <div className="flex items-center justify-between bg-[#111] px-4 py-2 text-[10px] text-gray-500">
            <span>https://minha-fila.meugarcom.app/</span>
            <span>🔒</span>
          </div>
          <div className="p-4">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brand-400">
              {t('hero.mockLive')}
            </p>
            {mockRows.map(({ pos, nome, status, color }) => (
              <div
                key={pos}
                className="mb-2 flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-600">#{pos}</span>
                  <span className="text-sm font-semibold text-white">{nome}</span>
                </div>
                <span className={`text-xs font-medium ${color}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
