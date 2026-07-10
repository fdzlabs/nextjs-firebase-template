# Auth and Security Hardening

The current template relies entirely on client-side Firebase Authentication (`AuthProvider` + `onAuthStateChanged`). This leads to a suboptimal user experience (flashes of content before redirecting) and weaker security boundaries (no server-enforced route protection).

## Target Architecture

Migrate to server-enforced authentication using session cookies or Firebase ID token verification at the edge/server level.

## Implementation Steps

1. **Add Firebase Admin SDK**
   - Install `firebase-admin`.
   - Configure a service account securely using environment variables.

2. **Implement Server-Side Session Management**
   - Create route handlers (e.g., `src/app/api/auth/session/route.ts`) to manage session cookies or verify ID tokens on login/logout.

3. **Wire Next.js Proxy (Middleware)**
   - Update `src/proxy.ts` (Next.js middleware) to verify the session or token.
   - Set up the `proxyConfig.matcher` to protect authenticated routes like `/dashboard`.
   - Remove the client-only `ProtectedRoute` wrapper as the primary security gate.

4. **Security Rules & App Check (Optional but Recommended)**
   - Introduce Firebase App Check (using reCAPTCHA Enterprise or debug tokens for local dev).
   - Provide example Firestore and Storage security rules in the repository to replace default open rules.

## Acceptance Criteria

- [x] `firebase-admin` is installed and properly initialized.
- [x] Next.js `proxy.ts` actively intercepts and redirects unauthenticated requests for protected paths.
- [x] The `ProtectedRoute` client component is replaced or relegated to a fallback role.
- [x] Example Firestore and Storage rules are added to the repo.

## Follow-ups

- **App Check:** not implemented in this pass. Prefer reCAPTCHA Enterprise (or debug tokens locally) as a follow-up before production traffic.
