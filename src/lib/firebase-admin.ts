import 'server-only'

import {
  applicationDefault,
  cert,
  getApps,
  initializeApp,
  type App,
  type ServiceAccount,
} from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'

import { resolveAdminCredentialSource } from '@/lib/firebase-admin-env'

export {
  isFirebaseAdminConfigured,
  resolveAdminCredentialSource,
} from '@/lib/firebase-admin-env'

/** Conventional Firebase session cookie name (must match `src/proxy.ts`). */
export const SESSION_COOKIE_NAME = '__session'

/** Session cookie lifetime: 5 days (Firebase allows 5 minutes–14 days). */
export const SESSION_COOKIE_MAX_AGE_MS = 60 * 60 * 24 * 5 * 1000

/** Shared httpOnly cookie attributes for set/clear so path/attrs never drift. */
export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    name: SESSION_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}

function parseServiceAccountJson(raw: string): ServiceAccount {
  const parsed = JSON.parse(raw) as ServiceAccount & {
    project_id?: string
    client_email?: string
    private_key?: string
  }

  return {
    projectId: parsed.projectId ?? parsed.project_id,
    clientEmail: parsed.clientEmail ?? parsed.client_email,
    privateKey: (parsed.privateKey ?? parsed.private_key)?.replace(
      /\\n/g,
      '\n',
    ),
  }
}

function buildServiceAccountFromEnv(): ServiceAccount {
  return {
    projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
}

let adminApp: App | null = null
let initError: Error | null = null
let initErrorAtMs = 0

/** How long to cache ADC init failures before allowing a retry. */
const ADC_INIT_ERROR_TTL_MS = 30_000

function getAdminApp(): App {
  if (adminApp) return adminApp

  const source = resolveAdminCredentialSource()
  if (initError) {
    // Permanent for missing/invalid static config; TTL for ADC (metadata can flap).
    const isTransientAdc =
      source.kind === 'adc' &&
      Date.now() - initErrorAtMs < ADC_INIT_ERROR_TTL_MS
    const isPermanent =
      source.kind === 'none' ||
      source.kind === 'json' ||
      source.kind === 'discrete'
    if (isPermanent || isTransientAdc) {
      throw initError
    }
    initError = null
    initErrorAtMs = 0
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0]!
    return adminApp
  }

  try {
    switch (source.kind) {
      case 'json':
        adminApp = initializeApp({
          credential: cert(parseServiceAccountJson(source.json)),
        })
        break
      case 'discrete':
        adminApp = initializeApp({
          credential: cert(buildServiceAccountFromEnv()),
        })
        break
      case 'adc':
        adminApp = initializeApp({
          credential: applicationDefault(),
          projectId:
            process.env.FIREBASE_ADMIN_PROJECT_ID ||
            process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        })
        break
      case 'none': {
        const error = new Error(
          'Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT, or FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY, or GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_ADMIN_USE_ADC=true.',
        )
        initError = error
        initErrorAtMs = Date.now()
        throw error
      }
      default: {
        const _exhaustive: never = source
        throw new Error(
          `Unhandled credential source: ${JSON.stringify(_exhaustive)}`,
        )
      }
    }
  } catch (error) {
    initError =
      error instanceof Error
        ? error
        : new Error('Failed to initialize Firebase Admin')
    initErrorAtMs = Date.now()
    throw initError
  }

  return adminApp
}

/** Lazy Admin Auth instance. Throws if Admin credentials are missing/invalid. */
export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}
