'use client'

import { useLandingT } from '@/lib/i18n'

export function DorSection() {
  const t = useLandingT()
  const dores = [
    { emoji: '😤', texto: t('dor.1') },
    { emoji: '😵', texto: t('dor.2') },
    { emoji: '😠', texto: t('dor.3') },
    { emoji: '📢', texto: t('dor.4') },
  ]

  return (
    <section className="border-t border-[var(--lp-border)] bg-[var(--lp-bg1)] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brand-500">
          {t('dor.eyebrow')}
        </p>
        <h2 className="mb-12 text-center text-4xl font-extrabold text-[var(--lp-h)]">{t('dor.title')}</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {dores.map(({ emoji, texto }) => (
            <div
              key={texto}
              className="flex items-start gap-4 rounded-xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-6 py-5"
            >
              <span className="text-2xl">{emoji}</span>
              <p className="text-sm leading-relaxed text-[var(--lp-body)]">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
