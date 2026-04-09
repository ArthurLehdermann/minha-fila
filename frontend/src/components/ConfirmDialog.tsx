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
  theme?: 'light' | 'dark'
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
  theme = 'dark',
}: Props) {
  if (!isOpen) return null

  const isDark = theme === 'dark'

  const variantColors = {
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500 text-white',
    warning: 'bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500 text-slate-950',
    info: 'bg-brand-600 hover:bg-brand-500 focus:ring-brand-500 text-slate-950',
  }

  const iconColors = {
    danger: 'text-red-400 bg-red-500/10 ring-1 ring-red-500/20',
    warning: 'text-yellow-400 bg-yellow-500/10 ring-1 ring-yellow-500/20',
    info: 'text-brand-500 bg-brand-600/10 ring-1 ring-brand-500/20',
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 backdrop-blur-md transition-opacity ${isDark ? 'bg-slate-950/80' : 'bg-slate-900/40'}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div className={`relative w-full max-w-sm transform overflow-hidden rounded-3xl border p-8 shadow-2xl transition-all ${
        isDark
          ? 'border-white/10 bg-[#111]'
          : 'border-slate-200 bg-white'
      }`}>
        <button
          onClick={onClose}
          className={`absolute right-4 top-4 rounded-full p-2 transition ${
            isDark
              ? 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${iconColors[variant]}`}>
            {variant === 'danger' ? <Trash2 size={28} /> : <AlertTriangle size={28} />}
          </div>

          <h3 className={`mb-2 text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {title}
          </h3>
          <p className={`mb-8 text-sm font-medium leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {message}
          </p>

          <div className="flex w-full flex-col gap-3">
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={`w-full rounded-2xl px-4 py-3.5 text-sm font-black uppercase tracking-widest shadow-lg focus:outline-none focus:ring-2 disabled:opacity-50 ${variantColors[variant]} ${
                isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
              } focus:ring-offset-2`}
            >
              {isLoading ? 'Aguarde...' : confirmText}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`w-full rounded-2xl border px-4 py-3.5 text-sm font-black uppercase tracking-widest focus:outline-none disabled:opacity-50 transition ${
                isDark
                  ? 'border-white/5 bg-white/5 text-slate-400 hover:bg-white/10'
                  : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cancelText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
