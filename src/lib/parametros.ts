import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";

// Registro único de parámetros (spec 04 §2). Solo las claves ya usadas.
const PARAMETROS = {
  "registro.dominios_alumno": {
    defecto: ["gs.utm.mx"],
    esquema: z.array(z.string()),
  },
  "registro.dominios_trabajador": {
    defecto: ["gs.utm.mx", "mixteco.utm.mx"],
    esquema: z.array(z.string()),
  },
};

// shortcut: sin caché y todas las claves son string[]; generalizar el tipo al añadir otras formas.
export async function getParametro(
  clave: keyof typeof PARAMETROS,
): Promise<string[]> {
  const { defecto, esquema } = PARAMETROS[clave];
  const [fila] = await db
    .select({ valor: schema.parametro.valor })
    .from(schema.parametro)
    .where(eq(schema.parametro.clave, clave));
  const r = esquema.safeParse(fila?.valor);
  return r.success ? r.data : defecto;
}
