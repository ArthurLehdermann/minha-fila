const passos = [
  {
    emoji: '📱',
    titulo: 'Cliente lê o QR Code',
    descricao: 'Na mesa ou balcão. Sem app para instalar.',
  },
  {
    emoji: '📋',
    titulo: 'Entra na fila automaticamente',
    descricao: 'Situação dos pedidos em tempo real no painel do operador.',
  },
  {
    emoji: '✅',
    titulo: 'Chamado quando ficar pronto',
    descricao: 'Notificação no celular. Sem grito, sem confusão.',
  },
]

export function SolucaoSection() {
  return (
    <section
      id="como-funciona"
      className="border-t border-white/8 bg-[#111] px-4 py-20 sm:px-6"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand-500">
          A solução
        </p>
        <h2 className="mb-4 text-4xl font-extrabold text-white">
          Fila inteligente, atendimento tranquilo
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-lg text-gray-400">
          Cada cliente sabe onde está. Você sabe quem é o próximo.
          Sem papel, sem totem, sem app.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          {passos.map(({ emoji, titulo, descricao }) => (
            <div
              key={titulo}
              className="rounded-2xl border border-white/8 bg-[#161616] px-6 py-8"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-2xl">
                {emoji}
              </div>
              <h3 className="mb-2 font-bold text-white">{titulo}</h3>
              <p className="text-sm leading-relaxed text-gray-400">{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
