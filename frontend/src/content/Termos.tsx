import type { AppLocale } from '@/lib/i18n'

function TermosPt() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Última atualização: maio de 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Aceitação dos Termos</h3>
        <p>
          Ao criar uma conta ou utilizar a plataforma <strong>Minha Fila</strong>, o usuário ou
          empresa (denominado &quot;Cliente&quot;) concorda integralmente com estes Termos de Uso. Caso não
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
          pelo Mercado Pago. Um período de avaliação gratuita pode ser oferecido conforme indicado no
          cadastro. Assinaturas no cartão renovam automaticamente (mensal ou anualmente) até que o
          Cliente solicite o cancelamento; pagamentos via Pix não são recorrentes e valem por um único
          ciclo. O cancelamento encerra a renovação futura; o acesso permanece ativo até o fim do
          período já pago.
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
          O serviço é fornecido &quot;no estado em que se encontra&quot;. Não oferecemos garantias expressas
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
          O Minha Fila utiliza serviços de terceiros como Mercado Pago (pagamentos) e Google (autenticação
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

function TermosEn() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: May 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Acceptance of Terms</h3>
        <p>
          By creating an account or using the <strong>Minha Fila</strong> platform, the user or
          business (the &quot;Customer&quot;) fully agrees to these Terms of Use. If you do not agree
          with any provision, do not use the service.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">2. Service Description</h3>
        <p>Minha Fila is a SaaS digital queue management platform that provides:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Creation and management of virtual queues with automatic sequential numbering;</li>
          <li>An admin dashboard to control ticket status in real time;</li>
          <li>Public queue access via QR Code or direct link;</li>
          <li>Real-time notifications and updates via WebSocket;</li>
          <li>Management of multiple businesses and locations per account.</li>
        </ul>
        <p>The service is intended for businesses, entrepreneurs, and professionals in their operations.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">3. Account and Responsibility</h3>
        <p>
          The Customer is responsible for keeping access credentials confidential and for all actions
          performed under the account. If unauthorized access is suspected, notify{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>{' '}
          immediately.
        </p>
        <p>Registration information must be accurate and kept up to date.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">4. License</h3>
        <p>
          Minha Fila grants the Customer a limited, non-exclusive, non-transferable, and revocable
          license to use the platform during an active subscription, subject to these Terms. This
          license does not transfer any intellectual property rights in the platform, code, design, or brand.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">5. Acceptable Use and Restrictions</h3>
        <p>The Customer agrees not to:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Resell or sublicense access to the platform to third parties;</li>
          <li>Reverse engineer, decompile, or attempt to extract source code;</li>
          <li>Use the service for illegal, fraudulent purposes, or in violation of third-party rights;</li>
          <li>Run automated scraping or any action that harms availability for other customers;</li>
          <li>Remove or obscure Minha Fila copyright or trademark notices.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">6. User Content</h3>
        <p>
          The Customer is solely responsible for content entered on the platform (queue names,
          settings, descriptions), including accuracy and legal compliance. Minha Fila hosts that
          content without assuming responsibility for what the Customer configures or makes public.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">7. Plans, Payment, and Renewal</h3>
        <p>
          Full access requires a paid plan processed by our payment provider. A free evaluation period
          may be offered as indicated at signup. Card subscriptions renew automatically (monthly or
          yearly) until the Customer cancels; one-time payment methods cover a single billing cycle.
          Cancellation stops future renewal; access remains active until the end of the paid period.
        </p>
        <p>
          If payment fails, access may be suspended after email notice. We do not refund partially
          used periods except where required by law.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">8. Service Availability</h3>
        <p>
          We aim for high availability but do not guarantee uninterrupted operation. Planned
          maintenance will be communicated with reasonable notice. Brief outages due to maintenance,
          updates, or technical failures do not entitle credits, refunds, or damages unless a specific
          contract says otherwise.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">9. Disclaimer of Warranties</h3>
        <p>
          The service is provided &quot;as is&quot;. We offer no express or implied warranties of fitness for a
          particular purpose, freedom from errors, or operational results. Using the platform does not
          replace the Customer&apos;s internal processes and staff training.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">10. Limitation of Liability</h3>
        <p>
          In no event shall Minha Fila be liable for indirect damages, lost profits, data loss, or
          consequential damages. Our total liability to the Customer is limited to amounts paid in the
          three months before the event giving rise to the claim. Damages from the Customer&apos;s internet
          failures or operational errors by the Customer&apos;s staff are expressly excluded.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">11. Privacy and Data Protection (LGPD / GDPR / CCPA)</h3>
        <p>
          Minha Fila (BigWorks) acts as <strong>controller</strong> of personal data of the account
          holder (name, email, access data), under Brazil&apos;s LGPD (Law 13.709/2018). Where applicable,
          we also consider rights and principles under the GDPR and CCPA in a general manner for
          international visitors.
        </p>
        <p>
          For operational data generated by the Customer (queues, tickets, settings), the Customer
          remains the <strong>controller</strong> and Minha Fila acts as <strong>processor</strong>,
          processing that data solely to provide the contracted service.
        </p>
        <p>Data processing is governed by our <strong>Privacy Policy</strong>.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">12. Suspension and Termination</h3>
        <p>
          Minha Fila may suspend or terminate Customer access, with prior notice or immediately
          depending on severity, in cases including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Non-payment for more than 7 calendar days after due date;</li>
          <li>Violation of any provision of these Terms;</li>
          <li>Illegal or fraudulent use of the platform;</li>
          <li>Abusive behavior toward support staff;</li>
          <li>Judicial or regulatory order.</li>
        </ul>
        <p>
          The Customer may close the account at any time by emailing{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">13. Data After Termination</h3>
        <p>
          After account closure, the Customer has up to 30 days to request export of data (queues,
          ticket history). After that period, data may be deleted from active systems. Backup copies
          may persist for an additional technical period and are then deleted or anonymized.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">14. Third-Party Integrations</h3>
        <p>
          Minha Fila uses third-party services for payments, authentication, and analytics. Use of
          those services is subject to each provider&apos;s policies. We are not responsible for failures,
          changes, or discontinuation of third-party services.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">15. Changes to These Terms</h3>
        <p>
          We may modify these Terms at any time. Material changes will be communicated at least 15 days
          in advance via the registered email or an in-product notice. Continued use after changes take
          effect constitutes acceptance.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">16. Governing Law and Venue</h3>
        <p>
          These Terms are governed by Brazilian law, including the Civil Code and the LGPD. The courts
          of Teutônia/RS, Brazil, are elected to resolve disputes, with waiver of any other venue
          except where mandatory law provides otherwise.
        </p>
      </section>
    </div>
  )
}

function TermosEs() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Última actualización: mayo de 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Aceptación de los Términos</h3>
        <p>
          Al crear una cuenta o utilizar la plataforma <strong>Minha Fila</strong>, el usuario o
          empresa (el &quot;Cliente&quot;) acepta íntegramente estos Términos de Uso. Si no está de
          acuerdo con alguna disposición, no utilice el servicio.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">2. Descripción del Servicio</h3>
        <p>Minha Fila es una plataforma SaaS de gestión de filas digitales que ofrece:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Creación y gestión de filas virtuales con numeración secuencial automática;</li>
          <li>Panel administrativo para controlar el estado de los tickets en tiempo real;</li>
          <li>Acceso público a la fila mediante código QR o enlace directo;</li>
          <li>Notificaciones y actualizaciones en tiempo real vía WebSocket;</li>
          <li>Gestión de múltiples empresas y establecimientos por cuenta.</li>
        </ul>
        <p>El servicio está destinado a empresas, emprendedores y profesionales en sus operaciones.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">3. Cuenta y Responsabilidad</h3>
        <p>
          El Cliente es responsable de mantener las credenciales en secreto y de todas las acciones
          realizadas bajo su cuenta. Ante sospecha de acceso no autorizado, debe notificar de inmediato a{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>.
        </p>
        <p>La información del registro debe ser precisa y mantenerse actualizada.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">4. Licencia de Uso</h3>
        <p>
          Minha Fila otorga al Cliente una licencia limitada, no exclusiva, intransferible y revocable
          para usar la plataforma durante una suscripción activa, conforme estos Términos. Esta licencia
          no transfiere derechos de propiedad intelectual sobre la plataforma, código, diseño o marca.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">5. Uso Aceptable y Restricciones</h3>
        <p>El Cliente acepta no:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Revender o sublicenciar el acceso a terceros;</li>
          <li>Realizar ingeniería inversa, descompilar o intentar extraer el código fuente;</li>
          <li>Usar el servicio con fines ilegales, fraudulentos o que violen derechos de terceros;</li>
          <li>Ejecutar scraping automatizado o acciones que perjudiquen la disponibilidad para otros clientes;</li>
          <li>Eliminar u ocultar avisos de derechos de autor o marcas de Minha Fila.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">6. Contenido del Usuario</h3>
        <p>
          El Cliente es el único responsable del contenido registrado (nombres de filas, ajustes,
          descripciones), incluida su veracidad y cumplimiento legal. Minha Fila aloja ese contenido
          sin asumir responsabilidad por lo que el Cliente configure o publique.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">7. Planes, Pago y Renovación</h3>
        <p>
          El acceso completo requiere un plan de pago procesado por nuestro proveedor de pagos. Puede
          ofrecerse un periodo de evaluación gratuito según lo indicado en el registro. Las suscripciones
          con tarjeta se renuevan automáticamente (mensual o anual) hasta que el Cliente cancele; los
          pagos únicos cubren un solo ciclo. La cancelación detiene renovaciones futuras; el acceso
          permanece activo hasta el final del periodo ya pagado.
        </p>
        <p>
          Ante fallo de pago, el acceso puede suspenderse tras aviso por correo. No reembolsamos
          periodos parcialmente usados salvo cuando la ley lo exija.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">8. Disponibilidad del Servicio</h3>
        <p>
          Buscamos alta disponibilidad, pero no garantizamos operación ininterrumpida. Los
          mantenimientos programados se comunicarán con antelación razonable. Interrupciones breves por
          mantenimiento, actualizaciones o fallos técnicos no generan derecho a crédito, reembolso o
          indemnización, salvo contrato específico.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">9. Exención de Garantías</h3>
        <p>
          El servicio se ofrece &quot;tal cual&quot;. No ofrecemos garantías expresas o implícitas de idoneidad
          para un fin concreto, ausencia de errores o resultados operativos. El uso de la plataforma no
          sustituye los procesos internos ni la formación del equipo del Cliente.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">10. Limitación de Responsabilidad</h3>
        <p>
          En ningún caso Minha Fila será responsable de daños indirectos, lucro cesante, pérdida de
          datos o daños consecuentes. Nuestra responsabilidad total frente al Cliente se limita a lo
          pagado en los tres meses anteriores al hecho que originó la reclamación. Quedan excluidos los
          daños por fallo de conexión a internet del Cliente y errores operativos de su equipo.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">11. Privacidad y Protección de Datos (LGPD)</h3>
        <p>
          Minha Fila (BigWorks) actúa como <strong>responsable del tratamiento</strong> de los datos
          personales del titular de la cuenta (nombre, correo, datos de acceso), conforme a la LGPD
          brasileña (Ley 13.709/2018). Cuando corresponda, también consideramos de forma general
          principios del GDPR y CCPA para visitantes internacionales.
        </p>
        <p>
          Respecto a los datos operativos generados por el Cliente (filas, tickets, ajustes), el Cliente
          permanece como <strong>responsable</strong> y Minha Fila actúa como <strong>encargado</strong>,
          tratando esos datos solo para prestar el servicio contratado.
        </p>
        <p>El tratamiento se rige por nuestra <strong>Política de Privacidad</strong>.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">12. Suspensión y Rescisión</h3>
        <p>
          Minha Fila puede suspender o cerrar el acceso del Cliente, con aviso previo o de inmediato
          según la gravedad, en casos como:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Impago por más de 7 días corridos tras el vencimiento;</li>
          <li>Violación de cualquier disposición de estos Términos;</li>
          <li>Uso ilegal o fraudulento de la plataforma;</li>
          <li>Comportamiento abusivo con el equipo de soporte;</li>
          <li>Orden judicial o regulatoria.</li>
        </ul>
        <p>
          El Cliente puede cerrar su cuenta en cualquier momento escribiendo a{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">13. Datos tras la Rescisión</h3>
        <p>
          Tras el cierre de la cuenta, el Cliente tendrá hasta 30 días para solicitar la exportación de
          sus datos (filas, historial de tickets). Transcurrido ese plazo, los datos podrán eliminarse
          de los sistemas activos. Las copias de respaldo pueden persistir un plazo técnico adicional y
          luego se eliminan o anonimizan.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">14. Integraciones y Servicios de Terceros</h3>
        <p>
          Minha Fila utiliza servicios de terceros para pagos, autenticación y analítica. Su uso está
          sujeto a las políticas de cada proveedor. No asumimos responsabilidad por fallos, cambios o
          discontinuación de servicios de terceros.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">15. Modificaciones de los Términos</h3>
        <p>
          Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios
          relevantes se comunicarán con al menos 15 días de antelación por el correo registrado o aviso
          en la plataforma. El uso continuado tras la vigencia constituye aceptación.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">16. Ley Aplicable y Fuero</h3>
        <p>
          Estos Términos se rigen por la legislación brasileña, en especial el Código Civil y la LGPD.
          Se elige el fuero de la Comarca de Teutônia/RS para resolver controversias, con renuncia a
          cualquier otro, salvo disposición legal imperativa en contrario.
        </p>
      </section>
    </div>
  )
}

export function Termos({ locale = 'pt_BR' }: { locale?: AppLocale }) {
  if (locale === 'en') return <TermosEn />
  if (locale === 'es') return <TermosEs />
  return <TermosPt />
}
