CREATE TYPE "public"."condicion_devolucion" AS ENUM('bueno', 'danado');--> statement-breakpoint
CREATE TYPE "public"."estatus_padron" AS ENUM('activo', 'baja');--> statement-breakpoint
CREATE TYPE "public"."rol_usuario" AS ENUM('alumno', 'bibliotecario', 'administrador_biblioteca', 'consulta', 'administrador_tecnico');--> statement-breakpoint
CREATE TYPE "public"."tipo_autor" AS ENUM('personal', 'corporativo', 'congreso');--> statement-breakpoint
CREATE TYPE "public"."tipo_usuario" AS ENUM('alumno', 'docente', 'publico');--> statement-breakpoint
CREATE TABLE "bitacora" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" text,
	"accion" text NOT NULL,
	"entidad" text NOT NULL,
	"entidad_id" text,
	"antes" jsonb,
	"despues" jsonb,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "catalogo_valor" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"catalogo" text NOT NULL,
	"codigo" text NOT NULL,
	"etiqueta" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categoria" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nombre" text NOT NULL,
	"permite_domicilio" boolean DEFAULT true NOT NULL,
	"permite_fotocopia" boolean DEFAULT true NOT NULL,
	"orden" integer DEFAULT 0 NOT NULL,
	"activa" boolean DEFAULT true NOT NULL,
	CONSTRAINT "categoria_nombre_unique" UNIQUE("nombre")
);
--> statement-breakpoint
CREATE TABLE "perfil_usuario" (
	"usuario_id" text PRIMARY KEY NOT NULL,
	"rol" "rol_usuario" DEFAULT 'alumno' NOT NULL,
	"tipo_usuario" "tipo_usuario" DEFAULT 'publico' NOT NULL,
	"matricula" text,
	"carrera" text,
	"semestre" integer,
	"estatus" "estatus_padron",
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "perfil_usuario_matricula_unique" UNIQUE("matricula")
);
--> statement-breakpoint
CREATE TABLE "titulo_materia" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo_id" uuid NOT NULL,
	"materia" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ejemplar" DROP CONSTRAINT "ejemplar_codigo_barras_unique";--> statement-breakpoint
ALTER TABLE "titulo" ALTER COLUMN "tipo" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "titulo" ALTER COLUMN "tipo" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "numero_utm" text NOT NULL;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "volumen" text;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "copia" text;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "capturado_por" text;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "baja_en" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "motivo_baja" text;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD COLUMN "actualizado_en" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "prestamo" ADD COLUMN "folio" integer NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "prestamo_folio_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "prestamo" ADD COLUMN "limite_recogida" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "prestamo" ADD COLUMN "activado_en" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "prestamo" ADD COLUMN "atendido_por" text;--> statement-breakpoint
ALTER TABLE "prestamo_item" ADD COLUMN "condicion_devolucion" "condicion_devolucion";--> statement-breakpoint
ALTER TABLE "prestamo_item" ADD COLUMN "nota_devolucion" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "numero_ficha" integer NOT NULL GENERATED ALWAYS AS IDENTITY (sequence name "titulo_numero_ficha_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "categoria_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "autor_principal" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "tipo_autor" "tipo_autor";--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "mencion_responsabilidad" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "edicion" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "lugar_publicacion" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "pais_publicacion" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "idioma" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "fecha_publicacion" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "pie_imprenta" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "descripcion_fisica" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "coleccion_serie" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "notas_generales" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "notas_contenido" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "notas_tesis" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "contenido" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "es_tesis" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "clasificacion_lcc" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "clasificacion_lcc_orden" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "capturado_por" text;--> statement-breakpoint
ALTER TABLE "titulo" ADD COLUMN "actualizado_en" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perfil_usuario" ADD CONSTRAINT "perfil_usuario_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "titulo_materia" ADD CONSTRAINT "titulo_materia_titulo_id_titulo_id_fk" FOREIGN KEY ("titulo_id") REFERENCES "public"."titulo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bitacora_entidad_idx" ON "bitacora" USING btree ("entidad","entidad_id");--> statement-breakpoint
CREATE INDEX "bitacora_creado_en_idx" ON "bitacora" USING btree ("creado_en");--> statement-breakpoint
CREATE UNIQUE INDEX "catalogo_valor_catalogo_codigo" ON "catalogo_valor" USING btree ("catalogo","codigo");--> statement-breakpoint
CREATE UNIQUE INDEX "titulo_materia_unica" ON "titulo_materia" USING btree ("titulo_id","materia");--> statement-breakpoint
CREATE INDEX "titulo_materia_materia_idx" ON "titulo_materia" USING btree ("materia");--> statement-breakpoint
ALTER TABLE "ejemplar" ADD CONSTRAINT "ejemplar_capturado_por_user_id_fk" FOREIGN KEY ("capturado_por") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestamo" ADD CONSTRAINT "prestamo_atendido_por_user_id_fk" FOREIGN KEY ("atendido_por") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "titulo" ADD CONSTRAINT "titulo_categoria_id_categoria_id_fk" FOREIGN KEY ("categoria_id") REFERENCES "public"."categoria"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "titulo" ADD CONSTRAINT "titulo_capturado_por_user_id_fk" FOREIGN KEY ("capturado_por") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "ejemplar_utm_vigente" ON "ejemplar" USING btree ("numero_utm") WHERE "ejemplar"."estado" <> 'baja';--> statement-breakpoint
CREATE INDEX "titulo_categoria_idx" ON "titulo" USING btree ("categoria_id");--> statement-breakpoint
CREATE INDEX "titulo_lcc_orden_idx" ON "titulo" USING btree ("clasificacion_lcc_orden");--> statement-breakpoint
ALTER TABLE "ejemplar" DROP COLUMN "codigo_barras";--> statement-breakpoint
ALTER TABLE "titulo" DROP COLUMN "autores";--> statement-breakpoint
ALTER TABLE "titulo" DROP COLUMN "anio";--> statement-breakpoint
ALTER TABLE "titulo" DROP COLUMN "clasificacion";--> statement-breakpoint
ALTER TABLE "prestamo" ADD CONSTRAINT "prestamo_folio_unique" UNIQUE("folio");--> statement-breakpoint
ALTER TABLE "titulo" ADD CONSTRAINT "titulo_numero_ficha_unique" UNIQUE("numero_ficha");--> statement-breakpoint
ALTER TABLE "ejemplar" ADD CONSTRAINT "ejemplar_baja_coherente" CHECK (("ejemplar"."estado" = 'baja') = ("ejemplar"."baja_en" is not null and "ejemplar"."motivo_baja" is not null));