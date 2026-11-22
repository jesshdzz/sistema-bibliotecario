import { z } from "zod";

const texto = (mensaje: string) =>
  z.string({ error: mensaje }).trim().min(1, mensaje);

const registroSchema = z.discriminatedUnion("tipoSolicitado", [
  z.object({
    tipoSolicitado: z.literal("alumno"),
    matricula: texto("La matrícula es obligatoria.").length(
      10,
      "Matrícula inválida.",
    ),
    carrera: texto("La carrera es obligatoria."),
    semestre: z
      .number({ error: "El semestre es obligatorio." })
      .int("El semestre debe ser un número entero."),
  }),
  z.object({
    tipoSolicitado: z.literal("trabajador"),
    numeroTrabajador: texto("El número de trabajador es obligatorio."),
  }),
  z.object({ tipoSolicitado: z.literal("publico") }),
]);

const VACIO = {
  matricula: null,
  carrera: null,
  semestre: null,
  numeroTrabajador: null,
};

export type Dominios = { alumno: string[]; trabajador: string[] };
export type Carreras = Record<
  string,
  { etiqueta: string; semestreMax: number }
>;

// Valida lo declarado en el registro y descarta lo que no corresponde al tipo.
export function datosRegistro(
  entrada: Record<string, unknown>,
  { dominios, carreras }: { dominios: Dominios; carreras: Carreras },
) {
  const r = registroSchema.safeParse({
    ...entrada,
    tipoSolicitado: entrada.tipoSolicitado ?? "publico",
  });
  if (!r.success) return { error: r.error.issues[0].message };
  if (r.data.tipoSolicitado === "alumno") {
    const carrera = Object.hasOwn(carreras, r.data.carrera)
      ? carreras[r.data.carrera]
      : undefined;
    if (!carrera) return { error: "Elige una carrera válida." };
    if (r.data.semestre < 1 || r.data.semestre > carrera.semestreMax)
      return {
        error: `El semestre debe estar entre 1 y ${carrera.semestreMax}.`,
      };
  }
  const permitidos =
    r.data.tipoSolicitado === "publico"
      ? null
      : dominios[r.data.tipoSolicitado];
  // Dominio exacto tras la última "@": endsWith sin "@" dejaría pasar x@evilgs.utm.mx.
  const dominio = String(entrada.email).split("@").pop()?.toLowerCase() ?? "";
  if (permitidos && !permitidos.includes(dominio))
    return {
      error: `Usa tu correo institucional (${permitidos.map((d) => `@${d}`).join(" o ")}).`,
    };
  return { datos: { ...VACIO, ...r.data } };
}
