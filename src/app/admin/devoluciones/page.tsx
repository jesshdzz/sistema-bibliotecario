import Form from "next/form";
import Link from "next/link";
import { Campo } from "@/components/campo";
import { Encabezado, Seccion } from "@/components/pagina";
import { Mono, Tabla } from "@/components/tabla";
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
            <input
              type="search"
              name="q"
              defaultValue={q}
              // biome-ignore lint/a11y/noAutofocus: el lector de códigos escribe donde está el foco
              autoFocus
              placeholder="UTM-000102 o BIB-2026-004821"
              className="input w-full font-mono text-[13px] font-medium"
            />
          </Campo>
        </div>
        <div className="flex gap-2 pb-1">
          <button type="submit" className="btn btn-primary">
            Buscar
          </button>
          {q && (
            <Link href="/admin/devoluciones" className="btn btn-ghost">
              Ver todos
            </Link>
          )}
        </div>
      </Form>

      <Seccion titulo="Pendientes de devolver">
        {pendientes.length === 0 ? (
          <p className="tarjeta p-6 text-base-content/70">
            {q
              ? `Ningún préstamo pendiente coincide con «${q}».`
              : "No hay préstamos pendientes de devolver."}
          </p>
        ) : (
          <TablaPendientes
            prestamos={pendientes}
            // shortcut: el botón no hace nada en el prototipo; conectar a una server action que cierre el préstamo y libere los ejemplares.
            accion={() => (
              <button
                type="button"
                className="btn btn-primary btn-xs whitespace-nowrap"
              >
                Registrar devolución
              </button>
            )}
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
                  <span className="badge badge-warning badge-sm whitespace-nowrap">
                    Con retraso
                  </span>
                ) : (
                  <span className="badge badge-ghost badge-sm whitespace-nowrap">
                    A tiempo
                  </span>
                )}
              </td>
            </tr>
          ))}
        </Tabla>
      </Seccion>
    </>
  );
}
