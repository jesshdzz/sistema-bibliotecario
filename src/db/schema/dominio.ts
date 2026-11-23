import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const tipoMaterial = pgEnum("tipo_material", [
  "libro",
  "revista",
  "articulo",
]);

export const estadoEjemplar = pgEnum("estado_ejemplar", [
  "disponible",
  "apartado",
  "prestado",
  "en_sala",
  "no_disponible",
  "baja",
]);

export const modalidadPrestamo = pgEnum("modalidad_prestamo", [
  "domicilio",
  "sala",
  "fotocopia",
]);

export const estadoPrestamo = pgEnum("estado_prestamo", [
  "pre_prestamo",
  "activo",
  "vencido",
  "devuelto",
  "cancelado",
]);

export const tipoAutor = pgEnum("tipo_autor", [
  "personal",
  "corporativo",
  "congreso",
]);

export const condicionDevolucion = pgEnum("condicion_devolucion", [
  "bueno",
  "danado",
]);

export const categoria = pgTable("categoria", {
  id: uuid("id").primaryKey().defaultRandom(),
  nombre: text("nombre").notNull().unique(),
  permiteDomicilio: boolean("permite_domicilio").notNull().default(true),
  permiteFotocopia: boolean("permite_fotocopia").notNull().default(true),
  orden: integer("orden").notNull().default(0),
  activa: boolean("activa").notNull().default(true),
});

export const catalogoValor = pgTable(
  "catalogo_valor",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    catalogo: text("catalogo").notNull(),
    codigo: text("codigo").notNull(),
    etiqueta: text("etiqueta").notNull(),
    activo: boolean("activo").notNull().default(true),
    orden: integer("orden").notNull().default(0),
  },
  (t) => [
    uniqueIndex("catalogo_valor_catalogo_codigo").on(t.catalogo, t.codigo),
  ],
);

export const titulo = pgTable(
  "titulo",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    isbn: text("isbn").unique(),
    titulo: text("titulo").notNull(),
    editorial: text("editorial"),
    tipo: tipoMaterial("tipo"),
    numeroFicha: integer("numero_ficha")
      .notNull()
      .generatedAlwaysAsIdentity()
      .unique(),
    categoriaId: uuid("categoria_id")
      .notNull()
      .references(() => categoria.id, { onDelete: "restrict" }),
    autorPrincipal: text("autor_principal"),
    tipoAutor: tipoAutor("tipo_autor"),
    mencionResponsabilidad: text("mencion_responsabilidad"),
    edicion: text("edicion"),
    lugarPublicacion: text("lugar_publicacion"),
    paisPublicacion: text("pais_publicacion"),
    idioma: text("idioma"),
    fechaPublicacion: text("fecha_publicacion"),
    pieImprenta: text("pie_imprenta"),
    descripcionFisica: text("descripcion_fisica"),
    coleccionSerie: text("coleccion_serie"),
    notasGenerales: text("notas_generales"),
    notasContenido: text("notas_contenido"),
    notasTesis: text("notas_tesis"),
    contenido: text("contenido"),
    esTesis: boolean("es_tesis").notNull().default(false),
    clasificacionLcc: text("clasificacion_lcc"),
    clasificacionLccOrden: text("clasificacion_lcc_orden"),
    capturadoPor: text("capturado_por").references(() => user.id, {
      onDelete: "set null",
    }),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("titulo_titulo_idx").on(t.titulo),
    index("titulo_categoria_idx").on(t.categoriaId),
    index("titulo_lcc_orden_idx").on(t.clasificacionLccOrden),
  ],
);

export const tituloMateria = pgTable(
  "titulo_materia",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tituloId: uuid("titulo_id")
      .notNull()
      .references(() => titulo.id, { onDelete: "cascade" }),
    materia: text("materia").notNull(),
  },
  (t) => [
    uniqueIndex("titulo_materia_unica").on(t.tituloId, t.materia),
    index("titulo_materia_materia_idx").on(t.materia),
  ],
);

export const ejemplar = pgTable(
  "ejemplar",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tituloId: uuid("titulo_id")
      .notNull()
      .references(() => titulo.id, { onDelete: "restrict" }),
    numeroUtm: text("numero_utm").notNull(),
    volumen: text("volumen"),
    copia: text("copia"),
    estado: estadoEjemplar("estado").notNull().default("disponible"),
    capturadoPor: text("capturado_por").references(() => user.id, {
      onDelete: "set null",
    }),
    bajaEn: timestamp("baja_en", { withTimezone: true }),
    motivoBaja: text("motivo_baja"),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    actualizadoEn: timestamp("actualizado_en", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("ejemplar_titulo_idx").on(t.tituloId),
    uniqueIndex("ejemplar_utm_vigente")
      .on(t.numeroUtm)
      .where(sql`${t.estado} <> 'baja'`),
    check(
      "ejemplar_baja_coherente",
      sql`(${t.estado} = 'baja') = (${t.bajaEn} is not null and ${t.motivoBaja} is not null)`,
    ),
  ],
);

export const prestamo = pgTable(
  "prestamo",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    folio: integer("folio").notNull().generatedAlwaysAsIdentity().unique(),
    usuarioId: text("usuario_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    modalidad: modalidadPrestamo("modalidad").notNull(),
    estado: estadoPrestamo("estado").notNull().default("pre_prestamo"),
    credencialRetenida: boolean("credencial_retenida").notNull().default(false),
    limiteRecogida: timestamp("limite_recogida", { withTimezone: true }),
    activadoEn: timestamp("activado_en", { withTimezone: true }),
    atendidoPor: text("atendido_por").references(() => user.id, {
      onDelete: "set null",
    }),
    venceEn: timestamp("vence_en", { withTimezone: true }),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
    cerradoEn: timestamp("cerrado_en", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("prestamo_un_vivo_por_usuario")
      .on(t.usuarioId)
      .where(sql`${t.estado} in ('pre_prestamo', 'activo', 'vencido')`),
    index("prestamo_estado_idx").on(t.estado),
  ],
);

export const prestamoItem = pgTable(
  "prestamo_item",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    prestamoId: uuid("prestamo_id")
      .notNull()
      .references(() => prestamo.id, { onDelete: "cascade" }),
    ejemplarId: uuid("ejemplar_id")
      .notNull()
      .references(() => ejemplar.id, { onDelete: "restrict" }),
    vivo: boolean("vivo").notNull().default(true),
    devueltoEn: timestamp("devuelto_en", { withTimezone: true }),
    condicionDevolucion: condicionDevolucion("condicion_devolucion"),
    notaDevolucion: text("nota_devolucion"),
  },
  (t) => [
    uniqueIndex("prestamo_item_un_vivo_por_ejemplar")
      .on(t.ejemplarId)
      .where(sql`${t.vivo} = true`),
    index("prestamo_item_prestamo_idx").on(t.prestamoId),
    check(
      "prestamo_item_vivo_sin_devolucion",
      sql`not ${t.vivo} or ${t.devueltoEn} is null`,
    ),
  ],
);

/**
 * Parámetros editables del reglamento. Se editan desde la pantalla de configuración
 */
export const parametro = pgTable("parametro", {
  clave: text("clave").primaryKey(),
  valor: jsonb("valor").notNull(),
  descripcion: text("descripcion"),
  actualizadoEn: timestamp("actualizado_en", { withTimezone: true })
    .notNull()
    .defaultNow(),
  actualizadoPor: text("actualizado_por").references(() => user.id, {
    onDelete: "set null",
  }),
});

export const bitacora = pgTable(
  "bitacora",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    usuarioId: text("usuario_id").references(() => user.id, {
      onDelete: "set null",
    }),
    accion: text("accion").notNull(),
    entidad: text("entidad").notNull(),
    entidadId: text("entidad_id"),
    antes: jsonb("antes"),
    despues: jsonb("despues"),
    creadoEn: timestamp("creado_en", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("bitacora_entidad_idx").on(t.entidad, t.entidadId),
    index("bitacora_creado_en_idx").on(t.creadoEn),
  ],
);
