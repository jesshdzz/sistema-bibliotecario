import Form from "next/form";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada } from "@/components/ui/campo";
import { Encabezado, Seccion } from "@/components/ui/pagina";
import { Vacio } from "@/components/ui/tarjeta";

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
          <Vacio>No hay parámetros configurados.</Vacio>
        )}
        {GRUPOS.filter(([, grupo]) => grupo.length > 0).map(
          ([titulo, grupo]) => (
            <Seccion key={titulo} titulo={titulo}>
              <div className={REJILLA}>
                {grupo.map((p) => (
                  <Campo key={p.clave} etiqueta={p.descripcion}>
                    <Entrada
                      type="number"
                      min={0}
                      required
                      defaultValue={p.valor}
                    />
                  </Campo>
                ))}
              </div>
            </Seccion>
          ),
        )}
        <Boton type="submit">Guardar cambios</Boton>
      </Form>
    </>
  );
}
