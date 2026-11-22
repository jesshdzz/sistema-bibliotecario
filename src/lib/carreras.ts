import { and, asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { getParametro } from "./parametros";
import type { Carreras } from "./registro";

export async function getCarreras(): Promise<Carreras> {
  const { por_defecto, por_carrera } = await getParametro(
    "registro.semestre_max",
  );
  const filas = await db
    .select({
      codigo: schema.catalogoValor.codigo,
      etiqueta: schema.catalogoValor.etiqueta,
    })
    .from(schema.catalogoValor)
    .where(
      and(
        eq(schema.catalogoValor.catalogo, "carrera"),
        eq(schema.catalogoValor.activo, true),
      ),
    )
    .orderBy(
      asc(schema.catalogoValor.orden),
      asc(schema.catalogoValor.etiqueta),
    );
  return Object.fromEntries(
    filas.map((f) => [
      f.codigo,
      {
        etiqueta: f.etiqueta,
        semestreMax: por_carrera[f.codigo] ?? por_defecto,
      },
    ]),
  );
}
