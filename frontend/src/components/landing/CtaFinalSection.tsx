import Link from 'next/link'

export function CtaFinalSection() {
  return (
    <section
      className="border-t border-[var(--lp-cta-border)] px-4 py-24 text-center sm:px-6"
      style={{ background: 'var(--lp-cta-grad)' }}
    >
      <h2 className="mb-4 text-4xl font-black leading-tight tracking-tight text-[var(--lp-h)] lg:text-5xl">
        Sua fila começa hoje.
        <br />
        <span className="text-brand-400">Grátis por 30 dias.</span>
      </h2>
      <p className="mx-auto mb-10 max-w-md text-lg text-[var(--lp-muted)]">
        Sem cartão. Sem contrato. Sem enrolação.
      </p>
      <Link
        href="/auth/login"
        className="inline-block rounded-2xl bg-brand-600 px-10 py-5 text-xl font-black text-white transition hover:bg-brand-500"
      >
        Criar minha fila grátis →
      </Link>
    </section>
  )
}
