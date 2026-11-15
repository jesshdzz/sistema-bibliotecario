// shortcut: datos fijos para el prototipo, sin BD ni sesión; sustituir por consultas Drizzle y better-auth.
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

export const titulos: Titulo[] = [
  {
    id: "introduccion-a-los-algoritmos",
    isbn: "978-0-262-04630-5",
    titulo: "Introducción a los Algoritmos",
    autores: "Cormen, Leiserson, Rivest, Stein",
    editorial: "MIT Press",
    anio: "2022",
    tipo: "libro",
    clasificacion: "QA76.6 .C67 2022",
    resumen:
      "Referencia clásica sobre diseño y análisis de algoritmos: ordenamiento, estructuras de datos, grafos, programación dinámica y complejidad computacional.",
    ejemplares: [
      { codigoBarras: "UTM-000101", estado: "disponible" },
      { codigoBarras: "UTM-000102", estado: "prestado" },
      { codigoBarras: "UTM-000103", estado: "en_sala" },
    ],
  },
  {
    id: "clean-code",
    isbn: "978-0-13-235088-4",
    titulo: "Clean Code",
    autores: "Robert C. Martin",
    editorial: "Prentice Hall",
    anio: "2008",
    tipo: "libro",
    clasificacion: "QA76.76 .D47 M37",
    resumen:
      "Principios y prácticas para escribir código legible y mantenible, con casos de estudio de refactorización paso a paso.",
    ejemplares: [
      { codigoBarras: "UTM-000201", estado: "prestado" },
      { codigoBarras: "UTM-000202", estado: "apartado" },
    ],
  },
  {
    id: "calculo-de-una-variable",
    isbn: "978-607-526-550-1",
    titulo: "Cálculo de una variable",
    autores: "James Stewart",
    editorial: "Cengage",
    anio: "2018",
    tipo: "libro",
    clasificacion: "QA303.2 .S74 2018",
    resumen:
      "Límites, derivadas e integrales de funciones de una variable, con énfasis en la comprensión conceptual y la resolución de problemas.",
    ejemplares: [
      { codigoBarras: "UTM-000301", estado: "disponible" },
      { codigoBarras: "UTM-000302", estado: "disponible" },
      { codigoBarras: "UTM-000303", estado: "apartado" },
      { codigoBarras: "UTM-000304", estado: "baja" },
    ],
  },
  {
    id: "fisica-universitaria",
    isbn: "978-607-32-4439-0",
    titulo: "Física universitaria",
    autores: "Sears, Zemansky, Young, Freedman",
    editorial: "Pearson",
    anio: "2018",
    tipo: "libro",
    clasificacion: "QC21.3 .S43 2018",
    resumen:
      "Mecánica, ondas y termodinámica para cursos universitarios de ciencias e ingeniería.",
    ejemplares: [
      { codigoBarras: "UTM-000401", estado: "prestado" },
      { codigoBarras: "UTM-000402", estado: "disponible" },
    ],
  },
  {
    id: "ingenieria-de-software",
    isbn: "978-607-32-0603-7",
    titulo: "Ingeniería de software",
    autores: "Ian Sommerville",
    editorial: "Pearson",
    anio: "2011",
    tipo: "libro",
    clasificacion: "QA76.758 .S66 2011",
    resumen:
      "Procesos, requerimientos, diseño, pruebas y gestión de proyectos de software.",
    ejemplares: [{ codigoBarras: "UTM-000501", estado: "disponible" }],
  },
  {
    id: "estructuras-de-datos-en-java",
    isbn: "978-84-15552-22-3",
    titulo: "Estructuras de datos en Java",
    autores: "Mark Allen Weiss",
    editorial: "Pearson",
    anio: "2013",
    tipo: "libro",
    clasificacion: "QA76.73 .J38 W45",
    resumen:
      "Listas, pilas, colas, árboles, tablas hash y grafos, con implementaciones completas en Java.",
    ejemplares: [{ codigoBarras: "UTM-000601", estado: "no_disponible" }],
  },
  {
    id: "pedro-paramo",
    isbn: "978-84-939426-0-4",
    titulo: "Pedro Páramo",
    autores: "Juan Rulfo",
    editorial: "RM",
    anio: "2017",
    tipo: "libro",
    clasificacion: "PQ7297 .R89 P4",
    resumen:
      "Juan Preciado llega a Comala en busca de su padre y encuentra un pueblo habitado por murmullos.",
    ejemplares: [
      { codigoBarras: "UTM-000701", estado: "apartado" },
      { codigoBarras: "UTM-000702", estado: "disponible" },
    ],
  },
  {
    id: "temas-de-ciencia-y-tecnologia-85",
    isbn: "2007-0977",
    titulo: "Temas de Ciencia y Tecnología, núm. 85",
    autores: "Universidad Tecnológica de la Mixteca",
    editorial: "UTM",
    anio: "2025",
    tipo: "revista",
    clasificacion: "Q4 .T46 N85",
    resumen:
      "Revista cuatrimestral de divulgación científica y tecnológica de la universidad.",
    ejemplares: [{ codigoBarras: "UTM-000801", estado: "disponible" }],
  },
];

export type Usuario = {
  id: string;
  nombre: string;
  correo: string;
  matricula: string;
  carrera: string;
  rol: "Alumno" | "Profesor" | "Bibliotecario";
};

export const usuarios: Usuario[] = [
  {
    id: "u1",
    nombre: "María López Hernández",
    correo: "maria.lopez@utm.mx",
    matricula: "2022020145",
    carrera: "Ingeniería en Computación",
    rol: "Alumno",
  },
  {
    id: "u2",
    nombre: "Carlos Ramírez Cruz",
    correo: "carlos.ramirez@utm.mx",
    matricula: "2023010088",
    carrera: "Ingeniería en Mecatrónica",
    rol: "Alumno",
  },
  {
    id: "u3",
    nombre: "Ana Martínez Santiago",
    correo: "ana.martinez@utm.mx",
    matricula: "2021030212",
    carrera: "Licenciatura en Matemáticas Aplicadas",
    rol: "Alumno",
  },
  {
    id: "u4",
    nombre: "Dr. Luis García Ortiz",
    correo: "luis.garcia@utm.mx",
    matricula: "P-0417",
    carrera: "Instituto de Computación",
    rol: "Profesor",
  },
  {
    id: "u5",
    nombre: "Rosa Jiménez Pérez",
    correo: "rosa.jimenez@utm.mx",
    matricula: "B-0032",
    carrera: "Biblioteca",
    rol: "Bibliotecario",
  },
];

export const esPersonal = (u?: Usuario) => u?.rol === "Bibliotecario";

export type Prestamo = {
  folio: string;
  usuarioId: string;
  modalidad: Modalidad;
  estado: EstadoPrestamo;
  creadoEn: string;
  venceEn?: string;
  devueltoEn?: string;
  tituloIds: string[];
};

export const prestamos: Prestamo[] = [
  {
    folio: "BIB-2026-004835",
    usuarioId: "u4",
    modalidad: "domicilio",
    estado: "pre_prestamo",
    creadoEn: "2026-11-15",
    tituloIds: ["pedro-paramo"],
  },
  {
    folio: "BIB-2026-004830",
    usuarioId: "u2",
    modalidad: "sala",
    estado: "pre_prestamo",
    creadoEn: "2026-11-15",
    tituloIds: ["calculo-de-una-variable", "clean-code"],
  },
  {
    folio: "BIB-2026-004821",
    usuarioId: "u1",
    modalidad: "domicilio",
    estado: "activo",
    creadoEn: "2026-11-10",
    venceEn: "2026-11-17",
    tituloIds: ["clean-code", "introduccion-a-los-algoritmos"],
  },
  {
    folio: "BIB-2026-004601",
    usuarioId: "u3",
    modalidad: "domicilio",
    estado: "vencido",
    creadoEn: "2026-11-01",
    venceEn: "2026-11-08",
    tituloIds: ["fisica-universitaria"],
  },
  {
    folio: "BIB-2026-004310",
    usuarioId: "u1",
    modalidad: "domicilio",
    estado: "devuelto",
    creadoEn: "2026-10-01",
    venceEn: "2026-10-08",
    devueltoEn: "2026-10-07",
    tituloIds: ["pedro-paramo"],
  },
  {
    folio: "BIB-2026-004102",
    usuarioId: "u1",
    modalidad: "fotocopia",
    estado: "devuelto",
    creadoEn: "2026-09-12",
    venceEn: "2026-09-12",
    devueltoEn: "2026-09-12",
    tituloIds: ["ingenieria-de-software"],
  },
  {
    folio: "BIB-2026-003987",
    usuarioId: "u2",
    modalidad: "sala",
    estado: "cancelado",
    creadoEn: "2026-09-03",
    tituloIds: ["estructuras-de-datos-en-java"],
  },
];

/** Estados que cuentan como préstamo vivo (uno por usuario, según el esquema). */
export const ESTADOS_VIVOS: EstadoPrestamo[] = [
  "pre_prestamo",
  "activo",
  "vencido",
];

export const parametros = [
  {
    clave: "dias_prestamo_domicilio",
    valor: 7,
    descripcion: "Días de préstamo a domicilio",
  },
  {
    clave: "max_ejemplares_por_prestamo",
    valor: 3,
    descripcion: "Máximo de ejemplares por préstamo",
  },
  {
    clave: "horas_vigencia_pre_prestamo",
    valor: 24,
    descripcion: "Horas para recoger una solicitud antes de cancelarla",
  },
  {
    clave: "renovaciones_permitidas",
    valor: 1,
    descripcion: "Renovaciones permitidas por préstamo",
  },
  {
    clave: "multa_por_dia",
    valor: 5,
    descripcion: "Multa por día de retraso y por ejemplar (pesos)",
  },
];

export type Multa = {
  folio: string;
  usuarioId: string;
  diasRetraso: number;
  monto: number;
  estado: "pendiente" | "pagada" | "condonada";
};

// shortcut: el esquema aún no tiene tabla de multas; estas cifras son de demostración. Crear la tabla `multa` al implementar.
export const multas: Multa[] = [
  {
    folio: "BIB-2026-004601",
    usuarioId: "u3",
    diasRetraso: 7,
    monto: 35,
    estado: "pendiente",
  },
  {
    folio: "BIB-2026-003870",
    usuarioId: "u2",
    diasRetraso: 3,
    monto: 15,
    estado: "pagada",
  },
  {
    folio: "BIB-2026-003712",
    usuarioId: "u4",
    diasRetraso: 2,
    monto: 20,
    estado: "condonada",
  },
  {
    folio: "BIB-2026-003655",
    usuarioId: "u1",
    diasRetraso: 1,
    monto: 5,
    estado: "pagada",
  },
];

/** Agregados de demostración para la pantalla de estadísticas (no se derivan de `prestamos`). */
export const estadisticas = {
  prestamosPorMes: [
    { mes: "jun", total: 84 },
    { mes: "jul", total: 41 },
    { mes: "ago", total: 97 },
    { mes: "sep", total: 163 },
    { mes: "oct", total: 148 },
    { mes: "nov", total: 72 },
  ],
  prestamosPorModalidad: { domicilio: 398, sala: 151, fotocopia: 56 },
  masPrestados: [
    { tituloId: "calculo-de-una-variable", total: 58 },
    { tituloId: "fisica-universitaria", total: 47 },
    { tituloId: "introduccion-a-los-algoritmos", total: 39 },
    { tituloId: "clean-code", total: 31 },
    { tituloId: "ingenieria-de-software", total: 22 },
  ],
  devolucionesATiempo: 0.91,
};

export const HORARIO = [
  ["Lunes a viernes", "8:00 a 20:00 h"],
  ["Sábados", "9:00 a 14:00 h"],
] as const;

export const tituloPorId = (id: string) => titulos.find((t) => t.id === id);

export const usuarioPorId = (id: string) => usuarios.find((u) => u.id === id);

export const disponibles = (t: Titulo) =>
  t.ejemplares.filter((e) => e.estado === "disponible").length;

// Sin acentos, mayúsculas ni espacios sobrantes, para que "calculo" encuentre "Cálculo".
export const normalizar = (s: string) =>
  s.trim().normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

export function buscarTitulos({
  q = "",
  tipo,
  soloDisponibles = false,
}: {
  q?: string;
  tipo?: string;
  soloDisponibles?: boolean;
} = {}) {
  const texto = normalizar(q);
  return titulos.filter(
    (t) =>
      normalizar(
        `${t.titulo} ${t.autores} ${t.isbn} ${t.clasificacion}`,
      ).includes(texto) &&
      (!tipo || t.tipo === tipo) &&
      (!soloDisponibles || disponibles(t) > 0),
  );
}

const formatoFecha = new Intl.DateTimeFormat("es-MX", {
  dateStyle: "medium",
  timeZone: "UTC", // las fechas demo son días sin hora; evita el corrimiento por zona
});

export const fecha = (iso?: string) =>
  iso ? formatoFecha.format(new Date(iso)) : "—";

const formatoPesos = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export const pesos = (monto: number) => formatoPesos.format(monto);
