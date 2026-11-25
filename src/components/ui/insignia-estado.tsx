import type { EstadoEjemplar, EstadoPrestamo, Multa } from "@/lib/biblioteca";
import { Insignia } from "./insignia";

type Color = Parameters<typeof Insignia>[0]["color"];

// accent = disponible, error = no disponible/vencido,
// warning = requiere atención, success = préstamo en regla, info = en trámite.
const ESTADOS: Record<EstadoEjemplar | EstadoPrestamo, [string, Color]> = {
  disponible: ["Disponible", "accent"],
  apartado: ["Apartado", "warning"],
  prestado: ["En préstamo", "error"],
  en_sala: ["En sala", "info"],
  no_disponible: ["No disponible", "error"],
  baja: ["Baja", "ghost"],
  pre_prestamo: ["Por recoger", "info"],
  activo: ["Activo", "success"],
  vencido: ["Vencido", "error"],
  devuelto: ["Devuelto", "ghost"],
  cancelado: ["Cancelado", "ghost"],
};

// warning = multa pendiente, success = cumplida.
const ESTADOS_MULTA: Record<Multa["estado"], [string, Color]> = {
  pendiente: ["Pendiente", "warning"],
  cumplida: ["Cumplida", "success"],
  condonada: ["Condonada", "ghost"],
};

export const etiquetaEstado = (estado: EstadoEjemplar | EstadoPrestamo) =>
  ESTADOS[estado][0];

export function InsigniaEstado({
  estado,
}: {
  estado: EstadoEjemplar | EstadoPrestamo;
}) {
  const [etiqueta, color] = ESTADOS[estado];
  return <Insignia color={color}>{etiqueta}</Insignia>;
}

export function InsigniaMulta({ estado }: { estado: Multa["estado"] }) {
  const [etiqueta, color] = ESTADOS_MULTA[estado];
  return <Insignia color={color}>{etiqueta}</Insignia>;
}
