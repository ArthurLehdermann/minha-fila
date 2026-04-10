'use client'

import { useEffect, useRef, useState } from 'react'
import { AlertTriangle, CheckCircle2, Pencil, Trash2, X } from 'lucide-react'
import { registerDialogRoot, resolveDialog } from '@/lib/dialog'
import type { DialogState, DialogVariant } from '@/lib/dialog'

const VARIANT_ICON = {
  danger: Trash2,
  warning: AlertTriangle,
  info: Pencil,
}

const VARIANT_ICON_CLASS: Record<DialogVariant, string> = {
  danger:  'text-red-400 bg-red-500/10 ring-1 ring-red-500/20',
  warning: 'text-yellow-400 bg-yellow-500/10 ring-1 ring-yellow-500/20',
  info:    'text-brand-500 bg-brand-600/10 ring-1 ring-brand-500/20',
}

const VARIANT_CONFIRM_CLASS: Record<DialogVariant, string> = {
  danger:  'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-slate-950',
  info:    'bg-brand-600 hover:bg-brand-500 text-slate-950',
}

export function DialogRoot() {
  const [state, setState] = useState<DialogState>({ open: false })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    registerDialogRoot(setState)
  }, [])

  useEffect(() => {
    if (state.open && state.type === 'input') {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [state])

  if (!state.open) return null

  const isDark = state.isDark

  const overlayClass = isDark ? 'bg-slate-950/80' : 'bg-slate-900/40'
  const popupClass   = isDark ? 'border-white/10 bg-[#111]' : 'border-slate-200 bg-white'
  const titleClass   = isDark ? 'text-white' : 'text-slate-900'
  const textClass    = isDark ? 'text-slate-400' : 'text-slate-500'
  const closeClass   = isDark ? 'text-slate-500 hover:bg-white/5 hover:text-slate-300' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
  const cancelClass  = isDark ? 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10' : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
  const inputClass   = isDark
    ? 'border-white/10 bg-slate-950/50 text-white placeholder:text-slate-600 focus:border-brand-500/50 focus:ring-brand-500/10'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-brand-500/50 focus:ring-brand-500/10'

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') resolveDialog('type' in state && state.type === 'confirm' ? false : null)
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity ${overlayClass}`}
        onClick={() => resolveDialog('type' in state && state.type === 'confirm' ? false : null)}
      />

      <div className={`relative w-full max-w-sm rounded-3xl border p-8 shadow-2xl ${popupClass}`}>
        <button
          onClick={() => resolveDialog('type' in state && state.type === 'confirm' ? false : null)}
          className={`absolute right-4 top-4 rounded-full p-2 transition ${closeClass}`}
        >
          <X size={20} />
        </button>

        {state.type === 'confirm' && (() => {
          const Icon = VARIANT_ICON[state.variant]
          return (
            <div className="flex flex-col items-center text-center">
              <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${VARIANT_ICON_CLASS[state.variant]}`}>
                <Icon size={28} />
              </div>
              <h3 className={`mb-2 text-2xl font-black tracking-tight ${titleClass}`}>{state.title}</h3>
              <p className={`mb-8 text-sm font-medium leading-relaxed ${textClass}`}>{state.text}</p>
              <div className="flex w-full flex-col gap-3">
                <button
                  autoFocus
                  onClick={() => resolveDialog(true)}
                  className={`w-full rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-widest shadow-lg ${VARIANT_CONFIRM_CLASS[state.variant]}`}
                >
                  {state.confirmText}
                </button>
                <button
                  onClick={() => resolveDialog(false)}
                  className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-black uppercase tracking-widest transition ${cancelClass}`}
                >
                  {state.cancelText}
                </button>
              </div>
            </div>
          )
        })()}

        {state.type === 'alert' && (
          <div className="flex flex-col items-center text-center">
            <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${VARIANT_ICON_CLASS[state.variant]}`}>
              <CheckCircle2 size={28} />
            </div>
            <h3 className={`mb-2 text-2xl font-black tracking-tight ${titleClass}`}>{state.title}</h3>
            {state.text && <p className={`mb-8 text-sm font-medium leading-relaxed ${textClass}`}>{state.text}</p>}
            <button
              autoFocus
              onClick={() => resolveDialog(null)}
              className={`w-full rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-widest shadow-lg ${VARIANT_CONFIRM_CLASS[state.variant]}`}
            >
              OK
            </button>
          </div>
        )}

        {state.type === 'input' && (
          <div className="flex flex-col">
            <h3 className={`mb-5 text-2xl font-black tracking-tight ${titleClass}`}>{state.title}</h3>
            <input
              ref={inputRef}
              type="text"
              defaultValue={state.inputValue}
              maxLength={100}
              onKeyDown={(e) => e.key === 'Enter' && resolveDialog((e.target as HTMLInputElement).value.trim() || null)}
              className={`w-full rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => resolveDialog(null)}
                className={`flex-1 rounded-2xl border px-4 py-3 text-sm font-black uppercase tracking-widest transition ${cancelClass}`}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  const val = inputRef.current?.value.trim() || null
                  resolveDialog(val)
                }}
                className="flex-1 rounded-2xl bg-brand-600 px-4 py-3 text-sm font-black uppercase tracking-widest text-white hover:bg-brand-500 shadow-sm"
              >
                Salvar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
