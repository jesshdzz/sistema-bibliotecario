import { notFound } from "next/navigation";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import { Encabezado } from "@/components/ui/pagina";
import { Tarjeta } from "@/components/ui/tarjeta";
import type { Titulo } from "@/lib/biblioteca";

/** Confirmación previa a eliminar un título: una página, sin JavaScript ni estado de modal. */
export default async function EliminarTitulo({
  params,
}: PageProps<"/admin/catalogo/[id]/eliminar">) {
  const { id } = await params;
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const t = titulos.find((t) => t.id === id);
  if (!t) notFound();
  const fuera = t.ejemplares.filter((e) =>
    ["prestado", "apartado", "en_sala"].includes(e.estado),
  ).length;

  return (
    <>
      <Encabezado
        titulo="Eliminar título"
        descripcion="Se quitará del catálogo la ficha junto con todos sus ejemplares. Esta acción no se puede deshacer."
      />
      <Tarjeta className="max-w-2xl space-y-6 p-6">
        <div className="flex gap-4">
          <EtiquetaLomo signatura={t.clasificacion} />
          <div className="min-w-0">
            <p className="text-lg font-semibold leading-snug">{t.titulo}</p>
            <p className="text-sm text-base-content/70">
              {t.autores}. {t.editorial}, {t.anio}.
            </p>
            <p className="mt-3 text-sm">
              Ejemplares que se eliminarán: {t.ejemplares.length}
            </p>
          </div>
        </div>
        {fuera > 0 && (
          <Alerta tono="warning">
            Ejemplares en préstamo, en sala o apartados: {fuera}. Conviene
            esperar su devolución antes de eliminar el título.
          </Alerta>
        )}
        <div className="flex flex-wrap justify-end gap-3">
          <Boton href="/admin/catalogo" variante="texto">
            Cancelar
          </Boton>
          {/* shortcut: no elimina nada, sólo regresa a la lista con el aviso; sustituir por una server action al conectar la BD. */}
          <Boton href="/admin/catalogo?aviso=eliminado" color="error">
            Eliminar título
          </Boton>
        </div>
      </Tarjeta>
    </>
  );
}
