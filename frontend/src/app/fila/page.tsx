'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, List, Settings, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { listCompanies, createCompany, deleteCompany } from '@/lib/api'
import type { Company } from '@/types'

export default function DashboardPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const fetchCompanies = async () => {
    try {
      const { data } = await listCompanies()
      setCompanies(data)
    } catch (error) {
      console.error('Failed to fetch companies', error)
    } finally {
      setLoading(false)
    }
  }

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
    } catch (error) {
      alert('Erro ao criar fila. Tente novamente.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (uuid: string) => {
    if (!confirm('Tem certeza que deseja excluir esta fila? Todos os dados serão perdidos.')) return
    try {
      await deleteCompany(uuid)
      setCompanies(companies.filter(c => c.id !== uuid))
    } catch (error) {
      alert('Erro ao excluir fila.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Minhas Filas</h1>
              <p className="mt-2 text-gray-600">Gerencie seus estabelecimentos e acompanhe o fluxo em tempo real.</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg">
              {companies.length}
            </div>
          </div>

          {/* Create New Card */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Nova Unidade</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-4 sm:flex-row">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Restaurante Central, Clínica Silva..."
                className="block w-full rounded-2xl border-0 px-4 py-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-500 sm:text-sm sm:leading-6"
                disabled={creating}
              />
              <button
                type="submit"
                disabled={creating || !newName.trim()}
                className="flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600 disabled:opacity-50 transition-all"
              >
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Criar Unidade
              </button>
            </form>
          </div>

          {/* List Grid */}
          {companies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="rounded-full bg-gray-100 p-6 mb-4">
                <List className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">Nenhuma fila encontrada</h3>
              <p className="mt-1 text-gray-500">Crie sua primeira unidade para começar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {companies.map((company) => (
                <div key={company.id} className="group relative rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-xl hover:ring-brand-100 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 font-bold text-xl uppercase">
                      {company.name.charAt(0)}
                    </div>
                    <button
                      onClick={() => handleDelete(company.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">ID: {company.id}</p>
                  </div>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    <Link
                      href={`/fila/${company.id}`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Público
                    </Link>
                    <Link
                      href={`/fila/${company.id}/admin`}
                      className="flex items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-600 transition-colors"
                    >
                      <Settings className="h-4 w-4" />
                      Gerenciar
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
