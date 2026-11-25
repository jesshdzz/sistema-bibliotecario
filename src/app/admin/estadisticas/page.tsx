import { InsigniaEstado } from "@/components/ui/insignia-estado";
import { Encabezado, Seccion } from "@/components/ui/pagina";
import { Vacio } from "@/components/ui/tarjeta";
import { estadoEjemplar, modalidadPrestamo } from "@/db/schema";
import { MODALIDADES, type Modalidad, type Titulo } from "@/lib/biblioteca";

const porcentaje = (fraccion: number) => `${Math.round(fraccion * 100)} %`;

function Grafica({
  titulo,
  nota,
  children,
}: {
  titulo: string;
  nota: string;
  children: React.ReactNode;
}) {
  return (
    <section className="tarjeta p-5">
      <h3 className="text-lg font-semibold">{titulo}</h3>
      <p className="mb-5 text-sm text-base-content/70">{nota}</p>
      {children}
    </section>
  );
}

// El valor siempre va escrito: la barra sólo lo acompaña, así la lista se lee
// igual sin color y con lector de pantalla.
function Barra({
  etiqueta,
  valor,
  max,
  nota,
}: {
  etiqueta: React.ReactNode;
  valor: number;
  max: number;
  nota?: string;
}) {
  return (
    <li>
      <div className="flex items-baseline justify-between gap-3">
        <span>{etiqueta}</span>
        <span className="whitespace-nowrap font-medium tabular-nums">
          {nota && (
            <span className="mr-2 font-normal text-base-content/70">
              {nota}
            </span>
          )}
          {valor}
        </span>
      </div>
      <div
        aria-hidden="true"
        className="mt-1.5 h-2.5 rounded-r bg-primary"
        style={{ width: `${(valor / max) * 100}%` }}
      />
    </li>
  );
}

export default function Estadisticas() {
  // shortcut: sin datos hasta conectar la base
  const prestamosPorMes: { mes: string; total: number }[] = [];
  const prestamosPorModalidad: Record<Modalidad, number> = {
    domicilio: 0,
    sala: 0,
    fotocopia: 0,
  };
  const masPrestados: { tituloId: string; titulo: string; total: number }[] =
    [];
  const devolucionesATiempo = 0;
  const titulos: Titulo[] = [];
  const total = prestamosPorMes.reduce((suma, m) => suma + m.total, 0);
  const maxMes = Math.max(...prestamosPorMes.map((m) => m.total));

  const ejemplares = titulos.flatMap((t) => t.ejemplares);
  const porEstado = estadoEjemplar.enumValues
    .map(
      (estado) =>
        [estado, ejemplares.filter((e) => e.estado === estado).length] as const,
    )
    .sort((a, b) => b[1] - a[1]);

  return (
    <>
      <Encabezado
        titulo="Estadísticas"
        descripcion="Circulación y estado actual del acervo."
      />
      <Seccion titulo="Préstamos">
        {total === 0 ? (
          <Vacio>Aún no hay préstamos registrados.</Vacio>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            <Grafica
              titulo="Préstamos por mes"
              nota={`${total} en el periodo.`}
            >
              {/* Orden invertido: se lee «sep, 163» pero el valor se ve sobre la columna. */}
              <ol className="flex">
                {prestamosPorMes.map(({ mes, total }) => (
                  <li
                    key={mes}
                    className="flex flex-1 flex-col-reverse items-center"
                  >
                    <span className="w-full border-t border-base-300 pt-1.5 text-center text-sm text-base-content/70">
                      {mes}
                    </span>
                    <div
                      aria-hidden="true"
                      className="w-6 rounded-t bg-primary"
                      style={{ height: (total / maxMes) * 200 }}
                    />
                    <span className="mb-1 text-sm font-medium tabular-nums">
                      {total}
                    </span>
                  </li>
                ))}
              </ol>
            </Grafica>
            <Grafica
              titulo="Títulos más prestados"
              nota="Número de préstamos por título."
            >
              <ol className="space-y-4">
                {masPrestados.map(({ tituloId, titulo, total }) => (
                  <Barra
                    key={tituloId}
                    etiqueta={titulo}
                    valor={total}
                    max={masPrestados[0].total}
                  />
                ))}
              </ol>
            </Grafica>
            <Grafica
              titulo="Préstamos por modalidad"
              nota="Número de préstamos y parte del total."
            >
              <ul className="space-y-4">
                {modalidadPrestamo.enumValues.map((modalidad) => (
                  <Barra
                    key={modalidad}
                    etiqueta={MODALIDADES[modalidad]}
                    valor={prestamosPorModalidad[modalidad]}
                    max={Math.max(...Object.values(prestamosPorModalidad))}
                    nota={porcentaje(prestamosPorModalidad[modalidad] / total)}
                  />
                ))}
              </ul>
            </Grafica>
            <Grafica
              titulo="Devoluciones a tiempo"
              nota="Préstamos devueltos dentro del plazo."
            >
              <p className="text-3xl font-semibold">
                {porcentaje(devolucionesATiempo)}
              </p>
              <div
                aria-hidden="true"
                className="mt-3 h-2.5 rounded-full bg-primary/15"
              >
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${devolucionesATiempo * 100}%` }}
                />
              </div>
              <p className="mt-3 text-sm text-base-content/70">
                El {porcentaje(1 - devolucionesATiempo)} restante se devolvió
                con retraso.
              </p>
            </Grafica>
          </div>
        )}
      </Seccion>
      <Seccion titulo="Estado del acervo">
        {ejemplares.length === 0 ? (
          <Vacio>Aún no hay ejemplares registrados.</Vacio>
        ) : (
          <Grafica
            titulo="Ejemplares por estado"
            nota={`${ejemplares.length} ejemplares de ${titulos.length} títulos.`}
          >
            <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {porEstado.map(([estado, cantidad]) => (
                <Barra
                  key={estado}
                  etiqueta={<InsigniaEstado estado={estado} />}
                  valor={cantidad}
                  max={porEstado[0][1]}
                />
              ))}
            </ul>
          </Grafica>
        )}
      </Seccion>
    </>
  );
}
