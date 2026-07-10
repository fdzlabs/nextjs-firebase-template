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

function getAdminApp(): App {
  if (adminApp) return adminApp
  if (initError) throw initError

  if (getApps().length > 0) {
    adminApp = getApps()[0]!
    return adminApp
  }

  const source = resolveAdminCredentialSource()

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
    throw initError
  }

  return adminApp
}

/** Lazy Admin Auth instance. Throws if Admin credentials are missing/invalid. */
export function getAdminAuth(): Auth {
  return getAuth(getAdminApp())
}
