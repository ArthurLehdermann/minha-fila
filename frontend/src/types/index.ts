export type OrderStatus = 'waiting' | 'preparing' | 'ready' | 'done' | 'cancelled'

export interface Company {
  id: string
  owner_id: string
  name: string
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
