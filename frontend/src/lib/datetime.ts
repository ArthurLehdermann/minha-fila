import { getUser } from '@/lib/auth'

export function getUserTimezone(): string {
  return getUser()?.timezone || 'UTC'
}

export function formatDateByUserTimezone(isoDate: string, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'short',
    timeZone: getUserTimezone(),
  }).format(new Date(isoDate))
}

export function formatTimeByUserTimezone(isoDate: string, locale = 'pt-BR'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: getUserTimezone(),
  }).format(new Date(isoDate))
}
