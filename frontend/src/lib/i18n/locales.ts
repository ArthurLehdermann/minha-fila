export type AppLocale = 'pt_BR' | 'en' | 'es'

export const APP_LOCALES: AppLocale[] = ['pt_BR', 'en', 'es']

export const DEFAULT_LOCALE: AppLocale = 'pt_BR'

export const LOCALE_STORAGE_KEY = 'minha_fila_locale'

export const LOCALE_LABELS: Record<AppLocale, string> = {
  pt_BR: 'Português',
  en: 'English',
  es: 'Español',
}

/** BCP 47 para Intl / HTML lang (pt_BR → pt-BR). */
export function toBcp47(locale: AppLocale): string {
  return locale.replace('_', '-')
}

export function normalizeLocale(value: unknown): AppLocale | null {
  if (typeof value !== 'string' || !value.trim()) return null
  const normalized = value.trim().replace('-', '_')
  const exact = APP_LOCALES.find((locale) => locale.toLowerCase() === normalized.toLowerCase())
  if (exact) return exact
  const prefix = normalized.split('_')[0].toLowerCase()
  if (prefix === 'pt') return 'pt_BR'
  if (prefix === 'en') return 'en'
  if (prefix === 'es') return 'es'
  return null
}

export function detectBrowserLocale(): AppLocale {
  if (typeof navigator === 'undefined') return DEFAULT_LOCALE
  const candidates = [navigator.language, ...(navigator.languages ?? [])]
  for (const candidate of candidates) {
    const locale = normalizeLocale(candidate)
    if (locale) return locale
  }
  return DEFAULT_LOCALE
}

export function readStoredLocale(): AppLocale | null {
  if (typeof window === 'undefined') return null
  try {
    return normalizeLocale(localStorage.getItem(LOCALE_STORAGE_KEY))
  } catch {
    return null
  }
}

export function writeStoredLocale(locale: AppLocale) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  } catch {
    /* noop */
  }
  try {
    document.cookie = `preferred_locale=${locale};path=/;max-age=31536000;samesite=lax`
  } catch {
    /* noop */
  }
}

/**
 * Painel / login: storage → (opcional) user.locale → navegador → pt_BR.
 * Fila pública: só navegador (deviceOnly).
 */
export function resolveInitialLocale(options?: {
  userLocale?: string | null
  deviceOnly?: boolean
}): AppLocale {
  if (options?.deviceOnly) {
    return detectBrowserLocale()
  }
  return (
    readStoredLocale() ??
    normalizeLocale(options?.userLocale) ??
    detectBrowserLocale()
  )
}
