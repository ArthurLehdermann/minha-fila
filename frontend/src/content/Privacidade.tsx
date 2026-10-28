import type { AppLocale } from '@/lib/i18n'

function PrivacidadePt() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Última atualização: maio de 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Quem Somos</h3>
        <p>
          A <strong>BigWorks</strong>, pessoa jurídica de direito privado domiciliada em Teutônia/RS,
          é responsável pela plataforma <strong>Minha Fila</strong> (minha-fila.meugarcom.app) e atua como{' '}
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

function PrivacidadeEn() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Last updated: May 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Who We Are</h3>
        <p>
          <strong>BigWorks</strong>, a private legal entity based in Teutônia/RS, Brazil, operates the{' '}
          <strong>Minha Fila</strong> platform (minha-fila.meugarcom.app) and acts as{' '}
          <strong>controller</strong> of personal data collected in this service under Brazil&apos;s
          General Data Protection Law (Law 13.709/2018 — LGPD). For international visitors we also
          describe rights in light of the GDPR and CCPA in a general way.
        </p>
        <p>
          This Policy explains what data we collect, how we use it, with whom we share it, and your
          rights as a data subject.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">2. Data We Collect</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Account data:</strong> name and email provided via Google OAuth or magic-link access.
          </li>
          <li>
            <strong>Operational data:</strong> queues created, queue names, tickets, service settings,
            and operation history — generated while using the platform.
          </li>
          <li>
            <strong>Payment data:</strong> processed entirely by our payment provider. We do not store
            credit card numbers on our servers.
          </li>
          <li>
            <strong>Technical data:</strong> logs may include IP address, browser type, operating system,
            and access times, collected for security and diagnostics.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">3. Legal Bases for Processing</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Contract performance</strong> — account creation and maintenance, queue operation, and subscription processing;</li>
          <li><strong>Legal obligation</strong> — retention of fiscal records and compliance with court orders;</li>
          <li><strong>Legitimate interest</strong> — platform security, fraud prevention, diagnostic logs, and error monitoring;</li>
          <li><strong>Consent</strong> — Google Analytics cookies, collected via the cookie banner and revocable at any time.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">4. Sharing and Subprocessors</h3>
        <p>We do not sell your data. We share only with subprocessors needed to run the service:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Payment provider</strong> — payment processing and subscription management;</li>
          <li><strong>Google LLC</strong> — Google OAuth authentication; aggregated analytics via Google Analytics (only with consent);</li>
          <li><strong>Sentry, Inc.</strong> — server-side error monitoring, based on legitimate security interest;</li>
          <li><strong>Hosting / infrastructure provider</strong> — secure storage of data on servers.</li>
        </ul>
        <p>
          We may disclose data when required by law, regulation, or court order, notifying you whenever
          legally possible.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">5. International Data Transfers</h3>
        <p>
          Payment data is processed according to our payment provider&apos;s regions. Subprocessors such as
          Google may operate in the United States; for those we use contractual safeguards and verify a
          level of protection compatible with the LGPD, following ANPD guidance. GDPR-style transfer
          safeguards may also apply where relevant.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">6. Information Security</h3>
        <p>
          We adopt technical and administrative measures aligned with current security standards,
          including encryption in transit (TLS) and role-based access controls. No system is fully free
          of risk; if we identify an incident affecting your data, we will notify the ANPD and data
          subjects within a reasonable time as required by law.
        </p>
        <p>We do not use your data to train artificial intelligence models.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">7. Data Retention</h3>
        <p>
          We keep your data while the account is active and for periods required by legal or tax
          obligations. Technical logs are retained for up to 12 months. Operational data may remain in
          backups for an additional technical period, then deleted or anonymized.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">8. Cookies and Local Storage</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Essential:</strong> required for authentication and basic platform operation. No
            consent required.
          </li>
          <li>
            <strong>Analytics (Google Analytics):</strong> collect aggregated browsing metrics to improve
            the service. Enabled only with consent via the cookie banner; revocable anytime by clearing
            browser cookies.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">9. Your Rights (LGPD, and generally GDPR / CCPA)</h3>
        <p>As a data subject you may:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Confirm whether processing exists and access your data;</li>
          <li>Correct incomplete, inaccurate, or outdated data;</li>
          <li>Request anonymization, blocking, or deletion of unnecessary data;</li>
          <li>Request portability of your data;</li>
          <li>Withdraw consent at any time;</li>
          <li>Obtain information about sharing with third parties;</li>
          <li>Lodge a complaint with the ANPD (Brazil) or, where applicable, another supervisory authority under the GDPR, or exercise CCPA-style access/deletion requests for California residents in a general manner.</li>
        </ul>
        <p>
          To exercise these rights, contact{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>
          , which also serves as our data protection contact (DPO channel). We aim to respond within 15
          business days, subject to applicable law.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">10. Changes to This Policy</h3>
        <p>
          We may update this Policy periodically. Material changes will be communicated via the
          registered email or an in-product notice. The last-updated date appears at the top of this
          document.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">11. Contact</h3>
        <p>
          Questions about privacy and data protection:{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>
        </p>
      </section>
    </div>
  )
}

function PrivacidadeEs() {
  return (
    <div className="space-y-6 text-sm leading-relaxed">
      <p className="text-xs text-gray-500 dark:text-gray-400">Última actualización: mayo de 2026</p>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">1. Quiénes Somos</h3>
        <p>
          <strong>BigWorks</strong>, persona jurídica de derecho privado domiciliada en Teutônia/RS
          (Brasil), es responsable de la plataforma <strong>Minha Fila</strong> (minha-fila.meugarcom.app)
          y actúa como <strong>responsable del tratamiento</strong> de los datos personales recogidos
          en este servicio, conforme a la Ley General de Protección de Datos de Brasil (Ley 13.709/2018 — LGPD).
          Para visitantes internacionales también describimos derechos a la luz del GDPR y CCPA de forma general.
        </p>
        <p>
          Esta Política describe qué datos recopilamos, cómo los usamos, con quién los compartimos y
          cuáles son tus derechos como titular.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">2. Datos que Recopilamos</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Datos de cuenta:</strong> nombre y correo electrónico proporcionados vía Google OAuth
            o enlace mágico de acceso.
          </li>
          <li>
            <strong>Datos operativos:</strong> filas creadas, nombres de filas, tickets generados,
            ajustes de atención e historial de operación — generados durante el uso de la plataforma.
          </li>
          <li>
            <strong>Datos de pago:</strong> procesados íntegramente por nuestro proveedor de pagos. No
            almacenamos datos de tarjeta de crédito en nuestros servidores.
          </li>
          <li>
            <strong>Datos técnicos:</strong> los registros pueden incluir dirección IP, tipo de
            navegador, sistema operativo y horarios de acceso, recopilados por seguridad y diagnóstico.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">3. Bases Legales del Tratamiento</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Ejecución de contrato</strong> — creación y mantenimiento de la cuenta, operación de filas y procesamiento de suscripciones;</li>
          <li><strong>Cumplimiento de obligación legal</strong> — retención de registros fiscales y atención a órdenes judiciales;</li>
          <li><strong>Interés legítimo</strong> — seguridad de la plataforma, prevención de fraudes, logs de diagnóstico y monitoreo de errores;</li>
          <li><strong>Consentimiento</strong> — cookies analíticas de Google Analytics, recogidas vía banner de cookies y revocables en cualquier momento.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">4. Compartición y Subencargados</h3>
        <p>No vendemos tus datos. Compartimos solo con subencargados necesarios para la operación:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li><strong>Proveedor de pagos</strong> — procesamiento de pagos y gestión de suscripciones;</li>
          <li><strong>Google LLC</strong> — autenticación vía Google OAuth; análisis agregado vía Google Analytics (solo con consentimiento);</li>
          <li><strong>Sentry, Inc.</strong> — monitoreo de errores en el servidor, con base en interés legítimo de seguridad;</li>
          <li><strong>Proveedor de hosting / infraestructura</strong> — almacenamiento seguro de datos en servidores.</li>
        </ul>
        <p>
          Podemos divulgar datos cuando lo exija la ley, regulación u orden judicial, comunicándote
          siempre que sea legalmente posible.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">5. Transferencia Internacional de Datos</h3>
        <p>
          Los datos de pago se procesan según las regiones de nuestro proveedor. Subencargados como
          Google pueden operar en Estados Unidos; para ellos adoptamos salvaguardas contractuales y
          verificamos un nivel de protección compatible con la LGPD, según orientaciones de la ANPD.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">6. Seguridad de la Información</h3>
        <p>
          Adoptamos medidas técnicas y administrativas alineadas con estándares actuales de seguridad,
          incluida cifrado en tránsito (TLS) y controles de acceso por rol. Ningún sistema está libre de
          riesgos; si identificamos un incidente que afecte tus datos, notificaremos a la ANPD y a los
          titulares en un plazo razonable conforme a la ley.
        </p>
        <p>No utilizamos tus datos para entrenar modelos de inteligencia artificial.</p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">7. Retención de Datos</h3>
        <p>
          Conservamos tus datos mientras la cuenta esté activa y por el periodo exigido por
          obligaciones legales o fiscales. Los logs técnicos se retienen hasta 12 meses. Los datos
          operativos pueden permanecer en respaldos por un plazo técnico adicional y luego se eliminan
          o anonimizan.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">8. Cookies y Almacenamiento Local</h3>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Esenciales:</strong> necesarios para autenticación y funcionamiento básico. No
            requieren consentimiento.
          </li>
          <li>
            <strong>Analíticos (Google Analytics):</strong> recopilan métricas agregadas de navegación
            para mejorar el servicio. Se activan solo con consentimiento en el banner de cookies,
            revocable en cualquier momento borrando las cookies del navegador.
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">9. Tus Derechos (LGPD)</h3>
        <p>Como titular, tienes derecho a:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Confirmar la existencia de tratamiento y acceder a tus datos;</li>
          <li>Corregir datos incompletos, inexactos o desactualizados;</li>
          <li>Solicitar anonimización, bloqueo o eliminación de datos innecesarios;</li>
          <li>Solicitar la portabilidad de tus datos;</li>
          <li>Revocar el consentimiento en cualquier momento;</li>
          <li>Obtener información sobre compartición con terceros;</li>
          <li>Presentar reclamación ante la ANPD (y, cuando corresponda, ejercer derechos análogos del GDPR/CCPA de forma general).</li>
        </ul>
        <p>
          Para ejercer estos derechos, escribe a{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>
          , que también actúa como canal del encargado de protección de datos (DPO).
          Responderemos preferentemente en hasta 15 días hábiles, observada la legislación aplicable.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">10. Cambios en esta Política</h3>
        <p>
          Podemos actualizar esta Política periódicamente. Los cambios relevantes se comunicarán por
          el correo registrado o aviso en la plataforma. La fecha de última actualización figura al
          inicio de este documento.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">11. Contacto</h3>
        <p>
          Dudas sobre privacidad y protección de datos:{' '}
          <a href="mailto:lgpd@meugarcom.app" className="underline text-brand-400 hover:text-brand-300">
            lgpd@meugarcom.app
          </a>
        </p>
      </section>
    </div>
  )
}

export function Privacidade({ locale = 'pt_BR' }: { locale?: AppLocale }) {
  if (locale === 'en') return <PrivacidadeEn />
  if (locale === 'es') return <PrivacidadeEs />
  return <PrivacidadePt />
}
