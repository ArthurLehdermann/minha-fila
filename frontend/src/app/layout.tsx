import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://minhafila.meugarcom.app'),
  title: {
    default: 'Minha Fila | Gestão de Fila Digital',
    template: '%s | Minha Fila',
  },
  description:
    'Plataforma profissional para gestão de fila digital com atualização em tempo real, painel administrativo e entrada via QR Code.',
  applicationName: 'Minha Fila',
  manifest: '/manifest.json',
  keywords: ['fila digital', 'gestão de filas', 'QR Code', 'painel administrativo', 'SaaS'],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Minha Fila',
    title: 'Minha Fila | Gestão de Fila Digital',
    description:
      'Modernize seu atendimento com fila digital responsiva, atualização em tempo real e gestão profissional.',
    url: 'https://minhafila.meugarcom.app',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Minha Fila | Gestão de Fila Digital',
    description: 'Fila digital moderna para negócios com operação eficiente e experiência fluida.',
  },
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Minha Fila' },
}

export const viewport: Viewport = {
  themeColor: '#020617',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="min-h-screen bg-slate-950 text-slate-50 antialiased">{children}</body>
    </html>
  )
}
