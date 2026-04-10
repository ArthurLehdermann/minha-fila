import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--lp-border)] bg-[var(--lp-bg1)] px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between text-xs text-[var(--lp-faint)]">
        <p>© 2026 Minha Fila · Fila virtual para qualquer operação</p>
        <Link href="/auth/login" className="transition hover:text-[var(--lp-body)]">
          Entrar
        </Link>
      </div>
    </footer>
  )
}
