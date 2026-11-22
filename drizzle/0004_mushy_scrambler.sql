ALTER TYPE "public"."rol_usuario" RENAME TO "rol_usuario_old";--> statement-breakpoint
ALTER TYPE "public"."tipo_usuario" RENAME TO "tipo_usuario_old";--> statement-breakpoint
CREATE TYPE "public"."rol_usuario" AS ENUM('usuario', 'bibliotecario', 'administrador', 'consulta');--> statement-breakpoint
CREATE TYPE "public"."tipo_usuario" AS ENUM('alumno', 'trabajador', 'publico');--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "rol" "rol_usuario" DEFAULT 'usuario' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tipo_usuario" "tipo_usuario" DEFAULT 'publico' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "tipo_solicitado" "tipo_usuario" DEFAULT 'publico' NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "matricula" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "carrera" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "semestre" integer;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "numero_trabajador" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "estatus" "estatus_padron";--> statement-breakpoint
UPDATE "user" u SET
	"rol" = (CASE p."rol"::text
		WHEN 'alumno' THEN 'usuario'
		WHEN 'administrador_biblioteca' THEN 'administrador'
		WHEN 'administrador_tecnico' THEN 'administrador'
		ELSE p."rol"::text
	END)::"rol_usuario",
	"tipo_usuario" = (CASE p."tipo_usuario"::text WHEN 'docente' THEN 'trabajador' ELSE p."tipo_usuario"::text END)::"tipo_usuario",
	"tipo_solicitado" = (CASE p."tipo_usuario"::text WHEN 'docente' THEN 'trabajador' ELSE p."tipo_usuario"::text END)::"tipo_usuario",
	"matricula" = p."matricula",
	"carrera" = p."carrera",
	"semestre" = p."semestre",
	"estatus" = p."estatus"
FROM "perfil_usuario" p
WHERE p."usuario_id" = u."id";--> statement-breakpoint
DROP TABLE "perfil_usuario" CASCADE;--> statement-breakpoint
DROP TYPE "public"."rol_usuario_old";--> statement-breakpoint
DROP TYPE "public"."tipo_usuario_old";--> statement-breakpoint
CREATE UNIQUE INDEX "user_matricula_alumno_uidx" ON "user" USING btree ("matricula") WHERE "user"."tipo_usuario" = 'alumno';--> statement-breakpoint
CREATE UNIQUE INDEX "user_numero_trabajador_uidx" ON "user" USING btree ("numero_trabajador") WHERE "user"."tipo_usuario" = 'trabajador';
