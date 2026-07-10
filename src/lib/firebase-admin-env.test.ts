import { describe, expect, it } from 'vitest'

import { resolveAdminCredentialSource } from '@/lib/firebase-admin-env'

describe('resolveAdminCredentialSource', () => {
  it('prefers FIREBASE_SERVICE_ACCOUNT JSON', () => {
    expect(
      resolveAdminCredentialSource({
        FIREBASE_SERVICE_ACCOUNT: '{"type":"service_account"}',
        FIREBASE_ADMIN_PROJECT_ID: 'ignored',
      }),
    ).toEqual({
      kind: 'json',
      json: '{"type":"service_account"}',
    })
  })

  it('uses discrete FIREBASE_ADMIN_* fields', () => {
    expect(
      resolveAdminCredentialSource({
        FIREBASE_ADMIN_PROJECT_ID: 'demo',
        FIREBASE_ADMIN_CLIENT_EMAIL: 'a@b.c',
        FIREBASE_ADMIN_PRIVATE_KEY: 'key',
      }),
    ).toEqual({ kind: 'discrete' })
  })

  it('uses ADC when GOOGLE_APPLICATION_CREDENTIALS is set', () => {
    expect(
      resolveAdminCredentialSource({
        GOOGLE_APPLICATION_CREDENTIALS: '/tmp/sa.json',
      }),
    ).toEqual({ kind: 'adc' })
  })

  it('uses ADC when FIREBASE_ADMIN_USE_ADC is true', () => {
    expect(
      resolveAdminCredentialSource({
        FIREBASE_ADMIN_USE_ADC: 'true',
      }),
    ).toEqual({ kind: 'adc' })
  })

  it('returns none when unset', () => {
    expect(resolveAdminCredentialSource({})).toEqual({ kind: 'none' })
  })
})
