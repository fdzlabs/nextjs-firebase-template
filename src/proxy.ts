import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { ROUTES } from '@/constants/routes'

/** Conventional Firebase session cookie name (set by session APIs in auth-and-security). */
const SESSION_COOKIE = '__session'

const PROTECTED_PREFIXES = [
  ROUTES.DASHBOARD,
  ROUTES.AUTH.PROFILE,
  ROUTES.AUTH.SUBSCRIPTION,
] as const

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  )
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  // Cookie-presence gate only. Token verification lands with auth-and-security work
  // (firebase-admin session create/revoke). Do not treat this as cryptographic auth.
  const session = request.cookies.get(SESSION_COOKIE)
  if (!session?.value) {
    const loginUrl = new URL(ROUTES.AUTH.SIGNIN, request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/profile/:path*',
    '/subscription/:path*',
  ],
}
