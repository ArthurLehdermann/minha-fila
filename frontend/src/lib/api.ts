import axios from 'axios'
import type { AuthResponse, BillingStatus, Company, Order, ResetSequenceResponse, LaravelResponse } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

// Attach Sanctum token on every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Dispatch plan-blocked event on 402
api.interceptors.response.use(null, (error) => {
  if (error.response?.status === 402) {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('plan-blocked'))
    }
  }
  return Promise.reject(error)
})

function normalizeResponse<T>(payload: unknown): LaravelResponse<T> {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload as LaravelResponse<T>
  }

  return { data: payload as T }
}

// Auth
export const sendMagicLink = (email: string) =>
  api.post('/auth/magic-link', { email })

export const verifyMagicLink = (token: string, email: string): Promise<LaravelResponse<AuthResponse>> =>
  api.get('/auth/magic-link/verify', { params: { token, email } }).then((res) => normalizeResponse<AuthResponse>(res.data))

export const googleRedirectUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  const isInvalid = !envUrl || envUrl === 'undefined'

  // Production fallback: keep OAuth on backend host even if NEXT_PUBLIC_API_URL is missing.
  // Using window.location.origin can hit Next.js (frontend) and return 404 on /auth/google/redirect.
  const fallbackBase = 'https://minhafila.meugarcom.app'
  const base = !isInvalid ? envUrl : fallbackBase

  return `${base.replace(/\/$/, '')}/auth/google/redirect`
}

// Companies
export const getCompany = (uuid: string): Promise<Company> =>
  api.get(`/api/companies/${uuid}`).then((res) => res.data)

export const listCompanies = (): Promise<LaravelResponse<any[]>> =>
  api.get('/api/companies').then((res) => normalizeResponse<any[]>(res.data))

export const createCompany = (name: string): Promise<LaravelResponse<any>> =>
  api.post('/api/companies', { name }).then((res) => normalizeResponse<any>(res.data))

export const deleteCompany = (uuid: string): Promise<void> =>
  api.delete(`/api/companies/${uuid}`)

// Orders
export const listOrders = (uuid: string): Promise<LaravelResponse<Order[]>> =>
  api.get(`/api/companies/${uuid}/orders`).then((res) => normalizeResponse<Order[]>(res.data))

export const listChanges = (uuid: string, since: number): Promise<LaravelResponse<Order[]>> =>
  api.get(`/api/companies/${uuid}/orders/changes`, { params: { since } }).then((res) => normalizeResponse<Order[]>(res.data))

export const createOrder = (uuid: string, label: string): Promise<LaravelResponse<Order>> =>
  api.post(`/api/companies/${uuid}/orders`, { label }).then((res) => normalizeResponse<Order>(res.data))

export const updateOrderStatus = (orderId: string, status: string): Promise<LaravelResponse<Order>> =>
  api.patch(`/api/orders/${orderId}`, { status }).then((res) => normalizeResponse<Order>(res.data))

export const resetSequence = (uuid: string): Promise<LaravelResponse<ResetSequenceResponse>> =>
  api.post(`/api/companies/${uuid}/reset-sequence`).then((res) => normalizeResponse<ResetSequenceResponse>(res.data))

export const toggleCompanyStatus = (uuid: string): Promise<LaravelResponse<any>> =>
  api.patch(`/api/companies/${uuid}/status`).then((res) => normalizeResponse<any>(res.data))

export const updateCompanyLabels = (
  uuid: string,
  labels: { label_ready: string; label_preparing: string; label_waiting: string }
): Promise<Company> =>
  api.patch(`/api/companies/${uuid}/labels`, labels).then((res) => res.data)

// Billing
export const getBillingStatus = (): Promise<BillingStatus> =>
  api.get('/api/billing/status').then((res) => res.data)

export const createCheckoutSession = (plan: 'monthly' | 'yearly'): Promise<{ url: string }> =>
  api.post('/api/billing/checkout', { plan }).then((res) => res.data)

export const createPortalSession = (): Promise<{ url: string }> =>
  api.post('/api/billing/portal').then((res) => res.data)

export const cancelSubscription = (): Promise<{ ok: boolean }> =>
  api.post('/api/billing/cancel').then((res) => res.data)

export const resumeSubscription = (): Promise<{ ok: boolean }> =>
  api.post('/api/billing/resume').then((res) => res.data)

export default api
