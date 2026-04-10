/**
 * API imperativa de diálogos — mesma cara em todo o app.
 * Usa o componente DialogRoot montado no layout como renderer.
 */

export type DialogVariant = 'danger' | 'warning' | 'info'

export type DialogState =
  | { open: false }
  | {
      open: true
      type: 'confirm'
      title: string
      text: string
      confirmText: string
      cancelText: string
      variant: DialogVariant
      isDark: boolean
    }
  | {
      open: true
      type: 'input'
      title: string
      inputValue: string
      isDark: boolean
    }
  | {
      open: true
      type: 'alert'
      title: string
      text?: string
      variant: DialogVariant
      isDark: boolean
    }

type Resolver = ((value: boolean) => void) | ((value: string | null) => void)

let _setDialogState: ((state: DialogState) => void) | null = null
let _resolver: Resolver | null = null

/** Chamado uma vez pelo DialogRoot ao montar */
export function registerDialogRoot(setter: (state: DialogState) => void) {
  _setDialogState = setter
}

function close() {
  _setDialogState?.({ open: false })
  _resolver = null
}

export function dialogConfirm({
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
  variant?: DialogVariant
  isDark?: boolean
}): Promise<boolean> {
  return new Promise((resolve) => {
    _resolver = resolve as (value: boolean) => void
    _setDialogState?.({ open: true, type: 'confirm', title, text, confirmText, cancelText, variant, isDark })
  })
}

export function dialogInput({
  title,
  inputValue = '',
  isDark = false,
}: {
  title: string
  inputValue?: string
  isDark?: boolean
}): Promise<string | null> {
  return new Promise((resolve) => {
    _resolver = resolve as (value: string | null) => void
    _setDialogState?.({ open: true, type: 'input', title, inputValue, isDark })
  })
}

export function dialogAlert({
  title,
  text,
  variant = 'info',
  isDark = false,
}: {
  title: string
  text?: string
  variant?: DialogVariant
  isDark?: boolean
}): Promise<void> {
  return new Promise((resolve) => {
    _resolver = resolve as () => void
    _setDialogState?.({ open: true, type: 'alert', title, text, variant, isDark })
  })
}

export function resolveDialog(value: boolean | string | null) {
  ;(_resolver as (v: typeof value) => void)?.(value)
  close()
}
