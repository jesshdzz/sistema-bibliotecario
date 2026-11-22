import Form from "next/form";
import { Encabezado } from "@/components/pagina";
import { TablaPrestamos } from "@/components/tabla-prestamos";
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
        accion={
          // key: vuelve a montar el campo para que refleje la búsqueda de la URL
          <Form
            key={q}
            action="/admin/prestamos"
            className="join w-full sm:w-auto"
          >
            {estado && <input type="hidden" name="estado" value={estado} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              aria-label="Buscar por folio o usuario"
              placeholder="Folio, nombre o matrícula"
              className="input join-item w-full sm:w-72"
            />
            <button type="submit" className="btn btn-primary join-item">
              Buscar
            </button>
          </Form>
        }
      />
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
