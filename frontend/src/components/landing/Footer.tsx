import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-[#0d0d0d] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-gray-500">
        <p>© 2026 Minha Fila · Fila virtual para restaurantes</p>
        <Link href="/auth/login" className="transition hover:text-gray-300">
          Entrar
        </Link>
      </div>
    </footer>
  )
}
