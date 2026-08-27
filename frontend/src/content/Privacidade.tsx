export function Privacidade() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Última atualização: maio de 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Quem Somos</h3>
        <p>
          A <strong>BigWorks</strong>, pessoa jurídica de direito privado domiciliada em Teutônia/RS,
          é responsável pela plataforma <strong>Minha Fila</strong> (minhafila.meugarcom.app) e atua como{' '}
          <strong>controladora</strong> dos dados pessoais coletados neste serviço, nos termos da
          Lei Geral de Proteção de Dados (Lei 13.709/2018 — LGPD).
        </p>
        <p>
          Esta Política descreve quais dados coletamos, como os utilizamos, com quem os compartilhamos
          e quais são seus direitos como titular.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">2. Dados que Coletamos</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Dados de conta:</strong> nome e endereço de e-mail fornecidos via Google OAuth
            ou magic link de acesso.
          </li>
          <li>
            <strong>Dados operacionais:</strong> filas criadas, nomes de filas, tickets gerados,
            configurações de atendimento e histórico de operação — gerados durante o uso da plataforma.
          </li>
          <li>
            <strong>Dados de pagamento:</strong> processados integralmente pelo Mercado Pago. Não
            armazenamos dados de cartão de crédito em nossos servidores.
          </li>
          <li>
            <strong>Dados técnicos:</strong> logs técnicos podem incluir endereço IP, tipo de
            navegador, sistema operacional e horários de acesso, coletados para fins de segurança e
            diagnóstico.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">3. Bases Legais do Tratamento</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Execução de contrato</strong> — criação e manutenção da conta, operação das filas e processamento de assinaturas;</li>
          <li><strong>Cumprimento de obrigação legal</strong> — retenção de registros fiscais e atendimento a ordens judiciais;</li>
          <li><strong>Legítimo interesse</strong> — segurança da plataforma, prevenção a fraudes, logs de diagnóstico e monitoramento de erros;</li>
          <li><strong>Consentimento</strong> — cookies analíticos do Google Analytics, coletado via banner de cookies e revogável a qualquer momento.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">4. Compartilhamento e Subprocessadores</h3>
        <p>Não vendemos seus dados. Compartilhamos apenas com subprocessadores necessários à operação:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Mercado Pago</strong> — processamento de pagamentos e gestão de assinaturas;</li>
          <li><strong>Google LLC</strong> — autenticação via Google OAuth; análise de métricas agregadas via Google Analytics (apenas com consentimento);</li>
          <li><strong>Sentry, Inc.</strong> — monitoramento de erros no servidor (backend), com base em legítimo interesse de segurança;</li>
          <li><strong>Provedor de hospedagem / infraestrutura</strong> — armazenamento seguro dos dados em servidores.</li>
        </ul>
        <p>
          Podemos divulgar dados quando exigido por lei, regulação ou ordem judicial, comunicando
          você sempre que legalmente possível.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">5. Transferência Internacional de Dados</h3>
        <p>
          O Mercado Pago processa os dados de pagamento no Brasil. Subprocessadores como o Google
          operam nos Estados Unidos; para esses, adotamos salvaguardas contratuais e verificamos que
          oferecem nível de proteção compatível com a LGPD, conforme orientações da ANPD.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">6. Segurança das Informações</h3>
        <p>
          Adotamos medidas técnicas e administrativas compatíveis com padrões atuais de segurança,
          incluindo criptografia em trânsito (TLS) e controles de acesso por função. Nenhum sistema
          é totalmente isento de riscos; caso identifiquemos um incidente que afete seus dados,
          notificaremos a ANPD e os titulares em prazo razoável conforme a legislação.
        </p>
        <p>Não utilizamos seus dados para treinar modelos de inteligência artificial.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">7. Retenção de Dados</h3>
        <p>
          Mantemos seus dados enquanto a conta estiver ativa e pelo período exigido por obrigações
          legais ou fiscais. Logs técnicos são retidos por até 12 meses. Dados operacionais podem
          permanecer em backups por prazo técnico adicional, sendo depois excluídos ou anonimizados.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">8. Cookies e Armazenamento Local</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Essenciais:</strong> necessários para autenticação e funcionamento básico da
            plataforma. Não requerem consentimento.
          </li>
          <li>
            <strong>Analíticos (Google Analytics):</strong> coletam métricas agregadas de navegação
            para melhorar o serviço. Ativados apenas mediante consentimento no banner de cookies,
            revogável a qualquer momento limpando os cookies do navegador.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">9. Seus Direitos (LGPD)</h3>
        <p>Como titular, você tem direito a:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Confirmar a existência de tratamento e acessar seus dados;</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>Solicitar anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Solicitar a portabilidade dos seus dados;</li>
          <li>Revogar consentimento a qualquer momento;</li>
          <li>Obter informações sobre compartilhamento com terceiros;</li>
          <li>Apresentar reclamação à ANPD.</li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato pelo e-mail{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>
          , que também atua como canal do encarregado pelo tratamento de dados (DPO).
          Responderemos preferencialmente em até 15 dias úteis, observada a legislação aplicável.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">10. Alterações nesta Política</h3>
        <p>
          Podemos atualizar esta Política periodicamente. Alterações relevantes serão comunicadas
          pelo e-mail cadastrado ou por aviso na plataforma. A data de última atualização consta
          no topo deste documento.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">11. Contato</h3>
        <p>
          Dúvidas sobre privacidade e proteção de dados:{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>
        </p>
      </section>
    </div>
  )
}
