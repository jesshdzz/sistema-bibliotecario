import Link from "next/link";
import { notFound } from "next/navigation";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { InsigniaEstado } from "@/components/insignia-estado";
import { Dato, Seccion } from "@/components/pagina";
import { Mono, Tabla } from "@/components/tabla";
import { Disponibilidad } from "@/components/tarjeta-titulo";
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
          <header className="flex items-start gap-5">
            <EtiquetaLomo signatura={t.clasificacion} />
            <div className="min-w-0">
              <h1 className="text-3xl font-bold sm:text-4xl">{t.titulo}</h1>
              <p className="mt-2 text-lg text-base-content/70">
                {t.autores}. {t.editorial}, {t.anio}.
              </p>
              <p className="mt-3">
                <Disponibilidad titulo={t} />
              </p>
            </div>
          </header>
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

        <aside className="tarjeta p-6 space-y-6">
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
            <Link
              href={`/catalogo/${t.id}/solicitar`}
              className="btn btn-primary w-full"
            >
              Solicitar préstamo
            </Link>
          ) : (
            <div role="alert" className="alert alert-error">
              <span>Sin ejemplares disponibles por ahora.</span>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
