import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import type { Order } from '@/types'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

let echoInstance: Echo | null = null

export function getEcho(): Echo {
  if (echoInstance) return echoInstance

  window.Pusher = Pusher

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
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
  const channel = echo.channel(`company.${uuid}`)
  channel.listen('.OrderUpdated', onOrderUpdated)
  return () => echo.leaveChannel(`company.${uuid}`)
}
