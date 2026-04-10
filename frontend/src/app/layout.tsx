import type { Metadata, Viewport } from 'next'
import './globals.css'
import { DialogRoot } from '@/components/DialogRoot'

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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: '/logo-icon.png',
  },
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
    images: [{ url: 'https://minhafila.meugarcom.app/logo.png', width: 868, height: 369, alt: 'Minha Fila — Gestão de Fila Digital' }],
  },
  twitter: {
    card: 'summary',
    title: 'Minha Fila | Gestão de Fila Digital',
    description: 'Fila digital moderna para negócios com operação eficiente e experiência fluida.',
    images: ['https://minhafila.meugarcom.app/logo.png'],
  },
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
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-[var(--app-bg)] text-[var(--app-fg)] antialiased">
        {children}
        <DialogRoot />
      </body>
    </html>
  )
}
