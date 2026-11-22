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
      .int("El semestre debe ser un número entero.")
      .min(1, "El semestre debe ser 1 o mayor.")
      .max(10, "El semestre debe ser menor o igual a 10."),
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

// Valida lo declarado en el registro y descarta lo que no corresponde al tipo.
export function datosRegistro(
  entrada: Record<string, unknown>,
  dominios: Dominios,
) {
  const r = registroSchema.safeParse({
    ...entrada,
    tipoSolicitado: entrada.tipoSolicitado ?? "publico",
  });
  if (!r.success) return { error: r.error.issues[0].message };
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
