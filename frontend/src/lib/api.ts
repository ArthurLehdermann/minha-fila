import axios from 'axios'
import type { AuthResponse, Order, ResetSequenceResponse } from '@/types'

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

// Auth
export const sendMagicLink = (email: string) =>
  api.post('/auth/magic-link', { email })

export const verifyMagicLink = (token: string, email: string): Promise<{ data: AuthResponse }> =>
  api.get('/auth/magic-link/verify', { params: { token, email } })

export const googleRedirectUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  const isInvalid = !envUrl || envUrl === 'undefined'
  const base = !isInvalid ? envUrl : (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/auth/google/redirect`
}

// Companies
export const listCompanies = (): Promise<{ data: any[] }> =>
  api.get('/api/companies')

export const createCompany = (name: string): Promise<{ data: any }> =>
  api.post('/api/companies', { name })

export const deleteCompany = (uuid: string): Promise<void> =>
  api.delete(`/api/companies/${uuid}`)

// Orders
export const listOrders = (uuid: string): Promise<{ data: Order[] }> =>
  api.get(`/api/companies/${uuid}/orders`)

export const listChanges = (uuid: string, since: number): Promise<{ data: Order[] }> =>
  api.get(`/api/companies/${uuid}/orders/changes`, { params: { since } })

export const createOrder = (uuid: string, label: string): Promise<{ data: Order }> =>
  api.post(`/api/companies/${uuid}/orders`, { label })

export const updateOrderStatus = (orderId: string, status: string): Promise<{ data: Order }> =>
  api.patch(`/api/orders/${orderId}`, { status })

export const resetSequence = (uuid: string): Promise<{ data: ResetSequenceResponse }> =>
  api.post(`/api/companies/${uuid}/reset-sequence`)

export default api
