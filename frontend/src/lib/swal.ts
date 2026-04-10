import Swal from 'sweetalert2'

const CANCEL_COLOR = '#1e293b'

const CONFIRM_COLORS = {
  danger: '#ef4444',
  warning: '#d97706',
  success: '#16a34a',
  info: '#2563eb',
}

function base(isDark: boolean) {
  return {
    background: isDark ? '#0f172a' : '#ffffff',
    color: isDark ? '#f8fafc' : '#0f172a',
    customClass: {
      popup: isDark
        ? 'rounded-3xl border border-white/10 shadow-2xl'
        : 'rounded-3xl border border-slate-200 shadow-2xl',
      confirmButton: 'rounded-2xl px-6 py-3 font-black uppercase tracking-widest text-[11px] focus:outline-none',
      cancelButton:  'rounded-2xl px-6 py-3 font-black uppercase tracking-widest text-[11px] focus:outline-none',
      container: 'z-[9999]',
    },
  }
}

/** Diálogo de confirmação — retorna true se confirmado */
export async function swalConfirm({
  title,
  text,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isDark = false,
}: {
  title: string
  text: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'success' | 'info'
  isDark?: boolean
}): Promise<boolean> {
  const result = await Swal.fire({
    title,
    text,
    icon: variant === 'danger' ? 'warning' : variant === 'warning' ? 'warning' : 'info',
    showCancelButton: true,
    confirmButtonColor: CONFIRM_COLORS[variant],
    cancelButtonColor: CANCEL_COLOR,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
    ...base(isDark),
  })
  return result.isConfirmed
}

/** Diálogo de input de texto — retorna o valor ou null se cancelado */
export async function swalInput({
  title,
  inputValue = '',
  isDark = false,
}: {
  title: string
  inputValue?: string
  isDark?: boolean
}): Promise<string | null> {
  const result = await Swal.fire({
    title,
    input: 'text',
    inputValue,
    inputAttributes: { maxlength: '100' },
    showCancelButton: true,
    confirmButtonColor: CONFIRM_COLORS.success,
    cancelButtonColor: CANCEL_COLOR,
    confirmButtonText: 'Salvar',
    cancelButtonText: 'Cancelar',
    reverseButtons: true,
    ...base(isDark),
  })
  if (!result.isConfirmed) return null
  const val = (result.value as string).trim()
  return val || null
}

/** Alerta simples (sucesso / erro / aviso) */
export async function swalAlert({
  title,
  text,
  icon = 'success',
  isDark = false,
  timer = 2000,
}: {
  title: string
  text?: string
  icon?: 'success' | 'error' | 'warning' | 'info'
  isDark?: boolean
  timer?: number
}) {
  await Swal.fire({
    title,
    ...(text ? { text } : {}),
    icon,
    timer,
    showConfirmButton: false,
    ...base(isDark),
  })
}

/** Mantido para usos que precisam de opções brutas (ex: "Meus dados") */
export function swalTheme(isDark: boolean) {
  return base(isDark)
}
