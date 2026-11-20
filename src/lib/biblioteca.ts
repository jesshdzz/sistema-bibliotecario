import type {
  estadoEjemplar,
  estadoPrestamo,
  modalidadPrestamo,
  tipoMaterial,
} from "@/db/schema";

export type TipoMaterial = (typeof tipoMaterial.enumValues)[number];
export type EstadoEjemplar = (typeof estadoEjemplar.enumValues)[number];
export type Modalidad = (typeof modalidadPrestamo.enumValues)[number];
export type EstadoPrestamo = (typeof estadoPrestamo.enumValues)[number];

export const TIPOS: Record<TipoMaterial, string> = {
  libro: "Libro",
  revista: "Revista",
  articulo: "Artículo",
};

export const MODALIDADES: Record<Modalidad, string> = {
  domicilio: "A domicilio",
  sala: "En sala",
  fotocopia: "Fotocopia",
};

/** Estados que cuentan como préstamo vivo (uno por usuario, según el esquema). */
export const ESTADOS_VIVOS: EstadoPrestamo[] = [
  "pre_prestamo",
  "activo",
  "vencido",
];

export type Titulo = {
  id: string;
  isbn: string;
  titulo: string;
  autores: string;
  editorial: string;
  anio: string;
  tipo: TipoMaterial;
  clasificacion: string;
  resumen: string;
  ejemplares: { codigoBarras: string; estado: EstadoEjemplar }[];
};

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  matricula: string;
  carrera: string;
  rol: string;
};

export type Prestamo = {
  folio: string;
  usuario: Pick<Usuario, "id" | "nombre" | "matricula">;
  modalidad: Modalidad;
  estado: EstadoPrestamo;
  venceEn?: string;
  devueltoEn?: string;
  /** `codigoBarras` es el ejemplar que salió; sólo se muestra mientras el préstamo sigue fuera. */
  titulos: { id: string; titulo: string; codigoBarras?: string }[];
};

export type Multa = {
  folio: string;
  usuario: Pick<Usuario, "id" | "nombre" | "matricula">;
  motivo: "retraso" | "extravio" | "maltrato";
  /** Días sin poder solicitar préstamos; extravío y maltrato no suspenden, obligan a reponer el ejemplar. */
  dias: number;
  estado: "pendiente" | "cumplida" | "condonada";
};

export const MOTIVOS: Record<Multa["motivo"], string> = {
  retraso: "Retraso",
  extravio: "Extravío",
  maltrato: "Maltrato",
};

export const disponibles = (t: Titulo) =>
  t.ejemplares.filter((e) => e.estado === "disponible").length;

// Sin acentos, mayúsculas ni espacios sobrantes, para que "calculo" encuentre "Cálculo".
export const normalizar = (s: string) =>
  s.trim().normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const formatoFecha = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeZone: "America/Mexico_City",
});

export const fecha = (iso?: string) =>
  iso ? formatoFecha.format(new Date(iso)) : "—";

export const dias = (n: number) => `${n} ${n === 1 ? "día" : "días"}`;

/** Días completos transcurridos desde el vencimiento hasta `hasta` (ahora por defecto); 0 si está en plazo. */
export const diasRetraso = (
  venceEn?: string,
  hasta: string | number | Date = Date.now(),
) =>
  venceEn
    ? Math.max(
        0,
        Math.floor(
          (new Date(hasta).getTime() - Date.parse(venceEn)) / 86_400_000,
        ),
      )
    : 0;

/** Lo que debe cumplir el usuario: suspensión por retraso o reponer el ejemplar. */
export const sancion = (m: Multa) =>
  m.motivo === "retraso" ? `${dias(m.dias)} sin préstamo` : "Reponer ejemplar";

/** Primer valor de un parámetro de búsqueda, que puede llegar repetido. */
export const uno = (v?: string | string[]) =>
  (Array.isArray(v) ? v[0] : v) ?? "";
