import type { User } from '@/types'
import { writeStoredLocale, normalizeLocale } from '@/lib/i18n/locales'

export function saveAuth(user: User) {
  localStorage.setItem('auth_user', JSON.stringify(user))
  const locale = normalizeLocale(user.locale)
  if (locale) writeStoredLocale(locale)
}

export function getUser(): User | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('auth_user')
  if (!raw) return null

  try {
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

export function clearAuth() {
  localStorage.removeItem('auth_user')
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('auth_user')
}

export function updateStoredUserTimezone(timezone: string) {
  const user = getUser()
  if (!user) return null

  const nextUser = { ...user, timezone }
  saveAuth(nextUser)
  return nextUser
}

export function updateStoredUserLocale(locale: string) {
  const user = getUser()
  if (!user) return null

  const nextUser = { ...user, locale: locale as User['locale'] }
  saveAuth(nextUser)
  return nextUser
}
