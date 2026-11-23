# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

University library loan system, built as a social-service project at the vice-rectorate (2 developers, 3 librarians). Students request books from their own devices and pick them up at the desk within 30 minutes; librarians manage the catalogue (MARC 21 structure, LCC classification), the desk, sanctions and reports. Users register and sign in with email and password, like on any website; people outside the university can register too (Google-only access is not confirmed and is not a requirement). A new account is `publico`; librarians promote it to student or staff after validating the credential.

**Current state:** the app is a UI prototype: components and views built to show the design to the client, with a minimal initial schema in `src/db/schema/`. Domain logic is not wired yet; authentication is.

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
- better-auth for authentication with email and password sign-up/sign-in (user, session, account, verification tables in `src/db/schema/auth.ts`; `account.password` already exists); configured in `src/lib/auth.ts` (client in `src/lib/auth-client.ts`, session helper in `src/lib/sesion.ts`). Google is not required (spec Q24)
- Biome for linting and formatting (2-space indent, double quotes — Biome defaults)
- `output: 'standalone'` in `next.config.ts` — containerized deploy

## Architecture

**Database** (`src/db/`):

- `src/db/index.ts`: Drizzle client with singleton pool (reused in dev via `globalThis`)
- `src/db/schema/auth.ts`: better-auth tables + relations, plus the domain columns on `user`; edit by hand (the better-auth CLI is not installed) and keep it in sync with `additionalFields`
- `src/db/schema/dominio.ts`: library domain per `docs/spec/01-dominio.md`: categoria and catalogo_valor (editable catalogues), titulo (22-field MARC-style record, immutable system-generated `numero_ficha`, LCC with a sort key) with titulo_materia, ejemplar (copies, `numero_utm` unique among non-`baja` copies via partial index, baja metadata checked), prestamo (loans with `folio`, partial unique index: one live loan per user), prestamoItem (copies in a loan, partial unique index: one live item per copy, return condition), parametro (config), bitacora (audit log). Sanctions are not modelled yet
- `src/db/schema/auth.ts`: besides the better-auth tables, `user` carries the domain columns (`rol`, `tipo_usuario`, `tipo_solicitado`, `matricula`, `carrera`, `semestre`, `numero_trabajador`, `estatus`), declared as `user.additionalFields` in `src/lib/auth.ts`; there is no `perfil_usuario` table
- Enums: tipoMaterial, estadoEjemplar, modalidadPrestamo, estadoPrestamo, tipoAutor, condicionDevolucion (domain); rolUsuario, tipoUsuario, estatusPadron (in `auth.ts`, next to `user`)

**App** (`src/app/`): Next.js App Router, mostly scaffolded.

**Env**: `.env` (gitignored). `.env.example` (dev) and `.env.prod.example` (production) are templates—keep in sync when adding vars. Requires `DATABASE_URL`.

## Specification (read before building)

The functional specification lives in `docs/spec/` (written in Spanish). Start with `docs/spec/README.md`, then read the file for your area before writing code.

- The spec is the source of truth for the domain. The initial schema predates it: where `src/db/schema/dominio.ts` disagrees with `docs/spec/01-dominio.md`, follow the spec and propose the schema change (with a migration) instead of bending the spec to the code. Ask before dropping tables that hold data.
- `docs/spec/06-preguntas-abiertas.md` lists open questions, each with a default proposal. If your task depends on one, use the default, keep it isolated and configurable, and say so in your reply. If there is no default, ask.
- Do not fill gaps with assumptions and do not invent APIs, methods, libraries or settings. If you are unsure about Next.js 16, Drizzle or better-auth, check the installed docs or the official documentation.
- If a client decision changes, update `docs/spec/` first, then the code.

## Project rules

- Use pnpm, never npm. Pin exact versions (`pnpm add <package>`) and do not upgrade dependencies on your own.
- Nothing from the library regulation is hardcoded. Business values (pickup window, max books per loan, hours, sanction table, categories, languages, UTM format…) live in the `parametro` table and editable catalogue tables, managed from a configuration screen by the librarians. See `docs/spec/04-informes-configuracion.md`.
- Enforce critical invariants in the database (unique and partial indexes, constraints) and the rest in the service layer inside a transaction.
- Authorize on the server by role (`usuario`, `bibliotecario`, `administrador`, `consulta` = read-only viewer) and by user type (`alumno`, `trabajador`, `publico`: public users never take books home). Role and user type are assigned by staff, never by the user at sign-up (the user only declares the requested type in `tipo_solicitado`; the account stays `publico` until validated). Never rely on hidden UI.
- There is no SMTP yet (spec Q23): do not make sign-up, email verification or password reset depend on sending email. Passwords are handled only by better-auth; never store or log them. Rate-limit sign-in and sign-up.
- Store timestamps in UTC and display them in `America/Mexico_City`.
- UI copy is in Mexican Spanish. Domain tables and columns use Spanish `snake_case` names (`numero_ficha`), as in the spec.
- The prototype views are the visual reference approved for the client: when wiring them to real data, keep their layout and design-system rules unless asked to change them.
- Do not commit unless asked. Never commit `.env` or secrets.

## Glossary (do not confuse these)

- **Título** (title): the work, one bibliographic record. It has a **número de ficha**: a system-generated index, unique per title, immutable.
- **Ejemplar** (copy): a physical copy. Each copy has its own **número UTM**, which is also its barcode: assigned by hand by the librarians, editable, unique among live copies, and reusable once freed.
- **Clasificación (LCC)**: the Library of Congress Classification call number, e.g. `PQ2226 .C65 D8`. Not the same as the category.
- **Categoría** (category): one of Consulta, Tesis, Posgrado, INEGI, Libros y revistas (an editable list). "Consulta" is for in-library use only.
- **Préstamo vivo** (live loan): `pre_prestamo`, `activo` or `vencido`. A user can have only one.
- **Tipo de usuario** (user type): `alumno`, `trabajador` (staff) or `publico`. Distinct from the role (what the person can do in the system).

## UI & Design System Enforcement (CRITICAL)

Whenever you create, edit, or refactor any UI component, page, or layout, you MUST read and strictly follow `.claude/skills/ui-design-system/SKILL.md` before writing code.

### Non-Negotiable UI Rules:

1. **Zero Hardcoded Colors:** NEVER use Tailwind palette utilities like `bg-red-500`, `text-gray-800`, `border-slate-200`, or raw hex codes in JSX/TSX. Always use DaisyUI v5 semantic tokens (`bg-base-100`, `text-base-content`, `btn-primary`, `border-base-300`, etc.).
2. **Typography Discipline:** `Playfair Display` (`font-serif`) is strictly forbidden for body copy, tables, inputs, buttons, and catalog metadata (ISBN, call numbers). Use `Source Serif 4` (`font-sans`) for UI/reading and `JetBrains Mono` (`font-mono`) for library classification codes.
3. **Theme Parity:** Every component must work seamlessly in both `biblioteca-light` and `biblioteca-dark` themes without manual `dark:` overrides.
