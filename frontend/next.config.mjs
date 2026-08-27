/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'minhafila.meugarcom.app',
      },
    ],
  },
  // PWA handled via manifest + service worker in /public
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: [
            "default-src 'self'",
            // sdk.mercadopago.com: SDK JS do checkout de cartão (tokenização client-side na tela de billing).
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://sdk.mercadopago.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://minhafila.meugarcom.app https://www.googletagmanager.com https://www.google-analytics.com https://*.mlstatic.com",
            // api.mercadopago.com: chamadas do SDK (bin lookup, createCardToken). *.mercadopago.com: telemetria do SDK.
            "connect-src 'self' https://minhafila.meugarcom.app wss://minhafila.meugarcom.app https://www.google-analytics.com https://region1.google-analytics.com https://api.mercadopago.com https://*.mercadopago.com",
            // Secure Fields (número, validade, CVV do cartão) são iframes hospedados pelo Mercado Pago.
            "frame-src https://*.mercadopago.com https://*.mercadolibre.com",
            "font-src 'self'",
            "object-src 'none'",
            "base-uri 'self'",
            "frame-ancestors 'none'",
          ].join('; ') },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
