import { TablaPrestamos } from "@/components/tabla-prestamos";
import { Encabezado, Seccion } from "@/components/ui/pagina";
import { Cifra } from "@/components/ui/tarjeta";
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
        {cifras.map(([etiqueta, valor, href, nota]) => (
          <li key={etiqueta}>
            <Cifra etiqueta={etiqueta} valor={valor} href={href} nota={nota} />
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
