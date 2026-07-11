# Firebase Features & Fixes

Terraform provisions Firebase Authentication, Firestore, and Cloud Storage, but the template application code currently only demonstrates Authentication.

## Implementation Steps

1. **Demonstrate Firestore & Storage Usage**
   - Add a "User Profile" feature that performs CRUD operations against Firestore.
   - Implement an avatar upload feature using Firebase Storage.
   - Use Server Actions or API routes with `firebase-admin` for privileged operations where appropriate.

2. **Fix Firebase Configuration Validation**
   - **Bug:** `src/lib/firebase.ts` currently checks `isConfigured = missingVars.length < 10`, which silently allows the app to run with dummy credentials if some env vars are missing.
   - **Fix:** Update `isConfigured` to strictly check that **all** required variables are present (`missingVars.length === 0`).
   - Implement a fail-fast mechanism in development or gracefully redirect to a `/setup` page when the environment is unconfigured.

3. **Update Node Version Requirements**
   - Firebase 12 engines require Node **20+**.
   - Update the `README.md` prerequisite section to specify Node v20+ (currently says v18+).

## Acceptance Criteria

- [ ] The application includes working examples of reading/writing to Firestore.
- [ ] The application includes a working example of uploading a file to Firebase Storage.
- [ ] `isConfigured` logic in `src/lib/firebase.ts` accurately detects missing variables.
- [ ] The app redirects to `/setup` or shows a clear error when Firebase is not configured.
- [ ] `README.md` correctly lists Node.js v20+ as a prerequisite.
