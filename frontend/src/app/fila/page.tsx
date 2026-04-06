'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Building2, ExternalLink, Loader2, Plus, Settings, Sparkles, Trash2 } from 'lucide-react'
import Swal from 'sweetalert2'
import { AdminUserMenu } from '@/components/AdminUserMenu'
import { listCompanies, createCompany, deleteCompany } from '@/lib/api'
import { useThemePreference } from '@/lib/theme'
import type { Company } from '@/types'

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const { preference, updatePreference } = useThemePreference()

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

  const companyCount = Array.isArray(companies) ? companies.length : 0

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    setCreating(true)
    try {
      await createCompany(newName)
      setNewName('')
      await fetchCompanies()
    } catch {
      await Swal.fire({
        title: 'Ops! Não foi possível criar',
        text: 'Erro ao criar fila. Tente novamente.',
        icon: 'error',
        confirmButtonColor: '#06b6d4',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        },
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
        confirmButtonColor: '#06b6d4',
        customClass: {
          popup: 'rounded-2xl',
          confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        },
      })
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-300" />
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-50 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-5 sm:p-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Painel</p>
              <h1 className="mt-2 text-2xl font-black sm:text-3xl">Minhas Filas</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300">
                Crie filas, acompanhe a operação ao vivo e entre direto no painel administrativo.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
                <Building2 className="h-4 w-4" />
                {companyCount} {companyCount === 1 ? 'fila ativa' : 'filas ativas'}
              </div>
              <AdminUserMenu themePreference={preference} onChangeTheme={updatePreference} />
            </div>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 sm:p-6">
          <h2 className="text-lg font-bold">Nova fila</h2>
          <p className="mt-1 text-sm text-slate-300">Defina um nome para iniciar uma fila digital.</p>

          <form onSubmit={handleCreate} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ex: Restaurante Centro, Clínica Nova..."
              className="w-full rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/30"
              disabled={creating}
            />

            <button
              type="submit"
              disabled={creating || !newName.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Criar fila
            </button>
          </form>
        </section>

        {companyCount === 0 ? (
          <section className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-950 text-slate-700 ring-1 ring-white/5">
              <Sparkles className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-white">Nenhuma fila cadastrada</h3>
            <p className="mt-2 text-sm text-slate-400">Crie sua primeira fila para começar a decolar sua operação.</p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {companies.map((company) => (
              <article
                key={company.id}
                className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/15 text-base font-black text-cyan-100">
                    {company.name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="rounded-xl p-2 text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
                    aria-label={`Excluir ${company.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <h3 className="mt-5 line-clamp-1 text-lg font-black text-white">{company.name}</h3>
                <p className="mt-1 line-clamp-1 text-xs text-slate-400">{company.id}</p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  <Link
                    href={`/fila/${company.id}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Público
                  </Link>
                  <Link
                    href={`/fila/${company.id}/admin`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-cyan-400 px-3 py-2 text-xs font-black text-slate-950 transition hover:bg-cyan-300"
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
  )
}
