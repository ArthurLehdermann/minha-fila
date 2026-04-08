import useSWR from 'swr'
import { getBillingStatus } from '@/lib/api'
import type { BillingStatus } from '@/types'

export function useBillingStatus() {
  const { data, isLoading, mutate } = useSWR<BillingStatus>('billing-status', getBillingStatus)

  return {
    billing: data,
    isBlocked: data?.plan_status === 'blocked',
    isTrial: data?.plan_status === 'trial',
    isLoading,
    mutate,
  }
}
