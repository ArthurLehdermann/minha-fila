'use client'

import { APP_LOCALES, LOCALE_LABELS, useI18n, type AppLocale } from '@/lib/i18n'

interface LocaleSelectorProps {
  className?: string
  /** Só atualiza UI/localStorage; não chama a API (ex.: tela de login). */
  localOnly?: boolean
  compact?: boolean
}

export function LocaleSelector({ className = '', localOnly = false, compact = false }: LocaleSelectorProps) {
  const { locale, setLocale, t } = useI18n()

  return (
    <label className={`block ${className}`}>
      {!compact && (
        <span className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.15em] text-[var(--text-soft)]">
          {t('common.language')}
        </span>
      )}
      <select
        aria-label={t('common.language')}
        value={locale}
        onChange={(event) => {
          void setLocale(event.target.value as AppLocale, { persist: !localOnly })
        }}
        className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--surface-solid)] px-2 py-1.5 text-[11px] text-[var(--menu-button-text)] outline-none transition focus:border-brand-500/40"
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
