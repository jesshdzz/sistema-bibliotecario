import type { EstadoEjemplar, EstadoPrestamo } from "@/lib/datos-demo";

// accent = disponible, error = no disponible/vencido,
// warning = requiere atención, success = préstamo en regla, info = en trámite.
const ESTADOS: Record<EstadoEjemplar | EstadoPrestamo, [string, string]> = {
  disponible: ["Disponible", "badge-accent"],
  apartado: ["Apartado", "badge-warning"],
  prestado: ["En préstamo", "badge-error"],
  en_sala: ["En sala", "badge-info"],
  no_disponible: ["No disponible", "badge-error"],
  baja: ["Baja", "badge-ghost"],
  pre_prestamo: ["Por recoger", "badge-info"],
  activo: ["Activo", "badge-success"],
  vencido: ["Vencido", "badge-error"],
  devuelto: ["Devuelto", "badge-ghost"],
  cancelado: ["Cancelado", "badge-ghost"],
};

export const etiquetaEstado = (estado: EstadoEjemplar | EstadoPrestamo) =>
  ESTADOS[estado][0];

export function InsigniaEstado({
  estado,
}: {
  estado: EstadoEjemplar | EstadoPrestamo;
}) {
  const [etiqueta, color] = ESTADOS[estado];
  return (
    <span className={`badge ${color} badge-sm shrink-0 whitespace-nowrap`}>
      {etiqueta}
    </span>
  );
}
