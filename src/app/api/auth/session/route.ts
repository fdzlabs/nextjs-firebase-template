import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import {
  getAdminAuth,
  isFirebaseAdminConfigured,
  SESSION_COOKIE_MAX_AGE_MS,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from '@/lib/firebase-admin'

/**
 * POST /api/auth/session
 * Body: `{ idToken: string }` — Firebase client ID token.
 * Sets an httpOnly `__session` cookie via Admin `createSessionCookie`.
 */
export async function POST(request: Request) {
  if (!isFirebaseAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT or FIREBASE_ADMIN_* env vars.',
        code: 'ADMIN_NOT_CONFIGURED',
      },
      { status: 503 },
    )
  }

  let idToken: unknown
  try {
    const body = (await request.json()) as { idToken?: unknown }
    idToken = body.idToken
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body', code: 'INVALID_BODY' },
      { status: 400 },
    )
  }

  if (typeof idToken !== 'string' || !idToken) {
    return NextResponse.json(
      { error: 'idToken is required', code: 'MISSING_ID_TOKEN' },
      { status: 400 },
    )
  }

  try {
    const sessionCookie = await getAdminAuth().createSessionCookie(idToken, {
      expiresIn: SESSION_COOKIE_MAX_AGE_MS,
    })

    const response = NextResponse.json({ status: 'ok' })
    response.cookies.set({
      ...sessionCookieOptions(SESSION_COOKIE_MAX_AGE_MS / 1000),
      value: sessionCookie,
    })
    return response
  } catch (error) {
    console.error('[auth/session] Failed to create session cookie:', error)
    return NextResponse.json(
      { error: 'Invalid or expired ID token', code: 'INVALID_ID_TOKEN' },
      { status: 401 },
    )
  }
}

/**
 * DELETE /api/auth/session
 * Clears the `__session` cookie (and best-effort revokes refresh tokens when Admin is available).
 */
export async function DELETE() {
  const cookieStore = await cookies()
  const session = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (session && isFirebaseAdminConfigured()) {
    try {
      const decoded = await getAdminAuth().verifySessionCookie(session)
      await getAdminAuth().revokeRefreshTokens(decoded.sub)
    } catch {
      // Cookie may already be invalid/expired — still clear it below.
    }
  }

  const response = NextResponse.json({ status: 'ok' })
  response.cookies.set({
    ...sessionCookieOptions(0),
    value: '',
  })
  return response
}
