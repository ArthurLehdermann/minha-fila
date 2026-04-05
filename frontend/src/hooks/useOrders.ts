'use client'

import useSWR from 'swr'
import { useRef, useEffect } from 'react'
import { listOrders } from '@/lib/api'
import { subscribeToCompany } from '@/lib/echo'
import type { Order, LaravelResponse } from '@/types'

export function useOrders(uuid: string) {
  const { data: response, error, isLoading, mutate } = useSWR<LaravelResponse<Order[]>>(
    uuid ? `orders-${uuid}` : null,
    () => listOrders(uuid),
    {
      refreshInterval: 1000,
      revalidateOnFocus: true,
    }
  );

  // Now 'response' is correctly typed as LaravelResponse<Order[]>
  const orders: Order[] = response?.data || [];
  const latestSequenceId = useRef(0)

  // Track the highest sequence_id seen
  useEffect(() => {
    if (orders && orders.length > 0) {
      const ids = orders.map((o) => Number(o.sequence_id) || 0)
      latestSequenceId.current = Math.max(0, ...ids)
    }
  }, [orders])

  // Subscribe to realtime updates
  useEffect(() => {
    if (!uuid) return
    const unsubscribe = subscribeToCompany(uuid, (partial) => {
      mutate((current: any) => {
        const currentData = current?.data || current || [];
        return {
          ...current,
          data: (Array.isArray(currentData) ? currentData : []).map((order: Order) =>
            order.id === partial.id ? { ...order, ...partial } : order
          )
        }
      }, false)
    })
    return unsubscribe
  }, [uuid, mutate])

  const waiting = orders.filter((o) => o.status === 'waiting')
  const preparing = orders.filter((o) => o.status === 'preparing')
  const ready = orders.filter((o) => o.status === 'ready')
  const done = orders.filter((o) => o.status === 'done')

  return {
    orders,
    waiting,
    preparing,
    ready,
    done,
    isLoading,
    isError: !!error,
    mutate,
  }
}
