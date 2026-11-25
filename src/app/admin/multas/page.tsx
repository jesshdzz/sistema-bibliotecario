import { Boton } from "@/components/ui/boton";
import { InsigniaMulta } from "@/components/ui/insignia-estado";
import { Encabezado, Seccion } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { Cifra, Vacio } from "@/components/ui/tarjeta";
import {
  MOTIVOS,
  type Multa,
  type Prestamo,
  sancion,
  uno,
} from "@/lib/biblioteca";
import { CeldaUsuario, Pestanas, TablaPendientes } from "../prestamos/celdas";

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
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-3">
        {cifras.map(([etiqueta, valor, nota]) => (
          <li key={etiqueta}>
            <Cifra etiqueta={etiqueta} valor={valor} nota={nota} />
          </li>
        ))}
      </ul>

      <Seccion titulo="Retardos en curso">
        {retardos.length === 0 ? (
          <Vacio>No hay préstamos fuera de plazo.</Vacio>
        ) : (
          <TablaPendientes
            prestamos={retardos}
            accion={(p) => (
              <Boton href={`/admin/devoluciones?q=${p.folio}`} tamano="xs">
                Registrar devolución
              </Boton>
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
                  <InsigniaMulta estado={m.estado} />
                </td>
                <td>
                  {/* shortcut: los botones no hacen nada en el prototipo; conectar a server actions cuando exista la tabla `multa`. */}
                  {m.estado === "pendiente" && (
                    <div className="flex gap-1">
                      {m.motivo !== "retraso" && (
                        <Boton tamano="xs">Registrar reposición</Boton>
                      )}
                      <Boton variante="texto" tamano="xs">
                        Condonar
                      </Boton>
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
