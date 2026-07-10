export type AdminCredentialSource =
  | { kind: 'json'; json: string }
  | { kind: 'discrete' }
  | { kind: 'adc' }
  | { kind: 'none' }

/**
 * Side-effect-free Admin credential detection.
 * Safe to unit-test without importing `firebase-admin` or `server-only`.
 */
export function resolveAdminCredentialSource(
  env: NodeJS.ProcessEnv = process.env,
): AdminCredentialSource {
  if (env.FIREBASE_SERVICE_ACCOUNT?.trim()) {
    return { kind: 'json', json: env.FIREBASE_SERVICE_ACCOUNT }
  }

  if (
    env.FIREBASE_ADMIN_PROJECT_ID &&
    env.FIREBASE_ADMIN_CLIENT_EMAIL &&
    env.FIREBASE_ADMIN_PRIVATE_KEY
  ) {
    return { kind: 'discrete' }
  }

  // GOOGLE_APPLICATION_CREDENTIALS or gcloud ADC (local Terraform path)
  if (
    env.GOOGLE_APPLICATION_CREDENTIALS ||
    env.FIREBASE_ADMIN_USE_ADC === 'true'
  ) {
    return { kind: 'adc' }
  }

  return { kind: 'none' }
}

export function isFirebaseAdminConfigured(
  env: NodeJS.ProcessEnv = process.env,
): boolean {
  return resolveAdminCredentialSource(env).kind !== 'none'
}
