import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const CANONICAL_HOST = 'minha-fila.meugarcom.app'

function splitForwardedValue(value: string | null): string | null {
  if (!value) return null
  return value.split(',')[0]?.trim() || null
}

function splitHostAndPort(value: string | null): { hostname: string | null; port: string | null } {
  if (!value) return { hostname: null, port: null }

  const [hostname, port] = value.split(':')
  return {
    hostname: hostname || null,
    port: port || null,
  }
}

export function middleware(request: NextRequest) {
  const { nextUrl } = request

  const forwardedProto = splitForwardedValue(request.headers.get('x-forwarded-proto'))
  const forwardedHostRaw = splitForwardedValue(request.headers.get('x-forwarded-host'))
  const forwardedPort = splitForwardedValue(request.headers.get('x-forwarded-port'))
  const forwardedHost = splitHostAndPort(forwardedHostRaw)

  const hostname = forwardedHost.hostname ?? nextUrl.hostname
  const publicPort = forwardedPort ?? forwardedHost.port ?? nextUrl.port

  const protocol = forwardedProto ?? nextUrl.protocol.replace(':', '')
  const isHttps = protocol === 'https'

  const isMeugarcomDomain = hostname === 'meugarcom.app' || hostname.endsWith('.meugarcom.app')
  const hasCustomPublicPort = publicPort !== '' && publicPort !== '80' && publicPort !== '443'

  const needsHostRedirect = hostname !== CANONICAL_HOST && isMeugarcomDomain
  const needsHttpsRedirect = isMeugarcomDomain && !isHttps && !hasCustomPublicPort

  if (needsHostRedirect || needsHttpsRedirect) {
    const redirectUrl = nextUrl.clone()

    redirectUrl.hostname = needsHostRedirect ? CANONICAL_HOST : hostname

    if (needsHttpsRedirect) {
      redirectUrl.protocol = 'https:'
    }

    if (isMeugarcomDomain) {
      redirectUrl.port = ''
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
