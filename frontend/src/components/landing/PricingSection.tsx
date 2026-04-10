import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="border-t border-[var(--lp-border)] bg-[var(--lp-bg2)] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
          Preço
        </p>
        <h2 className="mb-12 text-4xl font-extrabold text-[var(--lp-h)]">Simples assim</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Mensal */}
          <div className="rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-card)] px-8 py-10">
            <p className="mb-2 text-sm text-[var(--lp-muted)]">Mensal</p>
            <p className="text-5xl font-black text-[var(--lp-h)]">
              R$&nbsp;9,90
              <span className="text-lg font-normal text-[var(--lp-muted)]">/mês</span>
            </p>
            <p className="mt-3 text-sm text-[var(--lp-faint)]">Cancele quando quiser</p>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl border border-[var(--lp-outline-border)] bg-[var(--lp-outline-bg)] px-6 py-3 text-sm font-bold text-[var(--lp-outline-text)] transition hover:bg-[var(--lp-outline-hover)]"
            >
              Começar grátis →
            </Link>
          </div>

          {/* Anual */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-[var(--lp-card-warm)] px-8 py-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-4 py-1 text-xs font-black text-white">
              MELHOR VALOR
            </div>
            <p className="mb-2 text-sm text-brand-400">Anual</p>
            <p className="text-5xl font-black text-[var(--lp-h)]">
              R$&nbsp;99,90
              <span className="text-lg font-normal text-[var(--lp-muted)]">/ano</span>
            </p>
            <p className="mt-3 text-sm text-[var(--lp-faint)]">Menos de R$&nbsp;8,33/mês</p>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
            >
              Começar grátis →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-[var(--lp-faint)]">
          30 dias grátis em qualquer plano. Sem cartão de crédito.
        </p>
      </div>
    </section>
  )
}
