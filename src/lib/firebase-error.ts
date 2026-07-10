import { FirebaseError } from 'firebase/app'

/**
 * Returns a user-facing message from an unknown catch value.
 * Prefers FirebaseError / Error messages, otherwise the fallback.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    return error.message || fallback
  }
  if (error instanceof Error) {
    return error.message || fallback
  }
  return fallback
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError
}
