'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { translate } from './dictionaries'
import {
  DEFAULT_LOCALE,
  detectBrowserLocale,
  normalizeLocale,
  readStoredLocale,
  resolveInitialLocale,
  toBcp47,
  writeStoredLocale,
  type AppLocale,
} from './locales'
import { getUser, updateStoredUserLocale } from '@/lib/auth'
import { updateUserLocale } from '@/lib/api'

type I18nContextValue = {
  locale: AppLocale
  bcp47: string
  t: (key: string, params?: Record<string, string | number>) => string
  setLocale: (locale: AppLocale, options?: { persist?: boolean }) => Promise<void>
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({
  children,
  deviceOnly = false,
  forcedLocale,
}: {
  children: ReactNode
  /** Fila pública: segue só o idioma do aparelho. */
  deviceOnly?: boolean
  /** Landing `/`, `/en`, `/es`: idioma fixo da rota (SSR + cookies). */
  forcedLocale?: AppLocale | null
}) {
  const [locale, setLocaleState] = useState<AppLocale>(() =>
    forcedLocale ??
    resolveInitialLocale({
      deviceOnly,
      userLocale: typeof window !== 'undefined' ? getUser()?.locale : null,
    }),
  )

  useEffect(() => {
    if (forcedLocale) {
      setLocaleState(forcedLocale)
      writeStoredLocale(forcedLocale)
      return
    }
    if (deviceOnly) {
      setLocaleState(detectBrowserLocale())
      return
    }
    const userLocale = normalizeLocale(getUser()?.locale)
    const next =
      userLocale ??
      readStoredLocale() ??
      detectBrowserLocale()
    setLocaleState(next)
    writeStoredLocale(next)
  }, [deviceOnly, forcedLocale])

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = toBcp47(locale)
    }
  }, [locale])

  const setLocale = useCallback(
    async (next: AppLocale, options?: { persist?: boolean }) => {
      setLocaleState(next)
      writeStoredLocale(next)

      if (deviceOnly || options?.persist === false) return

      const user = getUser()
      if (!user) return

      try {
        const { locale: saved } = await updateUserLocale(next)
        updateStoredUserLocale(saved)
      } catch {
        // mantém a UI no idioma escolhido mesmo se a API falhar
      }
    },
    [deviceOnly],
  )

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      bcp47: toBcp47(locale),
      t: (key, params) => translate(locale, key, params),
      setLocale,
    }),
    [locale, setLocale],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    // Fallback seguro fora do provider (SSR / landing): pt_BR
    return {
      locale: DEFAULT_LOCALE,
      bcp47: toBcp47(DEFAULT_LOCALE),
      t: (key, params) => translate(DEFAULT_LOCALE, key, params),
      setLocale: async () => undefined,
    }
  }
  return ctx
}
