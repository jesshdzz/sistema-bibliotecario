import Link from "next/link";
import { Encabezado, Seccion } from "@/components/pagina";
import { Mono, Tabla } from "@/components/tabla";
import {
  MOTIVOS,
  type Multa,
  type Prestamo,
  sancion,
  uno,
} from "@/lib/biblioteca";
import { CeldaUsuario, Pestanas, TablaPendientes } from "../prestamos/celdas";

// warning = multa pendiente, según el design system.
const ESTADOS: Record<Multa["estado"], [string, string]> = {
  pendiente: ["Pendiente", "badge-warning"],
  cumplida: ["Cumplida", "badge-success"],
  condonada: ["Condonada", "badge-ghost"],
};

const FILTROS = [
  ["", "Todas"],
  ["pendiente", "Pendientes"],
  ["cumplida", "Cumplidas"],
  ["condonada", "Condonadas"],
];

export default async function Multas({
  searchParams,
}: PageProps<"/admin/multas">) {
  const estado = uno((await searchParams).estado);
  // shortcut: sin datos hasta conectar la base
  const multas: Multa[] = [];
  const prestamos: Prestamo[] = [];
  const con = (valor: string) =>
    multas.filter((m) => !valor || m.estado === valor);
  const pendientes = con("pendiente");
  const retardos = prestamos.filter((p) => p.estado === "vencido");
  const cifras = [
    [
      "Suspensiones en curso",
      pendientes.filter((m) => m.motivo === "retraso").length,
      "Por devolver con retraso",
    ],
    [
      "Reposiciones pendientes",
      pendientes.filter((m) => m.motivo !== "retraso").length,
      "Por extravío o maltrato",
    ],
    [
      "Usuarios con multa",
      new Set(pendientes.map((m) => m.usuario.id)).size,
      "Con al menos una multa pendiente",
    ],
  ] as const;

  return (
    <>
      <Encabezado
        titulo="Retardos y multas"
        descripcion="Préstamos fuera de plazo y multas: días sin préstamo por retraso y reposición del ejemplar por extravío o maltrato."
      />
      <dl className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {cifras.map(([etiqueta, valor, nota]) => (
          <div key={etiqueta} className="tarjeta p-5">
            <dt className="text-sm text-base-content/70">{etiqueta}</dt>
            <dd className="mt-1 text-3xl font-semibold">{valor}</dd>
            <dd className="mt-1 text-sm text-base-content/70">{nota}</dd>
          </div>
        ))}
      </dl>

      <Seccion titulo="Retardos en curso">
        {retardos.length === 0 ? (
          <p className="tarjeta p-6 text-base-content/70">
            No hay préstamos fuera de plazo.
          </p>
        ) : (
          <TablaPendientes
            prestamos={retardos}
            accion={(p) => (
              <Link
                href={`/admin/devoluciones?q=${p.folio}`}
                className="btn btn-primary btn-xs whitespace-nowrap"
              >
                Registrar devolución
              </Link>
            )}
          />
        )}
      </Seccion>

      <Seccion titulo="Multas">
        <div className="space-y-4">
          <Pestanas
            filtros={FILTROS.map(([valor, etiqueta]) => ({
              valor,
              etiqueta,
              total: con(valor).length,
            }))}
            activo={estado}
          />
          <Tabla
            columnas={[
              "Folio",
              "Usuario",
              "Motivo",
              "Sanción",
              "Estado",
              "Acciones",
            ]}
          >
            {con(estado).map((m) => (
              <tr key={m.folio}>
                <td>
                  <Mono>{m.folio}</Mono>
                </td>
                <CeldaUsuario usuario={m.usuario} />
                <td>{MOTIVOS[m.motivo]}</td>
                <td className="whitespace-nowrap font-medium">{sancion(m)}</td>
                <td>
                  <span
                    className={`badge ${ESTADOS[m.estado][1]} badge-sm whitespace-nowrap`}
                  >
                    {ESTADOS[m.estado][0]}
                  </span>
                </td>
                <td>
                  {/* shortcut: los botones no hacen nada en el prototipo; conectar a server actions cuando exista la tabla `multa`. */}
                  {m.estado === "pendiente" && (
                    <div className="flex gap-1">
                      {m.motivo !== "retraso" && (
                        <button
                          type="button"
                          className="btn btn-primary btn-xs whitespace-nowrap"
                        >
                          Registrar reposición
                        </button>
                      )}
                      <button type="button" className="btn btn-ghost btn-xs">
                        Condonar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </Tabla>
        </div>
      </Seccion>
    </>
  );
}
