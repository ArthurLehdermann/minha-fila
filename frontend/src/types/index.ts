export type OrderStatus = 'waiting' | 'preparing' | 'ready' | 'done'

export interface Order {
  id: string
  company_uuid: string
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
  company_uuid: string | null
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ResetSequenceResponse {
  ok: boolean
  current_number: number
}
