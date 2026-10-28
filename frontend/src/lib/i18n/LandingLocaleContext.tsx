'use client'

import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { landingT } from './landing'
import { writeStoredLocale, type AppLocale } from './locales'
import { useI18n } from './context'

const LandingLocaleContext = createContext<AppLocale>('pt_BR')

/** Força o idioma da landing (e sincroniza I18nProvider / localStorage para login e cookies). */
export function LandingLocaleProvider({
  locale,
  children,
}: {
  locale: AppLocale
  children: ReactNode
}) {
  const { setLocale } = useI18n()

  useEffect(() => {
    writeStoredLocale(locale)
    void setLocale(locale, { persist: false })
  }, [locale, setLocale])

  return (
    <LandingLocaleContext.Provider value={locale}>{children}</LandingLocaleContext.Provider>
  )
}

export function useLandingLocale(): AppLocale {
  return useContext(LandingLocaleContext)
}

export function useLandingT() {
  const locale = useLandingLocale()
  return (key: string) => landingT(locale, key)
}
