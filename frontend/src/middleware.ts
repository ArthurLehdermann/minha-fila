import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected =
    pathname.startsWith('/filas') ||
    pathname.startsWith('/billing')

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
  matcher: ['/filas/:path*', '/billing/:path*'],
}
