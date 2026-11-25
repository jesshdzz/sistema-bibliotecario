import Link from "next/link";
import { notFound } from "next/navigation";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { Disponibilidad } from "@/components/tarjeta-titulo";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import { InsigniaEstado } from "@/components/ui/insignia-estado";
import { Dato, Encabezado, Seccion } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { Tarjeta } from "@/components/ui/tarjeta";
import { disponibles, TIPOS, type Titulo } from "@/lib/biblioteca";

export default async function DetalleTitulo({
  params,
}: PageProps<"/catalogo/[id]">) {
  const { id } = await params;
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const t = titulos.find((t) => t.id === id);
  if (!t) notFound();
  const libres = disponibles(t);

  return (
    <main className="contenedor flex-1 py-8 space-y-6">
      <nav aria-label="Ruta" className="breadcrumbs text-sm">
        <ul>
          <li>
            <Link href="/catalogo">Catálogo</Link>
          </li>
          <li>{t.titulo}</li>
        </ul>
      </nav>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start">
        <div className="space-y-8 min-w-0">
          <div className="flex items-start gap-5">
            <EtiquetaLomo signatura={t.clasificacion} />
            <div className="min-w-0 flex-1">
              <Encabezado
                titulo={t.titulo}
                descripcion={`${t.autores}. ${t.editorial}, ${t.anio}.`}
                accion={<Disponibilidad titulo={t} />}
              />
            </div>
          </div>
          <p className="max-w-[68ch] leading-relaxed">{t.resumen}</p>

          <Seccion titulo="Ejemplares">
            <Tabla columnas={["Código de barras", "Estado"]}>
              {t.ejemplares.map((e) => (
                <tr key={e.codigoBarras}>
                  <td>
                    <Mono>{e.codigoBarras}</Mono>
                  </td>
                  <td>
                    <InsigniaEstado estado={e.estado} />
                  </td>
                </tr>
              ))}
            </Tabla>
          </Seccion>
        </div>

        <Tarjeta elemento="aside" className="p-6 space-y-6">
          <dl className="space-y-3">
            <Dato etiqueta="Tipo de material">{TIPOS[t.tipo]}</Dato>
            <Dato etiqueta="Editorial">{t.editorial}</Dato>
            <Dato etiqueta="Año">{t.anio}</Dato>
            <Dato etiqueta="ISBN/ISSN" mono>
              {t.isbn}
            </Dato>
            <Dato etiqueta="Signatura topográfica" mono>
              {t.clasificacion}
            </Dato>
          </dl>
          {libres > 0 ? (
            <Boton href={`/catalogo/${t.id}/solicitar`} anchoCompleto>
              Solicitar préstamo
            </Boton>
          ) : (
            <Alerta tono="error">Sin ejemplares disponibles por ahora.</Alerta>
          )}
        </Tarjeta>
      </div>
    </main>
  );
}
