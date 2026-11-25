import Form from "next/form";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { Disponibilidad } from "@/components/tarjeta-titulo";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import { Entrada, Selector } from "@/components/ui/campo";
import { Encabezado } from "@/components/ui/pagina";
import { Tabla } from "@/components/ui/tabla";
import { Vacio } from "@/components/ui/tarjeta";
import { TIPOS, type Titulo, uno } from "@/lib/biblioteca";

export default async function Libros({
  searchParams,
}: PageProps<"/admin/catalogo">) {
  const sp = await searchParams;
  const q = uno(sp.q);
  const tipo = uno(sp.tipo);
  const aviso = uno(sp.aviso);
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const resultados = titulos;

  return (
    <>
      <Encabezado
        titulo="Libros"
        descripcion="Títulos y ejemplares del acervo: libros, revistas y artículos."
        accion={<Boton href="/admin/catalogo/nuevo">Nuevo título</Boton>}
      />

      {(aviso === "guardado" || aviso === "eliminado") && (
        <Alerta tono="success">
          {aviso === "guardado" ? "Título guardado." : "Título eliminado."} Este
          es un prototipo: los cambios no se almacenan, por eso la lista sigue
          igual.
        </Alerta>
      )}

      {/* key: al cambiar los filtros se vuelve a montar y los campos coinciden con la URL */}
      <Form
        key={`${q}|${tipo}`}
        action="/admin/catalogo"
        className="tarjeta flex flex-wrap gap-3 p-4"
      >
        <Entrada
          type="search"
          name="q"
          defaultValue={q}
          aria-label="Buscar en el acervo"
          placeholder="Título, autor, ISBN o signatura"
          className="min-w-0 grow basis-64"
        />
        <Selector
          name="tipo"
          defaultValue={tipo}
          aria-label="Tipo de material"
          className="w-auto grow sm:grow-0"
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TIPOS).map(([valor, etiqueta]) => (
            <option key={valor} value={valor}>
              {etiqueta}
            </option>
          ))}
        </Selector>
        <Boton type="submit">Buscar</Boton>
        {(q || tipo) && (
          <Boton href="/admin/catalogo" variante="texto">
            Limpiar
          </Boton>
        )}
      </Form>

      <div>
        <p className="mb-3 text-sm text-base-content/70">
          {resultados.length} de {titulos.length} títulos
        </p>
        {resultados.length === 0 ? (
          <Vacio>No se encontraron títulos con esos criterios.</Vacio>
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
                    <Boton href={`/admin/catalogo/${t.id}`} tamano="xs">
                      Editar
                    </Boton>
                    <Boton
                      href={`/admin/catalogo/${t.id}/eliminar`}
                      variante="texto"
                      color="error"
                      tamano="xs"
                    >
                      Eliminar
                    </Boton>
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
