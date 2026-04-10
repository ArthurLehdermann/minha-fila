import type { User } from '@/types'

export function saveAuth(user: User) {
  localStorage.setItem('auth_user', JSON.stringify(user))
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
