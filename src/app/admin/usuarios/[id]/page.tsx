import { notFound } from "next/navigation";
import { TablaPrestamos } from "@/components/tabla-prestamos";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import { InsigniaMulta } from "@/components/ui/insignia-estado";
import { Dato, Encabezado, Seccion } from "@/components/ui/pagina";
import { Mono, Tabla } from "@/components/ui/tabla";
import { Vacio } from "@/components/ui/tarjeta";
import {
  ESTADOS_VIVOS,
  MOTIVOS,
  type Multa,
  type Prestamo,
  sancion,
  type Usuario,
} from "@/lib/biblioteca";

export default async function DetalleUsuario({
  params,
}: PageProps<"/admin/usuarios/[id]">) {
  const { id } = await params;
  // shortcut: sin datos hasta conectar la base
  const usuarios: Usuario[] = [];
  const prestamos: Prestamo[] = [];
  const multas: Multa[] = [];
  const u = usuarios.find((u) => u.id === id);
  if (!u) notFound();
  const mios = prestamos.filter((p) => p.usuario.id === u.id);
  // El esquema permite un solo préstamo vivo por usuario.
  const vigente = mios.find((p) => ESTADOS_VIVOS.includes(p.estado));
  const historial = mios.filter((p) => p !== vigente);
  const susMultas = multas.filter((m) => m.usuario.id === u.id);
  const pendientes = susMultas.filter((m) => m.estado === "pendiente");
  // shortcut: el bloqueo se deduce de las multas pendientes y el botón no hace nada; guardar el bloqueo en la cuenta y cambiarlo con una server action.
  const bloqueado = pendientes.length > 0;

  return (
    <>
      <Encabezado
        titulo={u.nombre}
        accion={
          <Boton
            variante={bloqueado ? "solido" : "contorno"}
            color={bloqueado ? "primary" : "error"}
          >
            {bloqueado ? "Desbloquear préstamos" : "Bloquear préstamos"}
          </Boton>
        }
      />

      <dl className="tarjeta grid gap-x-6 gap-y-4 p-6 sm:grid-cols-2 xl:grid-cols-3">
        <Dato etiqueta="Matrícula" mono>
          {u.matricula}
        </Dato>
        <Dato etiqueta="Correo">
          <span className="break-all">{u.correo}</span>
        </Dato>
        <Dato etiqueta="Rol">{u.rol}</Dato>
        <Dato etiqueta="Adscripción">{u.carrera}</Dato>
        <Dato etiqueta="Préstamos">
          <Insignia color={bloqueado ? "error" : "success"}>
            {bloqueado ? "Bloqueados por multa" : "Habilitados"}
          </Insignia>
        </Dato>
        <Dato etiqueta="Multas pendientes">
          {pendientes.length > 0
            ? pendientes.map(sancion).join(", ")
            : "Ninguna"}
        </Dato>
      </dl>

      <Seccion titulo="Préstamo vigente">
        <TablaPrestamos
          admin
          conUsuario={false}
          prestamos={vigente ? [vigente] : []}
        />
      </Seccion>

      <Seccion titulo="Historial de préstamos">
        <TablaPrestamos admin conUsuario={false} prestamos={historial} />
      </Seccion>

      <Seccion titulo="Multas">
        {susMultas.length === 0 ? (
          <Vacio>No tiene multas registradas.</Vacio>
        ) : (
          <Tabla
            columnas={["Folio del préstamo", "Motivo", "Sanción", "Estado"]}
          >
            {susMultas.map((m) => (
              <tr key={m.folio}>
                <td>
                  <Mono>{m.folio}</Mono>
                </td>
                <td>{MOTIVOS[m.motivo]}</td>
                <td>{sancion(m)}</td>
                <td>
                  <InsigniaMulta estado={m.estado} />
                </td>
              </tr>
            ))}
          </Tabla>
        )}
      </Seccion>
    </>
  );
}
