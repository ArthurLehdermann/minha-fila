'use client'

import useSWR from 'swr'
import { useEffect, useRef } from 'react'
import { listOrders } from '@/lib/api'
import { subscribeToCompany } from '@/lib/echo'
import type { Order } from '@/types'

export function useOrders(uuid: string) {
  const { data, error, mutate } = useSWR<Order[]>(
    uuid ? `orders-${uuid}` : null,
    () => listOrders(uuid).then((r) => r.data),
    { refreshInterval: 0 },
  )

  const latestSequenceId = useRef(0)

  // Track the highest sequence_id seen
  useEffect(() => {
    if (data && data.length > 0) {
      latestSequenceId.current = Math.max(...data.map((o) => o.sequence_id))
    }
  }, [data])

  // Subscribe to realtime updates
  useEffect(() => {
    if (!uuid) return
    const unsubscribe = subscribeToCompany(uuid, (partial) => {
      mutate((current) => {
        if (!current) return current
        return current.map((order) =>
          order.id === partial.id ? { ...order, ...partial } : order,
        )
      }, false)
    })
    return unsubscribe
  }, [uuid, mutate])

  const waiting = data?.filter((o) => o.status === 'waiting') ?? []
  const preparing = data?.filter((o) => o.status === 'preparing') ?? []
  const ready = data?.filter((o) => o.status === 'ready') ?? []
  const done = data?.filter((o) => o.status === 'done') ?? []

  return {
    orders: data ?? [],
    waiting,
    preparing,
    ready,
    done,
    isLoading: !error && !data,
    isError: !!error,
    mutate,
  }
}
