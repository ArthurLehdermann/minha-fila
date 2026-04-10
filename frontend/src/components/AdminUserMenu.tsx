'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ChevronDown, CreditCard, LogOut, MonitorCog, MoonStar, SunMedium, UserRound } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { clearAuth, getUser } from '@/lib/auth'
import type { ThemePreference } from '@/lib/theme'

interface AdminUserMenuProps {
  themePreference: ThemePreference
  onChangeTheme: (theme: ThemePreference) => void
  activeCount?: number
  totalCount?: number
  planStatus?: string | null
  trialDaysLeft?: number | null
}

const themeOptions: Array<{ value: ThemePreference; label: string; icon: ReactNode }> = [
  { value: 'light', label: 'Claro', icon: <SunMedium className="h-3.5 w-3.5" /> },
  { value: 'dark', label: 'Escuro', icon: <MoonStar className="h-3.5 w-3.5" /> },
  { value: 'system', label: 'Dispositivo', icon: <MonitorCog className="h-3.5 w-3.5" /> },
]

export function AdminUserMenu({ themePreference, onChangeTheme, activeCount, totalCount, planStatus, trialDaysLeft }: AdminUserMenuProps) {
  const router = useRouter()
  const user = getUser()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (!menuRef.current) return
      if (event.target instanceof Node && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  function handleLogout() {
    clearAuth()
    router.replace('/auth/login')
  }

  const planLabel =
    planStatus === 'active' ? 'Ativo' :
    planStatus === 'trial' ? `Trial — ${trialDaysLeft} ${trialDaysLeft === 1 ? 'dia' : 'dias'}` :
    planStatus === 'grace' ? 'Encerra em breve' :
    planStatus === 'blocked' ? 'Bloqueado' : '—'

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--menu-button-hover-bg)] px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--menu-button-text)] transition hover:bg-[var(--menu-button-hover-bg)]"
      >
        <UserRound className="h-4 w-4" />
        <span className="max-w-[120px] truncate">{user?.name ?? 'Usuário'}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-[var(--border-soft)] bg-[var(--menu-bg)] p-3 shadow-2xl backdrop-blur-xl">

          {/* Dados do usuário inline */}
          <div className="mb-3 rounded-xl border border-[var(--border-soft)] px-3 py-2.5 text-xs">
            <p className="mt-0.5 truncate text-[var(--text-soft)]">{user?.email}</p>
            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--text-soft)]">
              {activeCount ?? 0} ativas · {totalCount ?? 0} total
            </p>
          </div>

          <div className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-soft)]">Tema</div>
          <div className="grid gap-1">
            {themeOptions.map((option) => {
              const active = themePreference === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => onChangeTheme(option.value)}
                  className={`inline-flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition ${
                    active
                      ? 'bg-brand-600/15 text-brand-400'
                      : 'text-[var(--menu-button-text)] hover:bg-[var(--menu-button-hover-bg)] hover:text-[var(--menu-button-hover-text)]'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {option.icon}
                    {option.label}
                  </span>
                  {active && <span className="text-[10px] uppercase tracking-widest">ativo</span>}
                </button>
              )
            })}
          </div>

          <div className="my-3 border-t border-[var(--border-soft)]" />

          <Link
            href="/billing"
            className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-[var(--menu-button-text)] transition hover:bg-[var(--menu-button-hover-bg)] hover:text-[var(--menu-button-hover-text)]"
            onClick={() => setOpen(false)}
          >
            <CreditCard className="h-3.5 w-3.5" />
            Plano & Faturamento
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      )}
    </div>
  )
}
