import { expect, test } from '@playwright/test'

const REQUIRED_FIREBASE_ENV = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
] as const

function hasFirebaseEnv(): boolean {
  return REQUIRED_FIREBASE_ENV.every((key) => {
    const value = process.env[key]
    return Boolean(value) && value !== 'demo-api-key'
  })
}

/**
 * Auth smoke tests.
 *
 * - Page render checks work with or without Firebase env (configured form vs
 *   "Configuration Required").
 * - Protected-route redirect needs Firebase Auth to settle (`.env.local`).
 *   Without it, the app may stay on a loading state — run `pnpm sync-env` first.
 * Unit tests (`pnpm test`) are the default gate; use `pnpm test:e2e` for smoke.
 */
test.describe('auth smoke', () => {
  test('sign-in page renders', async ({ page }) => {
    await page.goto('/auth/signin')
    const signInTitle = page.getByText('Sign In', { exact: true })
    const configRequired = page.getByText('Configuration Required')
    await expect(signInTitle.or(configRequired)).toBeVisible()
  })

  test('sign-up page renders', async ({ page }) => {
    await page.goto('/auth/signup')
    const signUpTitle = page.getByText('Sign Up', { exact: true })
    const configRequired = page.getByText('Configuration Required')
    await expect(signUpTitle.or(configRequired)).toBeVisible()
  })

  test('unauthenticated visit to dashboard redirects to sign-in', async ({
    page,
  }) => {
    test.skip(
      !hasFirebaseEnv(),
      'Requires full Firebase env (e.g. pnpm sync-env / .env.local)',
    )

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/signin/, { timeout: 15_000 })
  })
})
