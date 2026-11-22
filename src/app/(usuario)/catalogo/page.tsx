import Form from "next/form";
import Link from "next/link";
import { Campo } from "@/components/campo";
import { Encabezado } from "@/components/pagina";
import { PanelLateral } from "@/components/panel-lateral";
import { TarjetaTitulo } from "@/components/tarjeta-titulo";
import { TIPOS, type Titulo } from "@/lib/biblioteca";

const uno = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v);

export default async function Catalogo({
  searchParams,
}: PageProps<"/catalogo">) {
  const sp = await searchParams;
  const q = uno(sp.q) ?? "";
  const tipo = uno(sp.tipo) ?? "";
  const soloDisponibles = uno(sp.disponibles) === "1";
  // shortcut: sin datos hasta conectar la base
  const resultados: Titulo[] = [];

  const filtros = (
    <Form action="/catalogo" className="space-y-4">
      <Campo etiqueta="Buscar">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Título, autor, ISBN…"
          className="input w-full"
        />
      </Campo>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">Tipo de material</legend>
        {[["", "Todos"], ...Object.entries(TIPOS)].map(([valor, etiqueta]) => (
          <label key={valor} className="flex items-center gap-2 py-1 text-sm">
            <input
              type="radio"
              name="tipo"
              value={valor}
              defaultChecked={tipo === valor}
              className="radio radio-primary radio-sm"
            />
            {etiqueta}
          </label>
        ))}
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="disponibles"
          value="1"
          defaultChecked={soloDisponibles}
          className="checkbox checkbox-primary checkbox-sm"
        />
        Solo disponibles
      </label>
      <button type="submit" className="btn btn-primary w-full">
        Aplicar filtros
      </button>
      <Link href="/catalogo" className="btn btn-ghost btn-sm w-full">
        Limpiar
      </Link>
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
        <p className="font-mono text-[13px] font-medium text-base-content/70 mb-4">
          {resultados.length}{" "}
          {resultados.length === 1 ? "resultado" : "resultados"}
        </p>
        {resultados.length === 0 ? (
          <p className="tarjeta p-6 text-base-content/70">
            No se encontraron títulos con esos criterios.
          </p>
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
