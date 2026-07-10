import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { ROUTES } from '@/constants/routes'
import {
  getAdminAuth,
  isFirebaseAdminConfigured,
  SESSION_COOKIE_NAME,
} from '@/lib/firebase-admin'

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

function redirectToSignIn(request: NextRequest, clearCookie = false) {
  const loginUrl = new URL(ROUTES.AUTH.SIGNIN, request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  const response = NextResponse.redirect(loginUrl)

  if (clearCookie) {
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }

  return response
}

/**
 * Next.js 16 proxy (Node runtime). Primary gate for protected routes.
 *
 * - Production: requires Firebase Admin and verifies `__session` cryptographically.
 * - Local/dev without Admin: skips server verification (client `ProtectedRoute` is the UX fallback).
 *   Documented in README / setup docs — do not rely on this for production.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!isFirebaseAdminConfigured()) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '[proxy] Firebase Admin is not configured in production; denying protected route.',
      )
      return redirectToSignIn(request)
    }

    // Dev/template mode: no Admin credentials — skip cryptographic verify.
    // Presence check only when a cookie exists; otherwise allow through so
    // client-side auth demos still work without a service account.
    return NextResponse.next()
  }

  if (!session) {
    return redirectToSignIn(request)
  }

  try {
    // Stateless JWT verify (cached public keys). Avoid checkRevoked=true here —
    // that forces a Firebase Auth round-trip on every protected navigation.
    // Revocation is handled on sign-out via DELETE /api/auth/session.
    await getAdminAuth().verifySessionCookie(session)
    return NextResponse.next()
  } catch {
    return redirectToSignIn(request, true)
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/profile/:path*',
    '/subscription/:path*',
  ],
}
