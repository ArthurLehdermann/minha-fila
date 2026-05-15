'use client'

import { useEffect, type PropsWithChildren } from 'react'
import { X } from 'lucide-react'

interface LegalModalProps extends PropsWithChildren {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  footerLink?: React.ReactNode
}

export function LegalModal({ open, onClose, title, subtitle, children, footerLink }: LegalModalProps) {
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
        <div className="relative w-full max-w-3xl rounded-2xl border border-white/10 bg-[#111] shadow-2xl px-6 py-8 my-8 sm:px-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mb-6 pr-8">
            <h2 className="text-xl font-black text-white">{title}</h2>
            {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
          </div>

          <div className="text-gray-300">{children}</div>

          <div className="mt-8 pt-5 border-t border-white/10 text-xs text-gray-500 flex gap-5 flex-wrap items-center">
            {footerLink}
            <button onClick={onClose} className="hover:text-gray-300 transition-colors">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
