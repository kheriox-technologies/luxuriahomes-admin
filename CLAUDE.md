# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev            # Start all apps (Turborepo)
pnpm dev:admin      # Start only the admin app

# Build & Type Check
pnpm build          # Build all workspaces
pnpm check-types    # TypeScript type checking across all workspaces

# Code Quality (run before committing)
pnpm dlx ultracite fix    # Auto-fix formatting and lint issues
pnpm dlx ultracite check  # Check for issues without fixing

# Environment
pnpm env:pull       # Pull environment variables
pnpm env:push       # Push environment variables
```

## Architecture

This is a **Turborepo monorepo** with the following workspaces:

- `apps/admin` — Next.js 16 admin dashboard (primary app)
- `packages/backend` — Convex serverless backend (shared across apps)
- `packages/ui` — Shared shadcn/ui + Base UI component library
- `packages/env` — Type-safe environment variable configuration
- `packages/config` — Shared TypeScript and build configs

## Tech Stack

- **Frontend**: Next.js App Router, React 19, TailwindCSS, shadcn/ui, Base UI
- **Backend**: Convex (real-time serverless DB + API)
- **Auth**: Clerk (authentication + RBAC via session claims)
- **State**: Zustand (minimal stores, e.g. `stores/app-mode-store.ts`)
- **Forms**: TanStack React Form
- **Tables**: TanStack React Table

## Data Fetching Patterns

**Client-side (real-time):** Use Convex hooks via `@workspace/backend/api`:
```ts
import { api } from "@workspace/backend/api";
const data = useQuery(api.projects.list, {});
```

**Server-side (one-shot):** Use `fetchQuery` in Server Components:
```ts
const data = await fetchQuery(api.projects.list, {});
```

**Mutations:** Use Convex `useMutation` hook or server actions in `actions/`.

## Auth & Permissions

- Middleware lives in `apps/admin/proxy.ts` — Clerk-based with permission caching (60s TTL)
- Role-based access is enforced via Clerk session claims (custom metadata)
- Route guards are in `guards/` — check these when adding new protected routes
- Two app modes: `'builder'` and `'client'` (toggled via Zustand `useAppModeStore`)

## Backend (Convex)

All backend code lives in `packages/backend/convex/`:
- Schema defined in `schema.ts` — source of truth for all data types
- Organized by feature: `projects`, `inclusions`, `inclusionCategories`, `inclusionVariants`, `projectInclusions`, `fileStorage`
- Mutations/queries use Convex's built-in permissioning system

## Code Style

See `.claude/CLAUDE.md` for the full Ultracite code standards. Key points:
- Run `pnpm dlx ultracite fix` before committing (enforced by Husky pre-commit hook)
- Next.js `<Image>` over `<img>`, typed routes enabled (`next.config.ts`)
- React 19: use `ref` as a prop directly (no `forwardRef`)
