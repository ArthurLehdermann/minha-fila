export function Termos() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Última atualização: maio de 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Aceitação dos Termos</h3>
        <p>
          Ao criar uma conta ou utilizar a plataforma <strong>Minha Fila</strong>, o usuário ou
          empresa (denominado "Cliente") concorda integralmente com estes Termos de Uso. Caso não
          concorde com qualquer disposição, não utilize o serviço.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">2. Descrição do Serviço</h3>
        <p>O Minha Fila é uma plataforma SaaS de gestão de filas digitais que oferece:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Criação e gestão de filas virtuais com numeração sequencial automática;</li>
          <li>Painel administrativo para controle de status dos tickets em tempo real;</li>
          <li>Acesso público à fila via QR Code ou link direto;</li>
          <li>Notificações e atualizações em tempo real via WebSocket;</li>
          <li>Gestão de múltiplas empresas e estabelecimentos por conta.</li>
        </ul>
        <p>O serviço é destinado a empresas, empreendedores e profissionais para uso em suas operações.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">3. Conta e Responsabilidade</h3>
        <p>
          O Cliente é responsável por manter as credenciais de acesso em sigilo e por todas as
          ações realizadas sob sua conta. Ao suspeitar de acesso não autorizado, deve notificar
          imediatamente{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>.
        </p>
        <p>As informações fornecidas no cadastro devem ser precisas e mantidas atualizadas.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">4. Licença de Uso</h3>
        <p>
          O Minha Fila concede ao Cliente uma licença limitada, não exclusiva, intransferível e
          revogável para usar a plataforma em suas operações durante o período de assinatura ativa,
          observadas as restrições destes Termos. Esta licença não transfere qualquer direito de
          propriedade intelectual sobre a plataforma, código, design ou marca.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">5. Uso Aceitável e Restrições</h3>
        <p>O Cliente concorda em não:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Revender ou sublicenciar o acesso à plataforma a terceiros;</li>
          <li>Realizar engenharia reversa, descompilar ou tentar extrair o código-fonte;</li>
          <li>Utilizar o serviço para fins ilegais, fraudulentos ou que violem direitos de terceiros;</li>
          <li>Executar scraping automatizado ou qualquer ação que prejudique a disponibilidade do serviço para outros clientes;</li>
          <li>Remover ou ocultar avisos de direitos autorais ou marcas do Minha Fila.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">6. Conteúdo do Usuário</h3>
        <p>
          O Cliente é o único responsável pelo conteúdo cadastrado na plataforma (nomes de filas,
          configurações, descrições), incluindo sua veracidade e conformidade com a legislação
          aplicável. O Minha Fila hospeda esse conteúdo sem assumir responsabilidade pelo que o
          Cliente configura ou disponibiliza ao público.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">7. Planos, Pagamento e Renovação</h3>
        <p>
          O acesso completo à plataforma está condicionado à assinatura de um plano pago, processado
          pela Stripe, Inc. Um período de avaliação gratuita pode ser oferecido conforme indicado no
          cadastro. Os planos renovam automaticamente (mensal ou anualmente) até que o Cliente solicite
          o cancelamento. O cancelamento encerra a renovação futura; o acesso permanece ativo até o
          fim do período já pago.
        </p>
        <p>
          Em caso de falha no pagamento, o acesso pode ser suspenso após aviso por e-mail. Não
          emitimos reembolsos por períodos parcialmente utilizados, salvo quando exigido por lei.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">8. Disponibilidade do Serviço</h3>
        <p>
          Objetivamos alta disponibilidade da plataforma, mas não garantimos operação ininterrupta.
          Manutenções programadas serão comunicadas com antecedência razoável. Indisponibilidades
          breves decorrentes de manutenção, atualização ou falhas técnicas não geram direito a
          crédito, reembolso ou indenização, salvo disposição contratual específica.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">9. Isenção de Garantias</h3>
        <p>
          O serviço é fornecido "no estado em que se encontra". Não oferecemos garantias expressas
          ou implícitas de adequação a uma finalidade específica, ausência de erros ou resultados
          operacionais. O uso da plataforma não substitui processos internos e treinamento da equipe
          do Cliente.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">10. Limitação de Responsabilidade</h3>
        <p>
          Em nenhuma hipótese o Minha Fila será responsável por danos indiretos, lucros cessantes,
          perda de dados ou danos consequenciais. Nossa responsabilidade total perante o Cliente fica
          limitada ao valor pago nos três meses anteriores ao evento que originou a reclamação.
          Ficam expressamente excluídos danos decorrentes de falha de conexão à internet do Cliente
          e erros operacionais cometidos pela equipe do Cliente.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">11. Privacidade e Proteção de Dados (LGPD)</h3>
        <p>
          O Minha Fila (BigWorks) atua como <strong>controladora</strong> dos dados pessoais do
          responsável pela conta (nome, e-mail, dados de acesso).
        </p>
        <p>
          Em relação aos dados operacionais gerados pelo Cliente no uso da plataforma (filas,
          tickets, configurações), o Cliente mantém a condição de <strong>controlador</strong> e
          o Minha Fila atua como <strong>operadora</strong>, processando esses dados exclusivamente
          para viabilizar a prestação do serviço contratado.
        </p>
        <p>O tratamento de dados é regido pela nossa <strong>Política de Privacidade</strong>.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">12. Suspensão e Rescisão</h3>
        <p>
          O Minha Fila pode suspender ou encerrar o acesso do Cliente, com aviso prévio ou
          imediatamente dependendo da gravidade, nos seguintes casos:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Inadimplência por mais de 7 dias corridos após o vencimento;</li>
          <li>Violação de qualquer disposição destes Termos;</li>
          <li>Uso da plataforma para fins ilegais ou fraudulentos;</li>
          <li>Comportamento abusivo com a equipe de suporte;</li>
          <li>Determinação judicial ou regulatória.</li>
        </ul>
        <p>
          O Cliente pode encerrar sua conta a qualquer momento por e-mail para{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">13. Dados após a Rescisão</h3>
        <p>
          Após o encerramento da conta, o Cliente terá até 30 dias para solicitar a exportação de
          seus dados (filas, histórico de tickets). Decorrido esse prazo, os dados poderão ser
          excluídos dos sistemas ativos. Cópias de backup podem persistir por prazo técnico
          adicional, sendo posteriormente excluídas ou anonimizadas.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">14. Integrações e Serviços de Terceiros</h3>
        <p>
          O Minha Fila utiliza serviços de terceiros como Stripe (pagamentos) e Google (autenticação
          e analytics). O uso desses serviços está sujeito às respectivas políticas de cada provedor.
          Não assumimos responsabilidade por falhas, alterações ou descontinuação de serviços de
          terceiros.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">15. Modificações dos Termos</h3>
        <p>
          Reservamo-nos o direito de modificar estes Termos a qualquer momento. Alterações relevantes
          serão comunicadas com pelo menos 15 dias de antecedência pelo e-mail cadastrado ou por
          aviso na plataforma. O uso continuado após a vigência das alterações constitui aceitação.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">16. Lei Aplicável e Foro</h3>
        <p>
          Estes Termos são regidos pela legislação brasileira, em especial o Código Civil e a LGPD.
          Fica eleito o foro da Comarca de Teutônia/RS para dirimir quaisquer controvérsias, com
          renúncia a qualquer outro, por mais privilegiado que seja, salvo disposição legal
          imperativa em contrário.
        </p>
      </section>
    </div>
  )
}
