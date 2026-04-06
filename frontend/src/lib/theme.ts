'use client'

import { useEffect, useMemo, useState } from 'react'

export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'theme_preference'

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const raw = localStorage.getItem(STORAGE_KEY)
  if (raw === 'light' || raw === 'dark' || raw === 'system') return raw
  return 'system'
}

function applyThemeAttribute(theme: ResolvedTheme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
}

export function useThemePreference() {
  const [preference, setPreference] = useState<ThemePreference>('system')
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>('dark')

  useEffect(() => {
    const initialPreference = getStoredPreference()
    const initialSystem = getSystemTheme()

    setPreference(initialPreference)
    setSystemTheme(initialSystem)

    const resolved = initialPreference === 'system' ? initialSystem : initialPreference
    applyThemeAttribute(resolved)

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = (event: MediaQueryListEvent) => {
      const nextSystemTheme: ResolvedTheme = event.matches ? 'dark' : 'light'
      setSystemTheme(nextSystemTheme)
      const currentPreference = getStoredPreference()
      if (currentPreference === 'system') {
        applyThemeAttribute(nextSystemTheme)
      }
    }

    mediaQuery.addEventListener('change', listener)
    return () => mediaQuery.removeEventListener('change', listener)
  }, [])

  const resolvedTheme = useMemo<ResolvedTheme>(
    () => (preference === 'system' ? systemTheme : preference),
    [preference, systemTheme],
  )

  function updatePreference(next: ThemePreference) {
    setPreference(next)
    localStorage.setItem(STORAGE_KEY, next)
    applyThemeAttribute(next === 'system' ? getSystemTheme() : next)
  }

  return {
    preference,
    resolvedTheme,
    updatePreference,
  }
}
