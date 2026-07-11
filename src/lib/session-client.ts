/**
 * Browser helpers for exchanging a Firebase ID token for an httpOnly `__session`
 * cookie (and clearing it on sign-out). Safe to import from Client Components.
 */

export type SessionApiResult =
  { ok: true } | { ok: false; status: number; code?: string; message: string }

export type EstablishSessionResult =
  | { status: 'ok' }
  | { status: 'skipped'; reason: 'ADMIN_NOT_CONFIGURED' }
  | { status: 'failed'; message: string }

async function parseSessionResponse(
  response: Response,
): Promise<SessionApiResult> {
  if (response.ok) {
    return { ok: true }
  }

  let code: string | undefined
  let message = `Session request failed (${response.status})`

  try {
    const body = (await response.json()) as {
      error?: string
      code?: string
    }
    if (body.error) message = body.error
    if (body.code) code = body.code
  } catch {
    // ignore non-JSON error bodies
  }

  return { ok: false, status: response.status, code, message }
}

/** Exchange a Firebase ID token for a server `__session` cookie. */
export async function createSessionCookie(
  idToken: string,
): Promise<SessionApiResult> {
  const response = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
  return parseSessionResponse(response)
}

/** Clear the server `__session` cookie. */
export async function clearSessionCookie(): Promise<SessionApiResult> {
  const response = await fetch('/api/auth/session', {
    method: 'DELETE',
  })
  return parseSessionResponse(response)
}

/**
 * After a successful client sign-in, mint a session cookie before navigating
 * to a protected route.
 *
 * Never throws for session API failures — Firebase client auth may already have
 * succeeded; callers should treat `failed` as a session warning, not a sign-in error.
 * Soft-skips when Admin is not configured in local/dev.
 */
export async function establishSessionFromUser(user: {
  getIdToken: (forceRefresh?: boolean) => Promise<string>
}): Promise<EstablishSessionResult> {
  try {
    const idToken = await user.getIdToken()
    const result = await createSessionCookie(idToken)

    if (result.ok) return { status: 'ok' }

    if (result.code === 'ADMIN_NOT_CONFIGURED') {
      console.warn(
        '[auth] Firebase Admin is not configured; skipping session cookie. Protected routes rely on client auth until Admin env is set.',
      )
      return { status: 'skipped', reason: 'ADMIN_NOT_CONFIGURED' }
    }

    console.warn('[auth] Failed to establish session cookie:', result.message)
    return { status: 'failed', message: result.message }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to establish session'
    console.warn('[auth] Failed to establish session cookie:', error)
    return { status: 'failed', message }
  }
}
