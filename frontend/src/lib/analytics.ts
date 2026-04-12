export const GA_MEASUREMENT_ID = 'G-TS7NF0D5CK'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

export function isAnalyticsEnabled() {
  return typeof window !== 'undefined' && typeof window.gtag === 'function' && Boolean(GA_MEASUREMENT_ID)
}

export function trackPageView(url: string) {
  if (!isAnalyticsEnabled()) return
  window.gtag?.('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (!isAnalyticsEnabled()) return
  window.gtag?.('event', name, params)
}
