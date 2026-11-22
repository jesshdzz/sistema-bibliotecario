import Link from "next/link";
import { Encabezado, Seccion } from "@/components/pagina";
import { TablaPrestamos } from "@/components/tabla-prestamos";
import { fecha, type Multa, type Prestamo } from "@/lib/biblioteca";

export default function Resumen() {
  // shortcut: sin datos hasta conectar la base
  const prestamos: Prestamo[] = [];
  const multas: Multa[] = [];
  const con = (estado: string) => prestamos.filter((p) => p.estado === estado);
  const porEntregar = con("pre_prestamo");
  const vencidos = con("vencido");
  const multados = new Set(
    multas.filter((m) => m.estado === "pendiente").map((m) => m.usuario.id),
  ).size;

  const cifras = [
    [
      "Solicitudes por entregar",
      porEntregar.length,
      "/admin/prestamos?estado=pre_prestamo",
      "Entregar solicitudes",
    ],
    [
      "Préstamos activos",
      con("activo").length,
      "/admin/prestamos?estado=activo",
      "Ver préstamos activos",
    ],
    [
      "Préstamos vencidos",
      vencidos.length,
      "/admin/devoluciones",
      "Registrar devoluciones",
    ],
    ["Usuarios con multa", multados, "/admin/multas", "Ver multas"],
  ] as const;

  return (
    <>
      <Encabezado
        titulo="Panel de administración"
        descripcion={`Pendientes del mostrador al ${fecha(new Date().toISOString())}.`}
      />
      <ul className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cifras.map(([etiqueta, valor, href, accion]) => (
          <li key={etiqueta}>
            <Link
              href={href}
              className="tarjeta block h-full p-4 hover:border-primary"
            >
              <span className="block text-sm text-base-content/70">
                {etiqueta}
              </span>
              <span className="mt-1 block text-2xl font-semibold">{valor}</span>
              <span className="mt-2 block text-sm underline">{accion}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Seccion titulo="Solicitudes por entregar">
        <TablaPrestamos admin prestamos={porEntregar} />
      </Seccion>
      <Seccion titulo="Préstamos vencidos">
        <TablaPrestamos admin prestamos={vencidos} />
      </Seccion>
    </>
  );
}
