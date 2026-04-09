'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Loader2, Plus, PowerOff, Settings, Sparkles, Trash2, Zap } from 'lucide-react'
import Swal from 'sweetalert2'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { UpgradeWall } from '@/components/UpgradeWall'
import { listCompanies, createCompany, deleteCompany, toggleCompanyStatus } from '@/lib/api'
import { useBillingStatus } from '@/hooks/useBillingStatus'
import { useThemePreference } from '@/lib/theme'
import type { Company } from '@/types'

function CheckoutSuccessHandler({ onSuccess }: { onSuccess: () => void }) {
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      onSuccess()
    }
  }, [searchParams, onSuccess])
  return null
}

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const { preference, resolvedTheme, updatePreference } = useThemePreference()
  const { billing, isBlocked, isTrial, mutate: mutateBilling } = useBillingStatus()

  const fetchCompanies = async () => {
    try {
      const { data } = await listCompanies()
      setCompanies(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch companies', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  function handleCheckoutSuccess() {
    mutateBilling()
    Swal.fire({
      title: 'Bem-vindo ao Premium!',
      text: 'Sua assinatura foi ativada com sucesso.',
      icon: 'success',
      confirmButtonColor: '#d97706',
      customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl px-5 py-2.5 font-bold' },
    })
  }

  const activeCount = companies.filter((c) => c.status === 'active').length
  const totalCount = companies.length

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setCreating(true)
    try {
      await createCompany(newName)
      setNewName('')
      await fetchCompanies()
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao criar fila. Tente novamente.'
      await Swal.fire({
        title: 'Ops!',
        text: message,
        icon: 'error',
        confirmButtonColor: '#d97706',
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl px-5 py-2.5 font-bold' },
      })
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    const result = await Swal.fire({
      title: 'Excluir esta fila?',
      text: 'Todos os dados serão perdidos e não poderão ser recuperados.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      customClass: {
        popup: 'rounded-2xl',
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    })
    if (!result.isConfirmed) return

    try {
      await deleteCompany(uuid)
      setCompanies((prev) => prev.filter((company) => company.id !== uuid))
    } catch {
      await Swal.fire({
        title: 'Erro ao excluir',
        text: 'Não foi possível excluir a fila no momento.',
        icon: 'error',
        confirmButtonColor: '#d97706',
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl px-5 py-2.5 font-bold' },
      })
    }
  }

  const handleToggleStatus = async (company: Company) => {
    try {
      const { data } = await toggleCompanyStatus(company.id)
      setCompanies((prev) => prev.map((c) => (c.id === company.id ? { ...c, status: data.status } : c)))
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Erro ao alterar status.'
      await Swal.fire({
        title: 'Ops!',
        text: message,
        icon: 'error',
        confirmButtonColor: '#d97706',
        customClass: { popup: 'rounded-2xl', confirmButton: 'rounded-xl px-5 py-2.5 font-bold' },
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)]">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    )
  }

  const trialDaysLeft = billing?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(billing.trial_ends_at).getTime() - Date.now()) / 86400000))
    : null

  return (
    <>
      {isBlocked && <UpgradeWall />}
      <Suspense>
        <CheckoutSuccessHandler onSuccess={handleCheckoutSuccess} />
      </Suspense>

      <main className="min-h-screen bg-[var(--app-bg)] px-4 py-6 text-[var(--app-fg)] sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <header className="rounded-3xl border border-[var(--border-soft)] bg-gradient-to-br from-[var(--header-gradient-from)] to-[var(--header-gradient-to)] p-5 sm:p-7">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-300">Painel</p>
                <h1 className="mt-2 text-2xl font-black sm:text-3xl">Minhas Filas</h1>
                <p className="mt-2 max-w-2xl text-sm text-[var(--text-muted)]">
                  Crie filas, acompanhe a operação ao vivo e entre direto no painel administrativo.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                {isTrial && trialDaysLeft !== null && (
                  <div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold ${resolvedTheme === 'dark' ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300' : 'border-yellow-500/40 bg-yellow-50 text-yellow-700'}`}>
                    <Zap className="h-4 w-4" />
                    Trial: {trialDaysLeft} {trialDaysLeft === 1 ? 'dia' : 'dias'}
                  </div>
                )}
                {billing?.plan_status === 'grace' && (
                  <div className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm font-semibold ${resolvedTheme === 'dark' ? 'border-orange-500/30 bg-orange-500/10 text-orange-300' : 'border-orange-400/50 bg-orange-50 text-orange-700'}`}>
                    Assinatura encerra em breve
                  </div>
                )}

                <AdminUserMenu
                  themePreference={preference}
                  onChangeTheme={updatePreference}
                  activeCount={activeCount}
                  totalCount={totalCount}
                  planStatus={billing?.plan_status}
                  trialDaysLeft={trialDaysLeft}
                />
              </div>
            </div>
          </header>

          <section className="rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 sm:p-6">
            <h2 className="text-lg font-bold">Nova fila</h2>
            <p className="mt-1 text-sm text-[var(--text-muted)]">Defina um nome para iniciar uma fila digital.</p>

            <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Restaurante Centro, Clínica Nova..."
                className="w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--surface-solid)] px-4 py-3 text-sm text-[var(--app-fg)] placeholder:text-[var(--text-soft)] outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                disabled={creating}
              />

              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-black text-white transition hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Criar fila
              </button>
            </form>
          </section>

          {totalCount === 0 ? (
            <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--border-soft)] bg-[var(--surface-2)] p-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--empty-icon-bg)] text-[var(--empty-icon-fg)] ring-1 ring-[var(--border-soft)]">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black">Nenhuma fila cadastrada</h3>
              <p className="mt-2 text-sm text-[var(--text-soft)]">Crie sua primeira fila para começar a decolar sua operação.</p>
            </section>
          ) : (
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {companies.map((company) => (
                <article
                  key={company.id}
                  className={`rounded-3xl border border-[var(--border-soft)] bg-[var(--surface-1)] p-5 transition hover:-translate-y-0.5 hover:border-brand-500/30 ${company.status === 'inactive' ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-base font-black text-brand-200">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                      {company.status === 'inactive' && (
                        <span className="rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-soft)]">
                          Inativa
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleStatus(company)}
                        className={`rounded-xl p-2 transition ${
                          company.status === 'active'
                            ? 'text-[var(--text-soft)] hover:bg-yellow-500/10 hover:text-yellow-300'
                            : 'text-[var(--text-soft)] hover:bg-green-500/10 hover:text-green-300'
                        }`}
                        aria-label={company.status === 'active' ? 'Desativar fila' : 'Reativar fila'}
                        title={company.status === 'active' ? 'Desativar' : 'Reativar'}
                      >
                        <PowerOff className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="rounded-xl p-2 text-[var(--text-soft)] transition hover:bg-red-500/10 hover:text-red-300"
                        aria-label={`Excluir ${company.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="mt-5 line-clamp-1 text-lg font-black">{company.name}</h3>
                  <p className="mt-1 line-clamp-1 text-xs text-[var(--text-soft)]">{company.id}</p>

                  <div className="mt-6 grid grid-cols-2 gap-2">
                    <Link
                      href={`/filas/${company.id}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border-soft)] px-3 py-2 text-xs font-semibold text-[var(--text-muted)] transition hover:bg-[var(--menu-button-hover-bg)] hover:text-[var(--menu-button-hover-text)]"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Público
                    </Link>
                    <Link
                      href={`/filas/${company.id}/admin`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-brand-600 px-3 py-2 text-xs font-black text-white transition hover:bg-brand-500"
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>
    </>
  )
}
