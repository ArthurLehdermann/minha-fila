const diferenciais = [
  { destaque: 'Sem app', descricao: 'A pessoa acompanha pelo navegador. Zero instalação.' },
  { destaque: 'Sem hardware', descricao: 'Sem totem, sem senha física, sem equipamento.' },
  { destaque: '5 minutos', descricao: 'Da conta criada até a primeira fila funcionando.' },
]

export function DiferenciaisSection() {
  return (
    <section className="border-t border-white/8 bg-[#0d0d0d] px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-4xl font-extrabold text-white">
          Sem complicação, sem desculpa
        </h2>

        <div className="grid gap-8 text-center sm:grid-cols-3">
          {diferenciais.map(({ destaque, descricao }) => (
            <div key={destaque}>
              <p className="text-4xl font-black text-brand-400">{destaque}</p>
              <p className="mt-2 text-sm text-gray-400">{descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
