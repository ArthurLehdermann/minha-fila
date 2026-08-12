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
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https://minhafila.meugarcom.app https://www.googletagmanager.com https://www.google-analytics.com",
            "connect-src 'self' https://minhafila.meugarcom.app wss://minhafila.meugarcom.app https://www.google-analytics.com https://region1.google-analytics.com",
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
