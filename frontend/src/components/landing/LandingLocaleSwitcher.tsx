'use client'

import { useRouter } from 'next/navigation'
import {
  APP_LOCALES,
  LOCALE_LABELS,
  landingPath,
  useLandingLocale,
  useLandingT,
  type AppLocale,
} from '@/lib/i18n'
import { writeStoredLocale } from '@/lib/i18n/locales'

interface LandingLocaleSwitcherProps {
  className?: string
}

export function LandingLocaleSwitcher({ className = '' }: LandingLocaleSwitcherProps) {
  const locale = useLandingLocale()
  const t = useLandingT()
  const router = useRouter()

  return (
    <label className={className}>
      <select
        aria-label={t('nav.language')}
        value={locale}
        onChange={(event) => {
          const next = event.target.value as AppLocale
          writeStoredLocale(next)
          router.push(landingPath(next))
        }}
        className="min-h-11 min-w-11 rounded-lg border border-[var(--lp-border)] bg-[var(--lp-card)] px-3 py-2.5 text-sm font-medium text-[var(--lp-h)] outline-none transition focus:border-brand-500 focus-visible:ring-2 focus-visible:ring-brand-500/40"
      >
        {APP_LOCALES.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code]}
          </option>
        ))}
      </select>
    </label>
  )
}
