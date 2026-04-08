const dores = [
  { emoji: '😤', texto: '"Já tá pronto?" — o cliente pergunta pela quinta vez.' },
  { emoji: '😵', texto: 'Pedido entregue errado porque a fila era só na cabeça do operador.' },
  { emoji: '😠', texto: 'Cliente que chegou depois recebeu antes. Reclamação na hora.' },
  { emoji: '📢', texto: 'Gritando nome no salão cheio...' },
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
