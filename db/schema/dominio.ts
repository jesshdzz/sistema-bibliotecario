import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from './auth';

export const tipoMaterial = pgEnum('tipo_material', ['libro', 'revista', 'articulo']);

export const estadoEjemplar = pgEnum('estado_ejemplar', [
  'disponible',
  'apartado',
  'prestado',
  'en_sala',
  'no_disponible',
  'baja',
]);

export const modalidadPrestamo = pgEnum('modalidad_prestamo', [
  'domicilio',
  'sala',
  'fotocopia',
]);

export const estadoPrestamo = pgEnum('estado_prestamo', [
  'pre_prestamo',
  'activo',
  'vencido',
  'devuelto',
  'cancelado',
]);

export const titulo = pgTable(
  'titulo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    isbn: text('isbn').unique(),
    titulo: text('titulo').notNull(),
    autores: text('autores'),
    editorial: text('editorial'),
    anio: text('anio'),
    tipo: tipoMaterial('tipo').notNull().default('libro'),
    clasificacion: text('clasificacion'),
    creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('titulo_titulo_idx').on(t.titulo)],
);

export const ejemplar = pgTable(
  'ejemplar',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tituloId: uuid('titulo_id')
      .notNull()
      .references(() => titulo.id, { onDelete: 'restrict' }),
    codigoBarras: text('codigo_barras').notNull().unique(),
    estado: estadoEjemplar('estado').notNull().default('disponible'),
    creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('ejemplar_titulo_idx').on(t.tituloId)],
);

export const prestamo = pgTable(
  'prestamo',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    usuarioId: text('usuario_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    modalidad: modalidadPrestamo('modalidad').notNull(),
    estado: estadoPrestamo('estado').notNull().default('pre_prestamo'),
    credencialRetenida: boolean('credencial_retenida').notNull().default(false),
    venceEn: timestamp('vence_en', { withTimezone: true }),
    creadoEn: timestamp('creado_en', { withTimezone: true }).notNull().defaultNow(),
    cerradoEn: timestamp('cerrado_en', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('prestamo_un_vivo_por_usuario')
      .on(t.usuarioId)
      .where(sql`${t.estado} in ('pre_prestamo', 'activo', 'vencido')`),
    index('prestamo_estado_idx').on(t.estado),
  ],
);

export const prestamoItem = pgTable(
  'prestamo_item',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    prestamoId: uuid('prestamo_id')
      .notNull()
      .references(() => prestamo.id, { onDelete: 'cascade' }),
    ejemplarId: uuid('ejemplar_id')
      .notNull()
      .references(() => ejemplar.id, { onDelete: 'restrict' }),
    vivo: boolean('vivo').notNull().default(true),
    devueltoEn: timestamp('devuelto_en', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('prestamo_item_un_vivo_por_ejemplar')
      .on(t.ejemplarId)
      .where(sql`${t.vivo} = true`),
    index('prestamo_item_prestamo_idx').on(t.prestamoId),
  ],
);

/**
 * Parámetros editables del reglamento. Se editan desde la pantalla de configuración
 */
export const parametro = pgTable('parametro', {
  clave: text('clave').primaryKey(),
  valor: jsonb('valor').notNull(),
  descripcion: text('descripcion'),
  actualizadoEn: timestamp('actualizado_en', { withTimezone: true })
    .notNull()
    .defaultNow(),
  actualizadoPor: text('actualizado_por').references(() => user.id, {
    onDelete: 'set null',
  }),
});
