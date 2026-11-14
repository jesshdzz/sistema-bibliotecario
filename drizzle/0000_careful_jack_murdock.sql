CREATE TYPE "public"."estado_ejemplar" AS ENUM('disponible', 'apartado', 'prestado', 'en_sala', 'no_disponible', 'baja');--> statement-breakpoint
CREATE TYPE "public"."estado_prestamo" AS ENUM('pre_prestamo', 'activo', 'vencido', 'devuelto', 'cancelado');--> statement-breakpoint
CREATE TYPE "public"."modalidad_prestamo" AS ENUM('domicilio', 'sala', 'fotocopia');--> statement-breakpoint
CREATE TYPE "public"."tipo_material" AS ENUM('libro', 'revista', 'articulo');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ejemplar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo_id" uuid NOT NULL,
	"codigo_barras" text NOT NULL,
	"estado" "estado_ejemplar" DEFAULT 'disponible' NOT NULL,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ejemplar_codigo_barras_unique" UNIQUE("codigo_barras")
);
--> statement-breakpoint
CREATE TABLE "parametro" (
	"clave" text PRIMARY KEY NOT NULL,
	"valor" jsonb NOT NULL,
	"descripcion" text,
	"actualizado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"actualizado_por" text
);
--> statement-breakpoint
CREATE TABLE "prestamo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usuario_id" text NOT NULL,
	"modalidad" "modalidad_prestamo" NOT NULL,
	"estado" "estado_prestamo" DEFAULT 'pre_prestamo' NOT NULL,
	"credencial_retenida" boolean DEFAULT false NOT NULL,
	"vence_en" timestamp with time zone,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	"cerrado_en" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "prestamo_item" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prestamo_id" uuid NOT NULL,
	"ejemplar_id" uuid NOT NULL,
	"vivo" boolean DEFAULT true NOT NULL,
	"devuelto_en" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "titulo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"isbn" text,
	"titulo" text NOT NULL,
	"autores" text,
	"editorial" text,
	"anio" text,
	"tipo" "tipo_material" DEFAULT 'libro' NOT NULL,
	"clasificacion" text,
	"creado_en" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "titulo_isbn_unique" UNIQUE("isbn")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ejemplar" ADD CONSTRAINT "ejemplar_titulo_id_titulo_id_fk" FOREIGN KEY ("titulo_id") REFERENCES "public"."titulo"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "parametro" ADD CONSTRAINT "parametro_actualizado_por_user_id_fk" FOREIGN KEY ("actualizado_por") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestamo" ADD CONSTRAINT "prestamo_usuario_id_user_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "public"."user"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestamo_item" ADD CONSTRAINT "prestamo_item_prestamo_id_prestamo_id_fk" FOREIGN KEY ("prestamo_id") REFERENCES "public"."prestamo"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prestamo_item" ADD CONSTRAINT "prestamo_item_ejemplar_id_ejemplar_id_fk" FOREIGN KEY ("ejemplar_id") REFERENCES "public"."ejemplar"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "ejemplar_titulo_idx" ON "ejemplar" USING btree ("titulo_id");--> statement-breakpoint
CREATE UNIQUE INDEX "prestamo_un_vivo_por_usuario" ON "prestamo" USING btree ("usuario_id") WHERE "prestamo"."estado" in ('pre_prestamo', 'activo', 'vencido');--> statement-breakpoint
CREATE INDEX "prestamo_estado_idx" ON "prestamo" USING btree ("estado");--> statement-breakpoint
CREATE UNIQUE INDEX "prestamo_item_un_vivo_por_ejemplar" ON "prestamo_item" USING btree ("ejemplar_id") WHERE "prestamo_item"."vivo" = true;--> statement-breakpoint
CREATE INDEX "prestamo_item_prestamo_idx" ON "prestamo_item" USING btree ("prestamo_id");--> statement-breakpoint
CREATE INDEX "titulo_titulo_idx" ON "titulo" USING btree ("titulo");