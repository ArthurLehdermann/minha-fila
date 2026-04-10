import Link from 'next/link'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'

export function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--lp-border)] bg-[var(--lp-nav)] backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Minha Fila" width={56} height={24} className="h-8 w-auto" />
          <span className="text-sm font-semibold tracking-wide text-[var(--lp-h)] sm:text-base">
            Minha Fila
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/auth/login"
            className="rounded-xl px-3 py-2 text-xs font-semibold text-[var(--lp-muted)] transition hover:bg-[var(--lp-hover)] sm:px-4 sm:text-sm"
          >
            Entrar
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-400 sm:px-4 sm:text-sm"
          >
            Criar minha fila grátis
          </Link>
        </div>
      </div>
    </nav>
  )
}
