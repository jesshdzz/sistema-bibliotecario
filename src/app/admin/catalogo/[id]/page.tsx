import Form from "next/form";
import { notFound } from "next/navigation";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { Boton } from "@/components/ui/boton";
import { AreaTexto, Campo, Entrada, Selector } from "@/components/ui/campo";
import { etiquetaEstado } from "@/components/ui/insignia-estado";
import { Encabezado, Seccion } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { estadoEjemplar } from "@/db/schema";
import { TIPOS, type Titulo } from "@/lib/biblioteca";

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
            <Boton
              href={`/admin/catalogo/${t.id}/eliminar`}
              variante="contorno"
              color="error"
            >
              Eliminar título
            </Boton>
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
                <Entrada required defaultValue={t?.titulo} />
              </Campo>
            </div>
            <Campo etiqueta="Autores">
              <Entrada defaultValue={t?.autores} />
            </Campo>
            <Campo etiqueta="Editorial">
              <Entrada defaultValue={t?.editorial} />
            </Campo>
            <Campo etiqueta="Año">
              <Entrada inputMode="numeric" defaultValue={t?.anio} />
            </Campo>
            <Campo etiqueta="Tipo de material">
              <Selector defaultValue={t?.tipo}>
                {Object.entries(TIPOS).map(([valor, etiqueta]) => (
                  <option key={valor} value={valor}>
                    {etiqueta}
                  </option>
                ))}
              </Selector>
            </Campo>
            <Campo etiqueta="ISBN o ISSN">
              <Entrada mono defaultValue={t?.isbn} />
            </Campo>
            <Campo etiqueta="Signatura topográfica">
              <Entrada mono required defaultValue={t?.clasificacion} />
            </Campo>
            <div className="sm:col-span-2">
              <Campo etiqueta="Resumen">
                <AreaTexto rows={4} defaultValue={t?.resumen} />
              </Campo>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Boton href="/admin/catalogo" variante="texto">
              Cancelar
            </Boton>
            <Boton type="submit">
              {t ? "Guardar cambios" : "Registrar título"}
            </Boton>
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
                  <Selector
                    tamano="sm"
                    defaultValue={e.estado}
                    aria-label={`Estado del ejemplar ${e.codigoBarras}`}
                    className="w-44"
                  >
                    {estadoEjemplar.enumValues.map((estado) => (
                      <option key={estado} value={estado}>
                        {etiquetaEstado(estado)}
                      </option>
                    ))}
                  </Selector>
                </td>
                <td>
                  <Boton
                    variante="texto"
                    color="error"
                    tamano="xs"
                    disabled={e.estado === "baja"}
                  >
                    Dar de baja
                  </Boton>
                </td>
              </tr>
            ))}
          </Tabla>
          <div className="mt-4 flex flex-wrap gap-3">
            <Entrada
              mono
              aria-label="Código de barras del nuevo ejemplar"
              placeholder="UTM-000000"
              className="w-48"
            />
            <Boton variante="contorno">Agregar ejemplar</Boton>
          </div>
        </Seccion>
      )}
    </>
  );
}
