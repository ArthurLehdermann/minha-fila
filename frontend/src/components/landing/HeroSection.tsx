import Link from 'next/link'

export function HeroSection() {
  return (
    <section
      className="px-4 py-24 sm:px-6"
      style={{ background: 'linear-gradient(135deg, #1a0e00 0%, #0d0d0d 65%)' }}
    >
      <div className="mx-auto max-w-3xl text-center">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-1.5 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-300">
          🔥 Fila digital para qualquer atendimento
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl font-black leading-tight tracking-tight text-white lg:text-6xl">
          Chega de fila bagunçada
          <br />
          <span className="text-brand-400">no seu atendimento.</span>
        </h1>

        {/* Sub */}
        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-gray-300">
          Organize os atendimentos, elimine a confusão e chame com agilidade.
          Tudo pelo celular, sem instalar nada.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/auth/login"
            className="w-full rounded-xl bg-brand-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-brand-500 sm:w-auto"
          >
            Criar minha fila grátis →
          </Link>
          <a
            href="#como-funciona"
            className="w-full rounded-xl border border-white/15 bg-white/8 px-8 py-4 text-lg font-medium text-white transition hover:bg-white/12 sm:w-auto"
          >
            Ver como funciona
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">30 dias grátis · Sem cartão de crédito</p>

        {/* Product mockup */}
        <div className="mx-auto mt-14 max-w-xs overflow-hidden rounded-3xl border border-white/10 bg-[#161616] shadow-2xl shadow-black/60">
          {/* Phone status bar */}
          <div className="flex items-center justify-between bg-[#111] px-4 py-2 text-[10px] text-gray-500">
            <span>https://minha-fila.meugarcom.app/</span>
            <span>🔒</span>
          </div>
          {/* Queue mockup */}
          <div className="p-4">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brand-400">
              Atendimento ao vivo
            </p>
            {[
              { pos: 1, nome: 'Carlos', status: 'Em andamento', color: 'text-brand-400' },
              { pos: 2, nome: 'Fernanda', status: 'Na fila', color: 'text-gray-400' },
              { pos: 3, nome: 'Rafael', status: 'Concluído', color: 'text-gray-400' },
            ].map(({ pos, nome, status, color }) => (
              <div
                key={pos}
                className="mb-2 flex items-center justify-between rounded-lg border border-white/8 bg-white/5 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-gray-600">#{pos}</span>
                  <span className="text-sm font-semibold text-white">{nome}</span>
                </div>
                <span className={`text-xs font-medium ${color}`}>{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
