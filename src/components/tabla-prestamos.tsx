import { fecha, MODALIDADES, type Prestamo } from "@/lib/biblioteca";
import { InsigniaEstado } from "./insignia-estado";
import { Mono, Tabla } from "./tabla";

// shortcut: los botones no hacen nada en el prototipo; conectar a server actions.
function Acciones({ p, admin }: { p: Prestamo; admin: boolean }) {
  const acciones = admin
    ? p.estado === "pre_prestamo"
      ? ["Entregar", "Cancelar"]
      : p.estado === "activo" || p.estado === "vencido"
        ? ["Registrar devolución"]
        : []
    : p.estado === "activo"
      ? ["Renovar"]
      : p.estado === "pre_prestamo"
        ? ["Cancelar"]
        : [];
  return (
    <div className="flex gap-1 whitespace-nowrap">
      {acciones.map((accion, i) => (
        <button
          key={accion}
          type="button"
          className={`btn btn-xs ${i === 0 ? "btn-primary" : "btn-ghost"}`}
        >
          {accion}
        </button>
      ))}
    </div>
  );
}

/** Lista de préstamos. `admin` muestra las acciones de mostrador y, salvo `conUsuario={false}`, la columna de usuario. */
export function TablaPrestamos({
  prestamos,
  admin = false,
  conUsuario = admin,
}: {
  prestamos: Prestamo[];
  admin?: boolean;
  conUsuario?: boolean;
}) {
  if (prestamos.length === 0) {
    return (
      <p className="tarjeta p-6 text-base-content/70">
        No hay préstamos que mostrar.
      </p>
    );
  }
  return (
    <Tabla
      columnas={[
        "Folio",
        ...(conUsuario ? ["Usuario"] : []),
        "Material",
        "Vence",
        "Estado",
        "Acciones",
      ]}
    >
      {prestamos.map((p) => (
        <tr key={p.folio}>
          <td>
            <Mono>{p.folio}</Mono>
            <span className="block text-sm text-base-content/70">
              {MODALIDADES[p.modalidad]}
            </span>
          </td>
          {conUsuario && <td className="min-w-36">{p.usuario.nombre}</td>}
          <td className="min-w-40 font-medium">
            {p.titulos.map((t) => (
              <span key={t.id} className="block">
                {t.titulo}
              </span>
            ))}
          </td>
          <td className="whitespace-nowrap text-base-content/70">
            {fecha(p.venceEn)}
          </td>
          <td>
            <InsigniaEstado estado={p.estado} />
          </td>
          <td>
            <Acciones p={p} admin={admin} />
          </td>
        </tr>
      ))}
    </Tabla>
  );
}
