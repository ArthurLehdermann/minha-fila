'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { GA_MEASUREMENT_ID, trackPageView } from '@/lib/analytics'

export function Analytics() {
  const pathname = usePathname()
  const [gaEnabled, setGaEnabled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      const level = (e as CustomEvent<{ level: string }>).detail?.level
      setGaEnabled(level === 'all')
    }
    window.addEventListener('meugarcom:cookie-consent', handler)
    return () => window.removeEventListener('meugarcom:cookie-consent', handler)
  }, [])

  useEffect(() => {
    if (!gaEnabled) return
    const query = typeof window !== 'undefined' ? window.location.search : ''
    const url = query ? `${pathname}${query}` : pathname
    trackPageView(url)
  }, [pathname, gaEnabled])

  if (!GA_MEASUREMENT_ID || !gaEnabled) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
    </>
  )
}
