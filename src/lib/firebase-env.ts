/**
 * Side-effect-free Firebase env checks.
 * Safe to import from Server Components without initializing the Firebase SDK.
 */

const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

const requiredEnvVars = {
  NEXT_PUBLIC_FIREBASE_API_KEY: apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: appId,
}

export const missingFirebaseEnvVars = Object.entries(requiredEnvVars)
  .filter(([, value]) => !value)
  .map(([key]) => key)

/**
 * True when every required NEXT_PUBLIC_FIREBASE_* variable is set
 * and the API key is not the demo placeholder.
 */
export const isConfigured =
  missingFirebaseEnvVars.length === 0 && apiKey !== 'demo-api-key'

export const firebaseEnv = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
}
