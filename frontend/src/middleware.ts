import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LEGACY_HOST = 'minhafila.meugarcom.app'
const CANONICAL_HOST = 'minha-fila.meugarcom.app'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? request.nextUrl.host
  const forwardedProto = request.headers
    .get('x-forwarded-proto')
    ?.split(',')[0]
    .trim()
  const isHttps = request.nextUrl.protocol === 'https:' || forwardedProto === 'https'

  const needsHostRedirect = host === LEGACY_HOST
  const needsHttpsRedirect = host.endsWith('meugarcom.app') && !isHttps

  if (needsHostRedirect || needsHttpsRedirect) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.protocol = 'https:'
    redirectUrl.host = needsHostRedirect ? CANONICAL_HOST : host

    return NextResponse.redirect(redirectUrl, 308)
  }

  const { pathname } = request.nextUrl

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
