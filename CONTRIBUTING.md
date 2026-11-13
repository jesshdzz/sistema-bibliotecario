# Cómo trabajamos

1. `main` siempre debe estar en verde (CI) y desplegable.
2. Cada cambio va en una rama (`feat/...`, `fix/...`) y se integra con Pull Request
   revisado por el CODE OWNER del equipo.
3. Antes de abrir el PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
4. Si cambias `src/db/schema/`: ejecuta `pnpm db:generate`, revisa el SQL generado
   en `drizzle/` y súbelo en el mismo PR. **Nunca edites una migración ya aplicada**;
   crea otra. CI falla si el esquema y las migraciones no coinciden.
5. `src/db/schema/auth.ts` lo genera Better Auth (`pnpm auth:schema`); no se edita a mano.
6. Dependencias: se añaden con `pnpm add <paquete>`. Nunca npm.
7. Las reglas de negocio viven en la capa de servicio y, cuando es posible, también como restricción en la base de datos.
8. Versiones: se publica con una etiqueta `vX.Y.Z`.
