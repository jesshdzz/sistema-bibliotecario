import Form from "next/form";
import { TablaPrestamos } from "@/components/tabla-prestamos";
import { Boton } from "@/components/ui/boton";
import { Entrada } from "@/components/ui/campo";
import { Encabezado } from "@/components/ui/pagina";
import { normalizar, type Prestamo, uno } from "@/lib/biblioteca";
import { Pestanas } from "./celdas";

const FILTROS = [
  ["", "Todos"],
  ["pre_prestamo", "Por recoger"],
  ["activo", "Activos"],
  ["vencido", "Vencidos"],
  ["devuelto", "Devueltos"],
  ["cancelado", "Cancelados"],
];

export default async function Prestamos({
  searchParams,
}: PageProps<"/admin/prestamos">) {
  const sp = await searchParams;
  const estado = uno(sp.estado);
  const q = uno(sp.q);
  const texto = normalizar(q);
  // shortcut: sin datos hasta conectar la base
  const prestamos: Prestamo[] = [];
  const encontrados = prestamos.filter((p) =>
    normalizar(
      `${p.folio} ${p.usuario.nombre} ${p.usuario.matricula}`,
    ).includes(texto),
  );
  const con = (valor: string) =>
    encontrados.filter((p) => !valor || p.estado === valor);

  return (
    <>
      <Encabezado
        titulo="Préstamos"
        descripcion="Entrega solicitudes y registra devoluciones."
      />
      {/* key: vuelve a montar el campo para que refleje la búsqueda de la URL */}
      <Form
        key={q}
        action="/admin/prestamos"
        className="tarjeta flex flex-wrap gap-3 p-4"
      >
        {estado && <input type="hidden" name="estado" value={estado} />}
        <Entrada
          type="search"
          name="q"
          defaultValue={q}
          aria-label="Buscar por folio o usuario"
          placeholder="Folio, nombre o matrícula"
          className="min-w-0 grow basis-64"
        />
        <Boton type="submit">Buscar</Boton>
        {q && (
          <Boton
            href={
              estado ? `/admin/prestamos?estado=${estado}` : "/admin/prestamos"
            }
            variante="texto"
          >
            Limpiar
          </Boton>
        )}
      </Form>
      <Pestanas
        filtros={FILTROS.map(([valor, etiqueta]) => ({
          valor,
          etiqueta,
          total: con(valor).length,
        }))}
        activo={estado}
        q={q}
      />
      <TablaPrestamos admin prestamos={con(estado)} />
    </>
  );
}
