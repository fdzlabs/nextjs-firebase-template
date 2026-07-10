# Auth and Security Hardening

> **Status:** Implemented on `feat/auth-and-security` (merged into the template once the PR lands). App Check remains a follow-up.

The template combines Firebase client authentication with **server-enforced session-cookie verification** via Firebase Admin and `src/proxy.ts`. `ProtectedRoute` is only a soft UX/loading fallback.

## Implemented Architecture

1. **Firebase Admin SDK** — `src/lib/firebase-admin.ts` initializes from `FIREBASE_SERVICE_ACCOUNT`, discrete `FIREBASE_ADMIN_*` vars, or ADC.
2. **Session management** — `POST`/`DELETE` `src/app/api/auth/session` mint and clear the httpOnly `__session` cookie (`createSessionCookie` / revoke on logout).
3. **Next.js proxy** — `src/proxy.ts` verifies `__session` on protected matchers (`/dashboard`, `/auth/profile`, `/subscription`). Production fails closed without Admin; local/dev without Admin skips cryptographic verify (documented).
4. **Security rules** — Example Firestore and Storage rules live under `firebase/`. See [Security Rules](../security-rules.md).

## Acceptance Criteria

- [x] `firebase-admin` is installed and properly initialized.
- [x] Next.js `proxy.ts` actively intercepts and redirects unauthenticated requests for protected paths.
- [x] The `ProtectedRoute` client component is replaced or relegated to a fallback role.
- [x] Example Firestore and Storage rules are added to the repo.

## Follow-ups

- **App Check:** not implemented in this pass. Prefer reCAPTCHA Enterprise (or debug tokens locally) as a follow-up before production traffic.
