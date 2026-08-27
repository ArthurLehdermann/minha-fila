/**
 * Loader do SDK JS do Mercado Pago (v2).
 *
 * Carrega o script uma única vez (mesmo com várias montagens do formulário
 * de cartão) e devolve a instância já inicializada com a Public Key. Os
 * dados sensíveis do cartão (número, validade, CVV) são capturados por
 * Secure Fields — iframes hospedados pelo próprio Mercado Pago — então
 * nunca trafegam pelo nosso frontend/backend, só o token gerado.
 */

const SDK_SRC = 'https://sdk.mercadopago.com/js/v2'
const SDK_SCRIPT_ID = 'mercadopago-sdk-js'

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: Record<string, unknown>) => any
  }
}

let mpPromise: Promise<any> | null = null

export function getMercadoPago(): Promise<any> {
  if (mpPromise) return mpPromise

  mpPromise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('O SDK do Mercado Pago só pode ser carregado no navegador.'))
      return
    }

    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
    if (!publicKey) {
      reject(new Error('NEXT_PUBLIC_MP_PUBLIC_KEY não configurada no frontend.'))
      return
    }

    const init = () => {
      if (!window.MercadoPago) {
        reject(new Error('Falha ao carregar o SDK do Mercado Pago.'))
        return
      }
      try {
        resolve(new window.MercadoPago(publicKey, { locale: 'pt-BR' }))
      } catch (e) {
        reject(e)
      }
    }

    if (window.MercadoPago) {
      init()
      return
    }

    const existing = document.getElementById(SDK_SCRIPT_ID) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', init)
      existing.addEventListener('error', () => reject(new Error('Falha ao carregar o SDK do Mercado Pago.')))
      return
    }

    const script = document.createElement('script')
    script.id = SDK_SCRIPT_ID
    script.src = SDK_SRC
    script.async = true
    script.onload = init
    script.onerror = () => reject(new Error('Falha ao carregar o SDK do Mercado Pago.'))
    document.body.appendChild(script)
  })

  return mpPromise
}
