import Form from "next/form";
import { PanelLateral } from "@/components/panel-lateral";
import { TarjetaTitulo } from "@/components/tarjeta-titulo";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada, Grupo, Opcion } from "@/components/ui/campo";
import { Encabezado } from "@/components/ui/pagina";
import { Mono } from "@/components/ui/tabla";
import { Vacio } from "@/components/ui/tarjeta";
import { TIPOS, type Titulo, uno } from "@/lib/biblioteca";

export default async function Catalogo({
  searchParams,
}: PageProps<"/catalogo">) {
  const sp = await searchParams;
  const q = uno(sp.q);
  const tipo = uno(sp.tipo);
  const soloDisponibles = uno(sp.disponibles) === "1";
  // shortcut: sin datos hasta conectar la base
  const resultados: Titulo[] = [];

  const filtros = (
    <Form action="/catalogo" className="space-y-4">
      <Campo etiqueta="Buscar">
        <Entrada
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Título, autor, ISBN…"
        />
      </Campo>
      <Grupo etiqueta="Tipo de material">
        {[["", "Todos"], ...Object.entries(TIPOS)].map(([valor, etiqueta]) => (
          <Opcion
            key={valor}
            tipo="radio"
            etiqueta={etiqueta}
            name="tipo"
            value={valor}
            defaultChecked={tipo === valor}
          />
        ))}
      </Grupo>
      <Opcion
        tipo="checkbox"
        etiqueta="Solo disponibles"
        name="disponibles"
        value="1"
        defaultChecked={soloDisponibles}
      />
      <Boton type="submit" anchoCompleto>
        Aplicar filtros
      </Boton>
      <Boton href="/catalogo" variante="texto" anchoCompleto>
        Limpiar
      </Boton>
    </Form>
  );

  return (
    <main className="contenedor flex-1 py-8 space-y-6">
      <Encabezado
        titulo="Catálogo"
        descripcion="Busca por título, autor, ISBN o signatura topográfica."
      />
      {/* key: al cambiar los filtros se vuelve a montar; cierra el drawer móvil y sincroniza el formulario con la URL */}
      <PanelLateral
        key={JSON.stringify(sp)}
        id="filtros"
        etiqueta="Filtros"
        lateral={filtros}
      >
        <p className="mb-4 text-base-content/70">
          <Mono>
            {resultados.length}{" "}
            {resultados.length === 1 ? "resultado" : "resultados"}
          </Mono>
        </p>
        {resultados.length === 0 ? (
          <Vacio>No se encontraron títulos con esos criterios.</Vacio>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {resultados.map((t) => (
              <TarjetaTitulo key={t.id} titulo={t} />
            ))}
          </div>
        )}
      </PanelLateral>
    </main>
  );
}
