import Link from 'next/link'

export function NavBar() {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0d0d0d]/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand-500 text-sm font-black text-black">
            M
          </span>
          <span className="text-sm font-semibold tracking-wide text-slate-200 sm:text-base">
            Minha Fila
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/auth/login"
            className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-white/10 sm:px-4 sm:text-sm"
          >
            Entrar
          </Link>
          <Link
            href="/auth/login"
            className="rounded-xl bg-brand-500 px-3 py-2 text-xs font-bold text-black transition hover:bg-brand-400 sm:px-4 sm:text-sm"
          >
            Criar minha fila grátis
          </Link>
        </div>
      </div>
    </nav>
  )
}
