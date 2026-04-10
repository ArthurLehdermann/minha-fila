export type OrderStatus = 'waiting' | 'preparing' | 'ready' | 'done' | 'cancelled'

export type PlanStatus = 'active' | 'trial' | 'grace' | 'blocked'

export interface BillingStatus {
  plan_status: PlanStatus
  trial_ends_at: string | null
  renews_at: string | null
  stripe_status: string | null
  cancel_at_period_end: boolean
}

export interface Company {
  id: string
  owner_id: string
  name: string
  status: 'active' | 'inactive'
  qr_code_url: string | null
  label_ready: string
  label_preparing: string
  label_waiting: string
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  company_id: string
  number: number
  label: string
  status: OrderStatus
  sequence_id: number
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  companies: Company[]
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ResetSequenceResponse {
  ok: boolean
  current_number: number
}

export interface LaravelResponse<T> {
  data: T
}
