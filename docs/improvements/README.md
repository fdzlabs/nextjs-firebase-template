# Template Modernization Backlog

This directory contains a prioritized backlog for keeping the Next.js + Firebase template production-ready. While the template's **core stack is already current** (Next 16, React 19, Firebase 12, Tailwind 4, ESLint 9), there are architectural improvements, secondary dependency updates, and developer experience (DX) hygiene tasks that should be addressed over time.

This backlog is intended for template maintainers and developers who fork this repository for their own projects.

## Priority Index

| Priority | Area | Guide | Description |
| :--- | :--- | :--- | :--- |
| **P1** | Security | [Auth & Security](auth-and-security.md) | Migrate from client-only auth to server-side session verification via `firebase-admin`. |
| **P2** | Architecture | [Next.js Hardening](nextjs-hardening.md) | Complete Next 16 proxy implementation, remove `ignoreBuildErrors`, split RSC/client components. |
| **P3** | Features | [Firebase Features](firebase-features.md) | Add examples for Firestore/Storage; fix config validation bugs (`isConfigured`). |
| **P4** | Tooling | [DX & Tooling](dx-and-tooling.md) | Add Prettier and tests; update Node version requirements to 20+. |
| **P5** | Maintenance | [Dependencies](dependencies.md) | Refresh secondary dependencies (shadcn, lucide-react, analytics, zod, etc.). |

## Workflow

To implement these improvements:
1. Pick a guide from the index above.
2. Implement the changes in a feature branch.
3. Use Conventional Commits (e.g., `refactor(auth): migrate to server-side sessions`).
4. Ensure the acceptance criteria at the bottom of the guide are met.
5. Create a Pull Request against the main branch.
