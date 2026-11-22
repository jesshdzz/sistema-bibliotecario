import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, schema } from "@/db";

const dominios = (defecto: string[]) => ({
  defecto,
  esquema: z.array(z.string()),
});

// Registro único de parámetros (spec 04 §2). Solo las claves ya usadas.
const PARAMETROS = {
  "registro.dominios_alumno": dominios(["gs.utm.mx"]),
  "registro.dominios_trabajador": dominios(["gs.utm.mx", "mixteco.utm.mx"]),
  "registro.semestre_max": {
    defecto: { por_defecto: 10, por_carrera: { POS: 4 } },
    esquema: z.object({
      por_defecto: z.number().int().min(1),
      por_carrera: z.record(z.string(), z.number().int().min(1)),
    }),
  },
} satisfies Record<string, { defecto: unknown; esquema: z.ZodType }>;

type Parametros = {
  [K in keyof typeof PARAMETROS]: z.infer<(typeof PARAMETROS)[K]["esquema"]>;
};

// shortcut: sin caché; añadir una por clave si la lectura pesa.
export async function getParametro<K extends keyof Parametros>(
  clave: K,
): Promise<Parametros[K]> {
  const { defecto, esquema } = PARAMETROS[clave];
  const [fila] = await db
    .select({ valor: schema.parametro.valor })
    .from(schema.parametro)
    .where(eq(schema.parametro.clave, clave));
  const r = esquema.safeParse(fila?.valor);
  return (r.success ? r.data : defecto) as Parametros[K];
}
