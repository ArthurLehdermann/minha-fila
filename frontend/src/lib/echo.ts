import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import type { Order } from '@/types'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let echoInstance: Echo<any> | null = null
let warnedMissingConfig = false

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEcho(): Echo<any> | null {
  if (echoInstance) return echoInstance
  if (typeof window === 'undefined') return null

  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY

  // Em ambientes sem realtime configurado, não quebrar a UI.
  // Apenas desabilita assinatura em tempo real e mantém polling via SWR.
  if (!key) {
    if (!warnedMissingConfig) {
      // eslint-disable-next-line no-console
      console.warn('[echo] NEXT_PUBLIC_PUSHER_APP_KEY não definido; realtime desabilitado.')
      warnedMissingConfig = true
    }
    return null
  }

  window.Pusher = Pusher

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key,
    wsHost: process.env.NEXT_PUBLIC_PUSHER_HOST ?? 'localhost',
    wsPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001),
    wssPort: Number(process.env.NEXT_PUBLIC_PUSHER_PORT ?? 6001),
    forceTLS: process.env.NEXT_PUBLIC_PUSHER_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER ?? 'mt1',
  })

  return echoInstance
}

export function subscribeToCompany(
  uuid: string,
  onOrderUpdated: (order: Partial<Order>) => void,
) {
  const echo = getEcho()
  if (!echo) return () => undefined

  const channel = echo.channel(`company.${uuid}`)
  channel.listen('.OrderUpdated', onOrderUpdated)
  return () => echo.leaveChannel(`company.${uuid}`)
}
