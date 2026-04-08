import Link from 'next/link'

export function PricingSection() {
  return (
    <section className="border-t border-white/8 bg-[#111] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
          Preço
        </p>
        <h2 className="mb-12 text-4xl font-extrabold text-white">Simples assim</h2>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Mensal */}
          <div className="rounded-2xl border border-white/8 bg-[#161616] px-8 py-10">
            <p className="mb-2 text-sm text-gray-400">Mensal</p>
            <p className="text-5xl font-black text-white">
              R$&nbsp;9,90
              <span className="text-lg font-normal text-gray-400">/mês</span>
            </p>
            <p className="mt-3 text-sm text-gray-500">Cancele quando quiser</p>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl border border-white/15 bg-white/8 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/12"
            >
              Começar grátis →
            </Link>
          </div>

          {/* Anual */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-[#1a0e00] px-8 py-10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-500 px-4 py-1 text-xs font-black text-black">
              MELHOR VALOR
            </div>
            <p className="mb-2 text-sm text-brand-300">Anual</p>
            <p className="text-5xl font-black text-white">
              R$&nbsp;99,90
              <span className="text-lg font-normal text-gray-400">/ano</span>
            </p>
            <p className="mt-3 text-sm text-gray-500">Menos de R$&nbsp;8,33/mês</p>
            <Link
              href="/auth/login"
              className="mt-8 block rounded-xl bg-brand-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-500"
            >
              Começar grátis →
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          30 dias grátis em qualquer plano. Sem cartão de crédito.
        </p>
      </div>
    </section>
  )
}
