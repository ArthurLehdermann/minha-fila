import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LEGACY_HOST = 'minhafila.meugarcom.app'
const CANONICAL_HOST = 'minha-fila.meugarcom.app'

export function middleware(request: NextRequest) {
  const { nextUrl } = request
  const hostname = nextUrl.hostname
  const port = nextUrl.port

  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    .trim()
  const isHttps = nextUrl.protocol === 'https:' || forwardedProto === 'https'

  const isMeugarcomDomain = hostname === 'meugarcom.app' || hostname.endsWith('.meugarcom.app')
  const hasCustomPort = port !== '' && port !== '80' && port !== '443'

  const needsHostRedirect = hostname === LEGACY_HOST
  const needsHttpsRedirect = isMeugarcomDomain && !isHttps && !hasCustomPort

  if (needsHostRedirect || needsHttpsRedirect) {
    const redirectUrl = nextUrl.clone()

    if (needsHostRedirect) {
      redirectUrl.hostname = CANONICAL_HOST
    }

    if (needsHttpsRedirect) {
      redirectUrl.protocol = 'https:'
    }

    return NextResponse.redirect(redirectUrl, 308)
  }

  const { pathname } = nextUrl

  const isProtected = pathname.startsWith('/filas') || pathname.startsWith('/billing')

  if (!isProtected) return NextResponse.next()

  // Rota pública: /filas/:uuid sem /admin (página pública da fila)
  // Só bloqueia se for /filas sem uuid (lista de filas) ou /filas/:uuid/admin
  const isPublicQueuePage = /^\/filas\/[^/]+$/.test(pathname)
  if (isPublicQueuePage) return NextResponse.next()

  const token = request.cookies.get('auth_token')
  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/:path*',
}
