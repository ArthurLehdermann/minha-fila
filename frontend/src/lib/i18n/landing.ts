import type { Metadata } from 'next'
import { type AppLocale, toBcp47 } from './locales'

export const SITE_ORIGIN = 'https://minha-fila.meugarcom.app'

export const LANDING_LOCALES: AppLocale[] = ['pt_BR', 'en', 'es']

/** Path da landing por locale (`/` = pt-BR). */
export function landingPath(locale: AppLocale): string {
  if (locale === 'en') return '/en'
  if (locale === 'es') return '/es'
  return '/'
}

/** Locale da landing a partir do pathname (`/en`, `/es`, `/`). */
export function localeFromLandingPath(pathname: string): AppLocale | null {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  if (pathname === '/es' || pathname.startsWith('/es/')) return 'es'
  if (pathname === '/') return 'pt_BR'
  return null
}

/** Login já no idioma da landing. */
export function loginHref(locale: AppLocale): string {
  const lang = locale === 'pt_BR' ? 'pt_BR' : locale
  return `/auth/login?lang=${lang}`
}

type LandingDict = Record<string, string>

const pt_BR: LandingDict = {
  'nav.login': 'Entrar',
  'nav.cta': 'Criar minha fila grátis',
  'nav.theme': 'Alternar tema',
  'nav.language': 'Idioma',

  'hero.badge': '🔥 Fila digital para qualquer atendimento',
  'hero.title1': 'Chega de fila bagunçada',
  'hero.title2': 'no seu atendimento.',
  'hero.sub':
    'Organize os atendimentos, elimine a confusão e chame com agilidade. Tudo pelo celular, sem instalar nada.',
  'hero.cta': 'Criar minha fila grátis →',
  'hero.how': 'Ver como funciona',
  'hero.trial': '30 dias grátis · Sem cartão de crédito',
  'hero.mockLive': 'Atendimento ao vivo',
  'hero.mockStatus1': 'Em andamento',
  'hero.mockStatus2': 'Na fila',
  'hero.mockStatus3': 'Concluído',
  'hero.mockName1': 'Carlos',
  'hero.mockName2': 'Fernanda',
  'hero.mockName3': 'Rafael',

  'dor.eyebrow': 'Você conhece esse caos',
  'dor.title': 'Parece familiar?',
  'dor.1': '"Minha senha já foi chamada?" — a pessoa pergunta pela quinta vez.',
  'dor.2': 'Chamado perdido porque a ordem estava só na cabeça da equipe.',
  'dor.3': 'Quem chegou depois foi atendido antes. Confusão na hora.',
  'dor.4': 'Gritaria para organizar a fila em ambiente lotado...',

  'solucao.eyebrow': 'A solução',
  'solucao.title': 'Fila inteligente, operação tranquila',
  'solucao.sub':
    'Cada pessoa sabe sua posição. Você sabe quem é o próximo. Sem papel, sem totem, sem app.',
  'solucao.step1.title': 'Pessoa acessa o QR Code',
  'solucao.step1.desc': 'Na recepção, balcão ou entrada. Sem app para instalar.',
  'solucao.step2.title': 'Entra na fila automaticamente',
  'solucao.step2.desc': 'Situação das senhas em tempo real no painel da equipe.',
  'solucao.step3.title': 'Chamado quando for a vez',
  'solucao.step3.desc': 'Notificação no celular. Sem grito, sem confusão.',

  'diff.title': 'Sem complicação, sem desculpa',
  'diff.1.title': 'Sem app',
  'diff.1.desc': 'A pessoa acompanha pelo navegador. Zero instalação.',
  'diff.2.title': 'Sem hardware',
  'diff.2.desc': 'Sem totem, sem senha física, sem equipamento.',
  'diff.3.title': '5 minutos',
  'diff.3.desc': 'Da conta criada até a primeira fila funcionando.',

  'pricing.eyebrow': 'Preço',
  'pricing.title': 'Simples assim',
  'pricing.monthly': 'Mensal',
  'pricing.monthlyPrice': 'R$ 9,90',
  'pricing.monthlyPeriod': '/mês',
  'pricing.monthlyNote': 'Cancele quando quiser',
  'pricing.yearly': 'Anual',
  'pricing.yearlyPrice': 'R$ 99,90',
  'pricing.yearlyPeriod': '/ano',
  'pricing.yearlyNote': 'Menos de R$ 8,33/mês',
  'pricing.badge': 'MELHOR VALOR',
  'pricing.cta': 'Começar grátis →',
  'pricing.trial': '30 dias grátis em qualquer plano. Sem cartão de crédito.',

  'cta.title1': 'Sua fila começa hoje.',
  'cta.title2': 'Grátis por 30 dias.',
  'cta.sub': 'Sem cartão. Sem contrato. Sem enrolação.',
  'cta.button': 'Criar minha fila grátis →',

  'footer.copy': '© 2026 Minha Fila · Fila virtual para qualquer operação',
  'footer.privacy': 'Privacidade',
  'footer.terms': 'Termos de Uso',
  'footer.login': 'Entrar',
  'footer.privacyTitle': 'Política de Privacidade',
  'footer.termsTitle': 'Termos de Uso',
  'footer.legalUpdated': 'Última atualização: maio de 2026',
  'footer.close': 'Fechar',

  'seo.title': 'Minha Fila | Gestão de Fila Digital',
  'seo.description':
    'Plataforma profissional para gestão de fila digital com atualização em tempo real, painel administrativo e entrada via QR Code.',
  'seo.ogDescription':
    'Modernize seu atendimento com fila digital responsiva, atualização em tempo real e gestão profissional.',
  'seo.twitterDescription':
    'Fila digital moderna para negócios com operação eficiente e experiência fluida.',
  'seo.ogAlt': 'Minha Fila - Gestão de Fila Digital',
  'seo.keywords': 'fila digital, gestão de filas, QR Code, painel administrativo, SaaS',
}

const en: LandingDict = {
  'nav.login': 'Log in',
  'nav.cta': 'Start free queue',
  'nav.theme': 'Toggle theme',
  'nav.language': 'Language',

  'hero.badge': '🔥 Digital queue for any walk-in business',
  'hero.title1': 'Stop the chaos',
  'hero.title2': 'at your front desk.',
  'hero.sub':
    'Keep guests in order, skip the shouting, and call the next person from your phone. Works in the browser — no app to install. Built for restaurants, clinics, barbershops, and retail.',
  'hero.cta': 'Create my free queue →',
  'hero.how': 'See how it works',
  'hero.trial': '30-day free trial · No credit card',
  'hero.mockLive': 'Live queue',
  'hero.mockStatus1': 'Being served',
  'hero.mockStatus2': 'Waiting',
  'hero.mockStatus3': 'Done',
  'hero.mockName1': 'Alex',
  'hero.mockName2': 'Maya',
  'hero.mockName3': 'Jordan',

  'dor.eyebrow': 'Sound familiar?',
  'dor.title': 'The daily queue chaos',
  'dor.1': '"Was my number already called?" — asked for the fifth time.',
  'dor.2': 'Someone skipped because the order lived only in a staff member\'s head.',
  'dor.3': 'A late arrival got served first. Awkward silence at the counter.',
  'dor.4': 'Shouting names across a crowded waiting area...',

  'solucao.eyebrow': 'The fix',
  'solucao.title': 'A calm queue. A clear next guest.',
  'solucao.sub':
    'Everyone sees their place in line. Your team always knows who is next. No paper tickets, no kiosk, no app download.',
  'solucao.step1.title': 'Guest scans the QR code',
  'solucao.step1.desc': 'At the entrance or counter. Opens in the phone browser.',
  'solucao.step2.title': 'They join the queue instantly',
  'solucao.step2.desc': 'Live status on your staff dashboard.',
  'solucao.step3.title': 'Called when it is their turn',
  'solucao.step3.desc': 'Phone notification. No shouting, no confusion.',

  'diff.title': 'Simple on purpose',
  'diff.1.title': 'No app',
  'diff.1.desc': 'Guests follow along in the browser. Zero installs.',
  'diff.2.title': 'No hardware',
  'diff.2.desc': 'No ticket printer, no totem, no extra gear.',
  'diff.3.title': '5 minutes',
  'diff.3.desc': 'From signup to a working queue on the floor.',

  'pricing.eyebrow': 'Pricing',
  'pricing.title': 'Simple pricing',
  'pricing.monthly': 'Monthly',
  'pricing.monthlyPrice': 'US$ 9',
  'pricing.monthlyPeriod': '/mo',
  'pricing.monthlyNote': 'Cancel anytime',
  'pricing.yearly': 'Yearly',
  'pricing.yearlyPrice': 'US$ 90',
  'pricing.yearlyPeriod': '/yr',
  'pricing.yearlyNote': 'Two months free',
  'pricing.badge': 'BEST VALUE',
  'pricing.cta': 'Start free →',
  'pricing.trial': '30-day free trial on any plan. No credit card required.',

  'cta.title1': 'Your queue starts today.',
  'cta.title2': 'Free for 30 days.',
  'cta.sub': 'No card. No lock-in. No fluff.',
  'cta.button': 'Create my free queue →',

  'footer.copy': '© 2026 Minha Fila · Virtual queue for any walk-in operation',
  'footer.privacy': 'Privacy',
  'footer.terms': 'Terms of Use',
  'footer.login': 'Log in',
  'footer.privacyTitle': 'Privacy Policy',
  'footer.termsTitle': 'Terms of Use',
  'footer.legalUpdated': 'Last updated: May 2026',
  'footer.close': 'Close',

  'seo.title': 'Minha Fila | Digital Queue Management',
  'seo.description':
    'Digital queue software for restaurants, clinics, barbershops, and shops — live updates, admin dashboard, and QR Code check-in.',
  'seo.ogDescription':
    'Modernize walk-in service with a responsive digital queue, real-time updates, and a simple staff panel.',
  'seo.twitterDescription':
    'Digital queue for busy businesses — orderly service without paper tickets or hardware.',
  'seo.ogAlt': 'Minha Fila - Digital Queue Management',
  'seo.keywords': 'digital queue, queue management, QR Code, walk-in, SaaS',
}

const es: LandingDict = {
  'nav.login': 'Entrar',
  'nav.cta': 'Crear mi fila gratis',
  'nav.theme': 'Cambiar tema',
  'nav.language': 'Idioma',

  'hero.badge': '🔥 Fila digital para cualquier atención',
  'hero.title1': 'Basta de filas caóticas',
  'hero.title2': 'en tu atención.',
  'hero.sub':
    'Ordena a tus clientes, elimina la confusión y llama al siguiente desde el celular. Funciona en el navegador, sin instalar nada. Ideal para restaurantes, clínicas, barberías y tiendas.',
  'hero.cta': 'Crear mi fila gratis →',
  'hero.how': 'Ver cómo funciona',
  'hero.trial': '30 días gratis · Sin tarjeta de crédito',
  'hero.mockLive': 'Atención en vivo',
  'hero.mockStatus1': 'En atención',
  'hero.mockStatus2': 'En fila',
  'hero.mockStatus3': 'Listo',
  'hero.mockName1': 'Carlos',
  'hero.mockName2': 'Lucía',
  'hero.mockName3': 'Diego',

  'dor.eyebrow': '¿Te suena conocido?',
  'dor.title': 'El caos de todos los días',
  'dor.1': '"¿Ya llamaron mi número?" — pregunta por quinta vez.',
  'dor.2': 'Se saltó a alguien porque el orden solo estaba en la cabeza del equipo.',
  'dor.3': 'Quien llegó después fue atendido primero. Confusión en el mostrador.',
  'dor.4': 'Gritar nombres en una sala de espera llena...',

  'solucao.eyebrow': 'La solución',
  'solucao.title': 'Fila clara, operación tranquila',
  'solucao.sub':
    'Cada persona ve su lugar. Tu equipo siempre sabe quién sigue. Sin papel, sin tótem, sin app.',
  'solucao.step1.title': 'La persona escanea el código QR',
  'solucao.step1.desc': 'En recepción, mostrador o entrada. Sin app que instalar.',
  'solucao.step2.title': 'Entra a la fila al instante',
  'solucao.step2.desc': 'Estado en tiempo real en el panel del equipo.',
  'solucao.step3.title': 'Llamada cuando le toca',
  'solucao.step3.desc': 'Notificación en el celular. Sin gritos ni confusión.',

  'diff.title': 'Simple a propósito',
  'diff.1.title': 'Sin app',
  'diff.1.desc': 'Siguen la fila en el navegador. Cero instalación.',
  'diff.2.title': 'Sin hardware',
  'diff.2.desc': 'Sin tótem, sin ticket físico, sin equipo extra.',
  'diff.3.title': '5 minutos',
  'diff.3.desc': 'De la cuenta creada a la primera fila funcionando.',

  'pricing.eyebrow': 'Precio',
  'pricing.title': 'Así de simple',
  'pricing.monthly': 'Mensual',
  'pricing.monthlyPrice': 'US$ 9',
  'pricing.monthlyPeriod': '/mes',
  'pricing.monthlyNote': 'Cancela cuando quieras',
  'pricing.yearly': 'Anual',
  'pricing.yearlyPrice': 'US$ 90',
  'pricing.yearlyPeriod': '/año',
  'pricing.yearlyNote': 'Dos meses gratis',
  'pricing.badge': 'MEJOR VALOR',
  'pricing.cta': 'Empezar gratis →',
  'pricing.trial': '30 días gratis en cualquier plan. Sin tarjeta de crédito.',

  'cta.title1': 'Tu fila empieza hoy.',
  'cta.title2': 'Gratis por 30 días.',
  'cta.sub': 'Sin tarjeta. Sin contrato. Sin rodeos.',
  'cta.button': 'Crear mi fila gratis →',

  'footer.copy': '© 2026 Minha Fila · Fila virtual para cualquier operación',
  'footer.privacy': 'Privacidad',
  'footer.terms': 'Términos de Uso',
  'footer.login': 'Entrar',
  'footer.privacyTitle': 'Política de Privacidad',
  'footer.termsTitle': 'Términos de Uso',
  'footer.legalUpdated': 'Última actualización: mayo de 2026',
  'footer.close': 'Cerrar',

  'seo.title': 'Minha Fila | Gestión de Fila Digital',
  'seo.description':
    'Software de fila digital para restaurantes, clínicas, barberías y tiendas — actualización en tiempo real, panel admin y acceso por código QR.',
  'seo.ogDescription':
    'Moderniza la atención presencial con fila digital, actualizaciones en vivo y un panel simple para tu equipo.',
  'seo.twitterDescription':
    'Fila digital para negocios con mucho movimiento — orden sin tickets de papel ni hardware.',
  'seo.ogAlt': 'Minha Fila - Gestión de Fila Digital',
  'seo.keywords': 'fila digital, gestión de filas, código QR, atención, SaaS',
}

const landingDictionaries: Record<AppLocale, LandingDict> = { pt_BR, en, es }

export function landingT(locale: AppLocale, key: string): string {
  return landingDictionaries[locale][key] ?? landingDictionaries.pt_BR[key] ?? key
}

export function landingAlternates(locale: AppLocale) {
  const languages: Record<string, string> = {
    'pt-BR': `${SITE_ORIGIN}/`,
    en: `${SITE_ORIGIN}/en`,
    es: `${SITE_ORIGIN}/es`,
    'x-default': `${SITE_ORIGIN}/`,
  }
  return {
    canonical: `${SITE_ORIGIN}${landingPath(locale)}`,
    languages,
  }
}

export function buildLandingMetadata(locale: AppLocale): Metadata {
  const t = (key: string) => landingT(locale, key)
  const path = landingPath(locale)
  const url = `${SITE_ORIGIN}${path === '/' ? '' : path}`

  return {
    title: { absolute: t('seo.title') },
    description: t('seo.description'),
    keywords: t('seo.keywords').split(', '),
    alternates: landingAlternates(locale),
    openGraph: {
      type: 'website',
      locale: toBcp47(locale).replace('-', '_'),
      siteName: 'Minha Fila',
      title: t('seo.title'),
      description: t('seo.ogDescription'),
      url,
      images: [{ url: `${SITE_ORIGIN}/logo.png`, width: 868, height: 369, alt: t('seo.ogAlt') }],
    },
    twitter: {
      card: 'summary',
      title: t('seo.title'),
      description: t('seo.twitterDescription'),
      images: [`${SITE_ORIGIN}/logo.png`],
    },
  }
}
