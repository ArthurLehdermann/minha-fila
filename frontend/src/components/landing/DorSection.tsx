const dores = [
  { emoji: '😤', texto: '"Minha senha já foi chamada?" — a pessoa pergunta pela quinta vez.' },
  { emoji: '😵', texto: 'Chamado perdido porque a ordem estava só na cabeça da equipe.' },
  { emoji: '😠', texto: 'Quem chegou depois foi atendido antes. Confusão na hora.' },
  { emoji: '📢', texto: 'Gritaria para organizar a fila em ambiente lotado...' },
]

export function DorSection() {
  return (
    <section className="border-t border-white/8 bg-[#0d0d0d] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-brand-500">
          Você conhece esse caos
        </p>
        <h2 className="mb-12 text-center text-4xl font-extrabold text-white">Parece familiar?</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {dores.map(({ emoji, texto }) => (
            <div
              key={texto}
              className="flex items-start gap-4 rounded-xl border border-white/8 bg-[#161616] px-6 py-5"
            >
              <span className="text-2xl">{emoji}</span>
              <p className="text-sm leading-relaxed text-gray-300">{texto}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
