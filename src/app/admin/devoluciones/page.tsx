import Form from "next/form";
import { Boton } from "@/components/ui/boton";
import { Campo, Entrada } from "@/components/ui/campo";
import { Insignia } from "@/components/ui/insignia";
import { Encabezado, Seccion } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { Vacio } from "@/components/ui/tarjeta";
import {
  diasRetraso,
  fecha,
  normalizar,
  type Prestamo,
  uno,
} from "@/lib/biblioteca";
import {
  CeldaMaterial,
  CeldaUsuario,
  TablaPendientes,
} from "../prestamos/celdas";

export default async function Devoluciones({
  searchParams,
}: PageProps<"/admin/devoluciones">) {
  const q = uno((await searchParams).q);
  const texto = normalizar(q);
  // shortcut: sin datos hasta conectar la base
  const prestamos: Prestamo[] = [];
  const pendientes = prestamos
    .filter(
      (p) =>
        (p.estado === "activo" || p.estado === "vencido") &&
        [p.folio, ...p.titulos.map((t) => t.codigoBarras)].some((codigo) =>
          codigo?.toLowerCase().includes(texto),
        ),
    )
    // Lo más atrasado primero: es lo que urge recibir.
    .sort((a, b) => (a.venceEn ?? "").localeCompare(b.venceEn ?? ""));
  const recientes = prestamos
    .filter((p) => p.estado === "devuelto")
    .sort((a, b) => (b.devueltoEn ?? "").localeCompare(a.devueltoEn ?? ""));

  return (
    <>
      <Encabezado
        titulo="Devoluciones"
        descripcion="Escanea el código de barras del ejemplar o escribe el folio del préstamo para recibirlo en el mostrador."
      />
      {/* key: vuelve a montar el campo para que refleje la búsqueda de la URL */}
      <Form
        key={q}
        action="/admin/devoluciones"
        className="tarjeta flex flex-wrap items-end gap-x-3 gap-y-2 p-5"
      >
        <div className="min-w-0 grow basis-64">
          <Campo etiqueta="Código de barras o folio">
            <Entrada
              type="search"
              name="q"
              mono
              defaultValue={q}
              autoFocus
              placeholder="UTM-000102 o BIB-2026-004821"
            />
          </Campo>
        </div>
        <div className="flex gap-2 pb-1">
          <Boton type="submit">Buscar</Boton>
          {q && (
            <Boton href="/admin/devoluciones" variante="texto">
              Ver todos
            </Boton>
          )}
        </div>
      </Form>

      <Seccion titulo="Pendientes de devolver">
        {pendientes.length === 0 ? (
          <Vacio>
            {q
              ? `Ningún préstamo pendiente coincide con «${q}».`
              : "No hay préstamos pendientes de devolver."}
          </Vacio>
        ) : (
          <TablaPendientes
            prestamos={pendientes}
            // shortcut: el botón no hace nada en el prototipo; conectar a una server action que cierre el préstamo y libere los ejemplares.
            accion={() => <Boton tamano="xs">Registrar devolución</Boton>}
          />
        )}
      </Seccion>

      <Seccion titulo="Devoluciones recientes">
        <Tabla
          columnas={[
            "Folio",
            "Usuario",
            "Material",
            "Vencía",
            "Devuelto",
            "Entrega",
          ]}
        >
          {recientes.map((p) => (
            <tr key={p.folio}>
              <td>
                <Mono>{p.folio}</Mono>
              </td>
              <CeldaUsuario usuario={p.usuario} />
              <CeldaMaterial p={p} />
              <td className="whitespace-nowrap text-base-content/70">
                {fecha(p.venceEn)}
              </td>
              <td className="whitespace-nowrap">{fecha(p.devueltoEn)}</td>
              <td>
                {diasRetraso(p.venceEn, p.devueltoEn) > 0 ? (
                  <Insignia color="warning">Con retraso</Insignia>
                ) : (
                  <Insignia>A tiempo</Insignia>
                )}
              </td>
            </tr>
          ))}
        </Tabla>
      </Seccion>
    </>
  );
}
