import Form from "next/form";
import Link from "next/link";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { Encabezado } from "@/components/pagina";
import { Tabla } from "@/components/tabla";
import { Disponibilidad } from "@/components/tarjeta-titulo";
import { TIPOS, type Titulo } from "@/lib/biblioteca";

const uno = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

export default async function Libros({
  searchParams,
}: PageProps<"/admin/catalogo">) {
  const sp = await searchParams;
  const q = uno(sp.q) ?? "";
  const tipo = uno(sp.tipo) ?? "";
  const aviso = uno(sp.aviso);
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const resultados = titulos;

  return (
    <>
      <Encabezado
        titulo="Libros"
        descripcion="Títulos y ejemplares del acervo: libros, revistas y artículos."
        accion={
          <Link href="/admin/catalogo/nuevo" className="btn btn-primary">
            Nuevo título
          </Link>
        }
      />

      {(aviso === "guardado" || aviso === "eliminado") && (
        <div role="alert" className="alert alert-success">
          <span>
            {aviso === "guardado" ? "Título guardado." : "Título eliminado."}{" "}
            Este es un prototipo: los cambios no se almacenan, por eso la lista
            sigue igual.
          </span>
        </div>
      )}

      {/* key: al cambiar los filtros se vuelve a montar y los campos coinciden con la URL */}
      <Form
        key={`${q}|${tipo}`}
        action="/admin/catalogo"
        className="tarjeta flex flex-wrap gap-3 p-4"
      >
        <input
          type="search"
          name="q"
          defaultValue={q}
          aria-label="Buscar en el acervo"
          placeholder="Título, autor, ISBN o signatura"
          className="input min-w-0 grow basis-64"
        />
        <select
          name="tipo"
          defaultValue={tipo}
          aria-label="Tipo de material"
          className="select w-auto grow sm:grow-0"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPOS).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">
          Buscar
        </button>
        {(q || tipo) && (
          <Link href="/admin/catalogo" className="btn btn-ghost">
            Limpiar
          </Link>
        )}
      </Form>

      <div>
        <p className="mb-3 text-sm text-base-content/70">
          {resultados.length} de {titulos.length} títulos
        </p>
        {resultados.length === 0 ? (
          <p className="tarjeta p-6 text-base-content/70">
            No se encontraron títulos con esos criterios.
          </p>
        ) : (
          <Tabla
            columnas={["Signatura", "Título", "Tipo", "Ejemplares", "Acciones"]}
          >
            {resultados.map((t) => (
              <tr key={t.id}>
                <td>
                  <EtiquetaLomo signatura={t.clasificacion} />
                </td>
                <td className="min-w-56">
                  <p className="font-medium">{t.titulo}</p>
                  <p className="text-sm text-base-content/70">{t.autores}</p>
                </td>
                <td>{TIPOS[t.tipo]}</td>
                <td className="whitespace-nowrap">
                  <Disponibilidad titulo={t} />
                </td>
                <td>
                  <div className="flex gap-1">
                    <Link
                      href={`/admin/catalogo/${t.id}`}
                      className="btn btn-primary btn-xs"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/catalogo/${t.id}/eliminar`}
                      className="btn btn-ghost btn-xs text-error"
                    >
                      Eliminar
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </Tabla>
        )}
      </div>
    </>
  );
}
