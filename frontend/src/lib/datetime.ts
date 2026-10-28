import { getUser } from '@/lib/auth'
import { DEFAULT_LOCALE, normalizeLocale, readStoredLocale, toBcp47 } from '@/lib/i18n/locales'

export function getUserTimezone(): string {
  return getUser()?.timezone || 'UTC'
}

function resolveIntlLocale(locale?: string): string {
  if (locale) return locale.includes('_') ? locale.replace('_', '-') : locale
  const appLocale =
    normalizeLocale(getUser()?.locale) ??
    readStoredLocale() ??
    DEFAULT_LOCALE
  return toBcp47(appLocale)
}

export function formatDateByUserTimezone(isoDate: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    dateStyle: 'short',
    timeZone: getUserTimezone(),
  }).format(new Date(isoDate))
}

export function formatTimeByUserTimezone(isoDate: string, locale?: string): string {
  return new Intl.DateTimeFormat(resolveIntlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: getUserTimezone(),
  }).format(new Date(isoDate))
}
