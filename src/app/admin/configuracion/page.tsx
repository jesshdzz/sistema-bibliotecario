import Form from "next/form";
import { Campo } from "@/components/campo";
import { Encabezado, Seccion } from "@/components/pagina";

// shortcut: sin datos hasta conectar la base; incluye `biblioteca.horario`
const parametros: { clave: string; descripcion: string; valor: number }[] = [];

const esDeMultas = (clave: string) => clave.startsWith("multa");

const GRUPOS = [
  ["Préstamos", parametros.filter((p) => !esDeMultas(p.clave))],
  ["Multas", parametros.filter((p) => esDeMultas(p.clave))],
] as const;

const REJILLA = "tarjeta grid items-end gap-x-6 p-6 sm:grid-cols-2";

export default function Configuracion() {
  return (
    <>
      <Encabezado
        titulo="Configuración"
        descripcion="Parámetros del reglamento y horario de atención."
      />
      {/* shortcut: no guarda nada; los campos no llevan `name`. Sustituir por una server action sobre la tabla `parametro`. */}
      <Form action="/admin/configuracion" className="max-w-3xl space-y-8">
        {parametros.length === 0 && (
          <p className="tarjeta p-6 text-base-content/70">
            No hay parámetros configurados.
          </p>
        )}
        {GRUPOS.filter(([, grupo]) => grupo.length > 0).map(
          ([titulo, grupo]) => (
            <Seccion key={titulo} titulo={titulo}>
              <div className={REJILLA}>
                {grupo.map((p) => (
                  <Campo key={p.clave} etiqueta={p.descripcion}>
                    <input
                      type="number"
                      min={0}
                      required
                      defaultValue={p.valor}
                      className="input w-full"
                    />
                  </Campo>
                ))}
              </div>
            </Seccion>
          ),
        )}
        <button type="submit" className="btn btn-primary">
          Guardar cambios
        </button>
      </Form>
    </>
  );
}
