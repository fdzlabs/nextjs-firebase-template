# Agent Guidelines

This file contains high-level instructions for AI agents working in this repository.

## Commit Standards
- Follow the **Conventional Commits** specification.
- Format: `<type>(<scope>): <subject>`

### Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries such as documentation generation

### Examples
- `feat(auth): add google sign-in`
- `fix(ui): correct button padding on mobile`
- `docs(readme): update installation instructions`
- `chore(deps): upgrade react to v19`

### Skipping Builds
- To prevent a Vercel deployment for a specific commit, include `[skip ci]` or `[skip vercel]` in the commit message.

## Code Style
- Use `shadcn/ui` components for new UI elements.
- Ensure all code passes `eslint` and `prettier` checks.
- Prefer functional components and React hooks.

## Documentation
- Update `README.md` and `docs/` when making significant architectural changes.
- Keep `CONTRIBUTING.md` up to date with new workflow standards.


