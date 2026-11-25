import Link from "next/link";
import { Insignia } from "@/components/ui/insignia";
import { Mono, Tabla } from "@/components/ui/tabla";
import { dias, diasRetraso, fecha, type Prestamo } from "@/lib/biblioteca";

/** Pestañas de filtro por `?estado=`; conservan la búsqueda `q` en curso. */
export function Pestanas({
  filtros,
  activo,
  q,
}: {
  filtros: { valor: string; etiqueta: string; total: number }[];
  activo: string;
  q?: string;
}) {
  const href = (valor: string) => {
    const params = new URLSearchParams();
    if (valor) params.set("estado", valor);
    if (q) params.set("q", q);
    return `?${params}`;
  };
  return (
    <div className="overflow-x-auto">
      <div role="tablist" className="tabs tabs-border w-max flex-nowrap">
        {filtros.map(({ valor, etiqueta, total }) => (
          <Link
            key={valor}
            role="tab"
            aria-selected={activo === valor}
            href={href(valor)}
            scroll={false}
            className={`tab gap-2 ${activo === valor ? "tab-active font-semibold before:bg-primary!" : ""}`}
          >
            {etiqueta}
            <span className="text-base-content/70">
              <Mono>{total}</Mono>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CeldaUsuario({ usuario }: { usuario: Prestamo["usuario"] }) {
  return (
    <td className="min-w-40">
      <p className="font-medium">{usuario?.nombre}</p>
      <p className="text-base-content/70">
        <Mono>{usuario?.matricula}</Mono>
      </p>
    </td>
  );
}

/** Títulos del préstamo; mientras siguen fuera muestra el código de barras de cada ejemplar. */
export function CeldaMaterial({ p }: { p: Prestamo }) {
  const fuera = p.estado === "activo" || p.estado === "vencido";
  return (
    <td className="min-w-48">
      <ul className="space-y-1">
        {p.titulos.map((t) => (
          <li key={t.id}>
            <p className="font-medium">{t.titulo}</p>
            {fuera && (
              <p className="text-base-content/70">
                <Mono>{t.codigoBarras}</Mono>
              </p>
            )}
          </li>
        ))}
      </ul>
    </td>
  );
}

/** Préstamos que siguen fuera, con su retraso. `accion` dibuja el control de cada fila. */
export function TablaPendientes({
  prestamos,
  accion,
}: {
  prestamos: Prestamo[];
  accion: (p: Prestamo) => React.ReactNode;
}) {
  return (
    <Tabla
      columnas={[
        "Folio",
        "Usuario",
        "Material",
        "Vencimiento",
        "Retraso",
        "Acciones",
      ]}
    >
      {prestamos.map((p) => (
        <tr key={p.folio}>
          <td>
            <Mono>{p.folio}</Mono>
          </td>
          <CeldaUsuario usuario={p.usuario} />
          <CeldaMaterial p={p} />
          <td className="whitespace-nowrap">{fecha(p.venceEn)}</td>
          <td className="whitespace-nowrap">
            {diasRetraso(p.venceEn) > 0 ? (
              <Insignia color="error">{dias(diasRetraso(p.venceEn))}</Insignia>
            ) : (
              <span className="text-base-content/70">En plazo</span>
            )}
          </td>
          <td>{accion(p)}</td>
        </tr>
      ))}
    </Tabla>
  );
}
