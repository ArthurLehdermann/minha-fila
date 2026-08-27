export type OrderStatus = 'waiting' | 'preparing' | 'ready' | 'done' | 'cancelled'

export type PlanStatus = 'active' | 'trial' | 'blocked'

export interface AssinaturaCartao {
  ciclo: 'mensal' | 'anual'
  status: string
  proxima_cobranca: string | null
}

export interface PixPendente {
  id: string
  expira_em: string | null
}

export interface BillingStatus {
  plan_status: PlanStatus
  trial_ends_at: string | null
  renews_at: string | null
  assinatura_cartao: AssinaturaCartao | null
  pix_pendente: PixPendente | null
}

export interface PixCheckout {
  id: string
  pix_qr_code: string | null
  pix_qr_code_base64: string | null
  expira_em: string | null
}

export interface PixStatus {
  status: string
  aprovado: boolean
  expirado: boolean
  acesso_ate: string | null
}

export interface CartaoCheckout {
  ok: boolean
  status: string
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
  timezone: string
  companies: Company[]
}

export interface AuthResponse {
  user: User
}

export interface ResetSequenceResponse {
  ok: boolean
  current_number: number
}

export interface LaravelResponse<T> {
  data: T
}
