# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # start dev server (Turbopack)
pnpm build      # production build
pnpm lint       # biome check
pnpm format     # biome format --write
pnpm typecheck  # next typegen && tsc --noEmit
pnpm test       # vitest run (src/**/*.test.ts)
pnpm db:generate  # create a migration in drizzle/ after editing src/db/schema
pnpm db:migrate   # apply migrations
```

Tests: vitest is configured (`vitest.config.mts`) but there are no tests yet. @playwright/test is installed but unconfigured.

Drizzle: after changing `src/db/schema/`, run `pnpm db:generate` and commit the SQL in `drizzle/`. Never edit an applied migration. CI fails if schema and migrations differ.

## Stack

- Next.js 16 (App Router) — read `node_modules/next/dist/docs/` before writing Next.js code; this version may differ from training data
- React 19, TypeScript, Tailwind CSS 4 + DaisyUI 5
- Drizzle ORM + `pg` (PostgreSQL)
- better-auth for authentication (user, session, account, verification tables in `src/db/schema/auth.ts`); not wired yet, `src/lib/auth.ts` does not exist
- Biome for linting and formatting (2-space indent, double quotes — Biome defaults)
- `output: 'standalone'` in `next.config.ts` — containerized deploy

## Architecture

**Database** (`src/db/`):

- `src/db/index.ts`: Drizzle client with singleton pool (reused in dev via `globalThis`)
- `src/db/schema/auth.ts`: better-auth tables + relations (generated, do not edit by hand)
- `src/db/schema/dominio.ts`: Library domain—titulo (books), ejemplar (copies), prestamo (loans), prestamoItem (copies in a loan), parametro (config)
- Enums: tipoMaterial, estadoEjemplar, modalidadPrestamo, estadoPrestamo

**App** (`src/app/`): Next.js App Router, mostly scaffolded.

**Env**: `.env` (gitignored). `.env.example` (dev) and `.env.prod.example` (production) are templates—keep in sync when adding vars. Requires `DATABASE_URL`.

## UI & Design System Enforcement (CRITICAL)

Whenever you create, edit, or refactor any UI component, page, or layout, you MUST read and strictly follow `.claude/skills/ui-design-system/SKILL.md` before writing code.

### Non-Negotiable UI Rules:

1. **Zero Hardcoded Colors:** NEVER use Tailwind palette utilities like `bg-red-500`, `text-gray-800`, `border-slate-200`, or raw hex codes in JSX/TSX. Always use DaisyUI v5 semantic tokens (`bg-base-100`, `text-base-content`, `btn-primary`, `border-base-300`, etc.).
2. **Typography Discipline:** `Playfair Display` (`font-serif`) is strictly forbidden for body copy, tables, inputs, buttons, and catalog metadata (ISBN, call numbers). Use `Inter` (`font-sans`) for UI/reading and `JetBrains Mono` (`font-mono`) for library classification codes.
3. **Theme Parity:** Every component must work seamlessly in both `biblioteca-light` and `biblioteca-dark` themes without manual `dark:` overrides.
