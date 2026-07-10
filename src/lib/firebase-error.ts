import { FirebaseError } from 'firebase/app'

/** Safe, user-facing copy for known Firebase Auth error codes. */
const FIREBASE_AUTH_MESSAGES: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already in use by another account',
  'auth/invalid-credential': 'Invalid email or password',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/network-request-failed':
    'Network error. Check your connection and try again',
  'auth/popup-closed-by-user': 'Sign-in popup was closed before completing',
  'auth/requires-recent-login': 'Please sign in again to continue',
  'auth/too-many-requests': 'Too many attempts. Please try again later',
  'auth/user-disabled': 'This account has been disabled',
  'auth/user-not-found': 'No account found with this email',
  'auth/weak-password': 'Password is too weak. Please use a stronger password',
  'auth/wrong-password': 'Current password is incorrect',
}

/**
 * Returns safe user-facing copy for an unknown catch value.
 * Maps known Firebase Auth codes; otherwise returns the fallback.
 * Does not surface raw exception messages to the UI.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    return FIREBASE_AUTH_MESSAGES[error.code] ?? fallback
  }
  return fallback
}

export function isFirebaseError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError
}
