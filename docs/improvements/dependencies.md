# Dependency Refresh Targets

While the core frameworks (Next.js, React, Firebase, Tailwind) are up to date, several secondary packages and UI components should be evaluated for updates. Do not upgrade blindly; review changelogs for breaking changes.

## Status (2026-07-10)

| Package | Decision | Notes |
| :--- | :--- | :--- |
| `lucide-react` | **Upgraded** | `0.454.0` → `1.24.0` |
| `@vercel/analytics` | **Upgraded** | `1.3.1` → `1.6.1` (stayed on 1.x; 2.x deferred) |
| Radix UI (`@radix-ui/*`) | **Upgraded** | Bumped used Radix packages to latest within current majors |
| Terraform `hashicorp/google` + `google-beta` | **Upgraded** | `~> 5.0` → `~> 6.0`; set `deletion_policy = "DELETE"` on `google_project` and `google_firestore_database` to preserve template teardown |
| Zod 4 | **Deferred** | No app schemas yet; `@hookform/resolvers` would need a major bump (3 → 5). Stay on Zod 3 until forms adopt Zod. |
| Recharts 3 | **Deferred** | Only used by shadcn `chart.tsx`; Recharts 3 migration guide is breaking. Stay on 2.15.4. |
| Next / React / Firebase majors | **Skipped** | Out of scope for this refresh. |
| `pnpm-workspace.yaml` / `unrs-resolver` | **Unchanged here** | Build allowlists already landed on main via the DX tooling PR; this refresh does not modify `pnpm-workspace.yaml`. |

## Acceptance Criteria

- [x] Run `pnpm outdated` to verify current versions.
- [x] Update target dependencies in `package.json` and regenerate `pnpm-lock.yaml`.
- [x] Run `pnpm build` and `pnpm lint` to ensure no new errors are introduced.
- [ ] Smoke test the authentication flows (sign up, sign in, sign out) to verify stability.
