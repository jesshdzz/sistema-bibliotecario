# Sistema Bibliotecario

Sistema de préstamo de libros para la biblioteca universitaria de la UTM: los estudiantes
solicitan préstamos desde su dispositivo y los bibliotecarios controlan el
inventario y la circulación.

## Stack

Next.js 16 · TypeScript · PostgreSQL 17 · Drizzle ORM · Better Auth · Tailwind CSS 4 + daisyUI 5 · Zod · Vitest · pnpm · Docker.

## Arranque rápido (desarrollo)

Requisitos: Docker, [mise](https://mise.jdx.dev).

```bash
mise install
cp .env.example .env
docker compose up -d db
pnpm install
pnpm db:migrate
pnpm dev            # http://localhost:3000
```

Comprobaciones antes de cada Pull Request:

```bash
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Documentación

- [`CONTRIBUTING.md`](CONTRIBUTING.md): flujo de trabajo en equipo.

## Reglas

- Solo **pnpm** (nunca npm). La versión está fijada en `package.json`.
- Dependencias solo con versión exacta.
- Nunca subir `.env` ni `.env.prod`.
