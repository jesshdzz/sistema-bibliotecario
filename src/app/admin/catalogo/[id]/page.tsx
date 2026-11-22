import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Campo } from "@/components/campo";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { etiquetaEstado } from "@/components/insignia-estado";
import { Encabezado, Seccion } from "@/components/pagina";
import { Mono, Tabla } from "@/components/tabla";
import { estadoEjemplar } from "@/db/schema";
import { TIPOS, type Titulo } from "@/lib/biblioteca";

const MONO = "font-mono text-[13px] font-medium";

/** Alta (`/admin/catalogo/nuevo`) y edición de un título con el mismo formulario. */
export default async function EditarTitulo({
  params,
}: PageProps<"/admin/catalogo/[id]">) {
  const { id } = await params;
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const t = titulos.find((t) => t.id === id);
  if (!t && id !== "nuevo") notFound();

  return (
    <>
      <Encabezado
        titulo={t ? "Editar título" : "Nuevo título"}
        descripcion={
          t
            ? "Ficha bibliográfica y ejemplares del título."
            : "Registra la ficha bibliográfica. Los ejemplares se agregan después de guardarla."
        }
        accion={
          t && (
            <Link
              href={`/admin/catalogo/${t.id}/eliminar`}
              className="btn btn-outline btn-error"
            >
              Eliminar título
            </Link>
          )
        }
      />

      {/* shortcut: no guarda nada; los campos no llevan `name` y el formulario sólo regresa a la lista con el aviso. Sustituir por una server action con validación. */}
      <Form
        action="/admin/catalogo"
        className="tarjeta flex flex-col gap-x-6 gap-y-4 p-6 sm:flex-row"
      >
        <input type="hidden" name="aviso" value="guardado" />
        {t && <EtiquetaLomo signatura={t.clasificacion} />}
        <div className="min-w-0 flex-1">
          <div className="grid gap-x-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Campo etiqueta="Título">
                <input
                  required
                  defaultValue={t?.titulo}
                  className="input w-full"
                />
              </Campo>
            </div>
            <Campo etiqueta="Autores">
              <input defaultValue={t?.autores} className="input w-full" />
            </Campo>
            <Campo etiqueta="Editorial">
              <input defaultValue={t?.editorial} className="input w-full" />
            </Campo>
            <Campo etiqueta="Año">
              <input
                inputMode="numeric"
                defaultValue={t?.anio}
                className="input w-full"
              />
            </Campo>
            <Campo etiqueta="Tipo de material">
              <select defaultValue={t?.tipo} className="select w-full">
                {Object.entries(TIPOS).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ))}
              </select>
            </Campo>
            <Campo etiqueta="ISBN o ISSN">
              <input
                defaultValue={t?.isbn}
                className={`input w-full ${MONO}`}
              />
            </Campo>
            <Campo etiqueta="Signatura topográfica">
              <input
                required
                defaultValue={t?.clasificacion}
                className={`input w-full ${MONO}`}
              />
            </Campo>
            <div className="sm:col-span-2">
              <Campo etiqueta="Resumen">
                <textarea
                  rows={4}
                  defaultValue={t?.resumen}
                  className="textarea w-full"
                />
              </Campo>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Link href="/admin/catalogo" className="btn btn-ghost">
              Cancelar
            </Link>
            <button type="submit" className="btn btn-primary">
              {t ? "Guardar cambios" : "Registrar título"}
            </button>
          </div>
        </div>
      </Form>

      {t && (
        <Seccion titulo="Ejemplares">
          {/* shortcut: los controles de ejemplares no hacen nada en el prototipo; cada uno será una server action (cambiar estado, dar de baja, agregar). */}
          <Tabla columnas={["Código de barras", "Estado", "Acciones"]}>
            {t.ejemplares.map((e) => (
              <tr key={e.codigoBarras}>
                <td>
                  <Mono>{e.codigoBarras}</Mono>
                </td>
                <td>
                  <select
                    defaultValue={e.estado}
                    aria-label={`Estado del ejemplar ${e.codigoBarras}`}
                    className="select select-sm w-44"
                  >
                    {estadoEjemplar.enumValues.map((estado) => (
                      <option key={estado} value={estado}>
                        {etiquetaEstado(estado)}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    type="button"
                    disabled={e.estado === "baja"}
                    className="btn btn-ghost btn-xs text-error"
                  >
                    Dar de baja
                  </button>
                </td>
              </tr>
            ))}
          </Tabla>
          <div className="mt-4 flex flex-wrap gap-3">
            <input
              aria-label="Código de barras del nuevo ejemplar"
              placeholder="UTM-000000"
              className={`input w-48 ${MONO}`}
            />
            <button type="button" className="btn btn-outline">
              Agregar ejemplar
            </button>
          </div>
        </Seccion>
      )}
    </>
  );
}
