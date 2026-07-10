# Developer Experience (DX) & Tooling

The current setup lacks standard code formatting and testing infrastructure, despite mentions in the contributor documentation.

## Implementation Steps

1. **Code Formatting (Prettier)**
   - Install `prettier` and `prettier-plugin-tailwindcss`.
   - Add a `.prettierrc` configuration file.
   - Add a `format` script to `package.json` (e.g., `prettier --write .`).
   - Run the formatter across the entire repository to establish a baseline.

2. **Testing Infrastructure**
   - The current `test` script in `package.json` is a stub (`echo "Error..."`).
   - **Unit Tests:** Add [Vitest](https://vitest.dev/) to test utility functions and hooks.
   - **E2E/Smoke Tests:** Add [Playwright](https://playwright.dev/) to cover critical authentication flows (sign up, login, protected route redirection).

3. **Node Version Enforcement**
   - Add a `packageManager` field to `package.json` (e.g., `"packageManager": "pnpm@9.x.x"`).
   - Add a `.nvmrc` file specifying Node `20`.
   - Update `engines` in `package.json` to enforce `node >= 20`.

4. **Code Cleanup**
   - Consolidate duplicate hooks if present (e.g., check for overlap between `src/hooks/use-toast.ts` and `src/components/ui/use-toast.ts`).
   - Replace raw `catch (error: any)` blocks in authentication forms with properly typed error handling (e.g., checking `FirebaseError`).

## Acceptance Criteria

- [x] `pnpm format` successfully runs Prettier on the codebase.
- [x] Playwright or Vitest is installed and can run successfully via `pnpm test`.
- [x] Node v20+ requirement is enforced via `.nvmrc` and `package.json`.
- [x] Duplicate toast hooks are merged into a single implementation.

> Implemented on branch `chore/dx-and-tooling` (Vitest as `pnpm test`, Playwright as `pnpm test:e2e`).
