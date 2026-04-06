'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import Swal from 'sweetalert2'
import { ChevronDown, LogOut, MonitorCog, MoonStar, SunMedium, UserRound } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { clearAuth, getUser } from '@/lib/auth'
import type { ThemePreference } from '@/lib/theme'

interface AdminUserMenuProps {
  themePreference: ThemePreference
  onChangeTheme: (theme: ThemePreference) => void
}

const themeOptions: Array<{ value: ThemePreference; label: string; icon: ReactNode }> = [
  { value: 'light', label: 'Claro', icon: <SunMedium className="h-3.5 w-3.5" /> },
  { value: 'dark', label: 'Escuro', icon: <MoonStar className="h-3.5 w-3.5" /> },
  { value: 'system', label: 'Dispositivo', icon: <MonitorCog className="h-3.5 w-3.5" /> },
]

export function AdminUserMenu({ themePreference, onChangeTheme }: AdminUserMenuProps) {
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

  function handleMyData() {
    if (!user) return

    Swal.fire({
      title: 'Meus dados',
      html: `
        <div style="text-align:left;display:grid;gap:10px;">
          <div><strong>Nome:</strong> ${user.name}</div>
          <div><strong>E-mail:</strong> ${user.email}</div>
          <div><strong>Empresas:</strong> ${user.companies.length}</div>
        </div>
      `,
      confirmButtonText: 'Fechar',
      background: '#0f172a',
      color: '#f8fafc',
      customClass: {
        popup: 'rounded-3xl border border-white/10',
        confirmButton: 'rounded-xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px]',
      },
    })
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-200 transition hover:bg-white/10"
      >
        <UserRound className="h-4 w-4" />
        <span className="max-w-[120px] truncate">{user?.name ?? 'Usuário'}</span>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 rounded-2xl border border-white/10 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl">
          <div className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Tema</div>
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
                      ? 'bg-cyan-400/15 text-cyan-300'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
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

          <div className="my-3 border-t border-white/10" />

          <button
            type="button"
            onClick={handleMyData}
            className="inline-flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-slate-200 transition hover:bg-white/5 hover:text-white"
          >
            <UserRound className="h-3.5 w-3.5" />
            Meus dados
          </button>

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
