'use client'

import { useLandingT } from '@/lib/i18n'

export function DiferenciaisSection() {
  const t = useLandingT()
  const diferenciais = [
    { destaque: t('diff.1.title'), descricao: t('diff.1.desc') },
    { destaque: t('diff.2.title'), descricao: t('diff.2.desc') },
    { destaque: t('diff.3.title'), descricao: t('diff.3.desc') },
  ]

  return (
    <section className="border-t border-[var(--lp-border)] bg-[var(--lp-bg1)] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-[var(--lp-h)]">
          {t('diff.title')}
        </h2>

        <div className="grid gap-8 text-center sm:grid-cols-3">
          {diferenciais.map(({ destaque, descricao }) => (
            <div key={destaque}>
              <p className="text-4xl font-black text-brand-400">{destaque}</p>
              <p className="mt-2 text-sm text-[var(--lp-muted)]">{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
