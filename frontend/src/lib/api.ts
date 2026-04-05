import axios from 'axios'
import type { AuthResponse, Order, ResetSequenceResponse, LaravelResponse } from '@/types'

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

export const verifyMagicLink = (token: string, email: string): Promise<LaravelResponse<AuthResponse>> =>
  api.get('/auth/magic-link/verify', { params: { token, email } }).then(res => res.data)

export const googleRedirectUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL
  const isInvalid = !envUrl || envUrl === 'undefined'
  const base = !isInvalid ? envUrl : (typeof window !== 'undefined' ? window.location.origin : '')
  return `${base}/auth/google/redirect`
}

// Companies
export const listCompanies = (): Promise<LaravelResponse<any[]>> =>
  api.get('/api/companies').then(res => res.data)

export const createCompany = (name: string): Promise<LaravelResponse<any>> =>
  api.post('/api/companies', { name }).then(res => res.data)

export const deleteCompany = (uuid: string): Promise<void> =>
  api.delete(`/api/companies/${uuid}`)

// Orders
export const listOrders = (uuid: string): Promise<LaravelResponse<Order[]>> =>
  api.get(`/api/companies/${uuid}/orders`).then(res => res.data)

export const listChanges = (uuid: string, since: number): Promise<LaravelResponse<Order[]>> =>
  api.get(`/api/companies/${uuid}/orders/changes`, { params: { since } }).then(res => res.data)

export const createOrder = (uuid: string, label: string): Promise<LaravelResponse<Order>> =>
  api.post(`/api/companies/${uuid}/orders`, { label }).then(res => res.data)

export const updateOrderStatus = (orderId: string, status: string): Promise<LaravelResponse<Order>> =>
  api.patch(`/api/orders/${orderId}`, { status }).then(res => res.data)

export const resetSequence = (uuid: string): Promise<LaravelResponse<ResetSequenceResponse>> =>
  api.post(`/api/companies/${uuid}/reset-sequence`).then(res => res.data)

export default api
