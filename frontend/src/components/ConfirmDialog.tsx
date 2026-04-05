import { Trash2, AlertTriangle, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
}: Props) {
  if (!isOpen) return null

  const variantColors = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-slate-950',
    info: 'bg-cyan-400 hover:bg-cyan-300 focus:ring-cyan-300 text-slate-950',
  }

  const iconColors = {
    danger: 'text-red-400 bg-red-500/10 ring-1 ring-red-500/20',
    warning: 'text-yellow-400 bg-yellow-500/10 ring-1 ring-yellow-500/20',
    info: 'text-cyan-400 bg-cyan-400/10 ring-1 ring-cyan-400/20',
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 underline backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm transform overflow-hidden rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl transition-all">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-slate-500 hover:bg-white/5 hover:text-slate-300"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${iconColors[variant]}`}>
            {variant === 'danger' ? <Trash2 size={28} /> : <AlertTriangle size={28} />}
          </div>

          <h3 className="mb-2 text-2xl font-black text-white tracking-tight">{title}</h3>
          <p className="mb-8 text-sm text-slate-400 font-medium leading-relaxed">
            {message}
          </p>

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-widest shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 ${variantColors[variant]}`}
            >
              {isLoading ? 'Aguarde...' : confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-2xl border border-white/5 bg-white/5 px-4 py-3.5 text-sm font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-800 disabled:opacity-50"
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
