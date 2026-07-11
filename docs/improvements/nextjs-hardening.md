# Next.js Architecture Hardening

The codebase contains several Next.js anti-patterns, incomplete migrations, and configuration shortcuts that should be resolved to meet production standards.

## Implementation Steps

1. **Complete Proxy (Middleware) Implementation**
   - `src/proxy.ts` is currently a stub.
   - Implement standard `proxy(request)` signature.
   - Prefer exporting `proxyConfig` over the legacy `config` object for the matcher.
   - Define real matchers for paths that require authentication.

2. **TypeScript & Configuration Hygiene**
   - **`next.config.mjs`:** Remove `typescript: { ignoreBuildErrors: true }` and fix any underlying TypeScript errors.
   - **`next.config.mjs`:** Re-evaluate `images: { unoptimized: true }`. Either enable Next.js image optimization or document the specific reason it remains disabled.
   - **`tsconfig.json`:** Raise the `target` from `ES6` to `ES2022` or `ESNext`.

3. **Component Architecture (RSC / Client splits)**
   - Refactor large `"use client"` pages (such as the profile page) into a React Server Component (RSC) shell with smaller, focused Client Component "islands" for interactive forms.

4. **shadcn/ui Configuration**
   - Check `components.json` for the CSS path configuration. If it incorrectly points to `css/app/globals.css`, correct it to `src/app/globals.css`.

## Acceptance Criteria

- [ ] `src/proxy.ts` implements route protection using `proxyConfig`.
- [ ] `ignoreBuildErrors: true` is removed from `next.config.mjs`.
- [ ] `pnpm build` succeeds with zero TypeScript errors.
- [ ] Large client pages are refactored to use Server Component shells.
- [ ] `components.json` paths accurately reflect the project structure.
