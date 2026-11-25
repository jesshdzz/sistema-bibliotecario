import Link from "next/link";
import { redirect } from "next/navigation";
import { BotonCerrarSesion } from "@/components/boton-cerrar-sesion";
import { Papeleta } from "@/components/papeleta";
import { TablaPrestamos } from "@/components/tabla-prestamos";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import { Insignia } from "@/components/ui/insignia";
import { Dato, Encabezado, Seccion } from "@/components/ui/pagina";
import { Tarjeta, Vacio } from "@/components/ui/tarjeta";
import { ESTADOS_VIVOS, type Prestamo, type Titulo } from "@/lib/biblioteca";
import { getCarreras } from "@/lib/carreras";
import { usuarioSesion } from "@/lib/sesion";

export default async function Perfil({ searchParams }: PageProps<"/perfil">) {
  const u = await usuarioSesion();
  if (!u) redirect("/iniciar-sesion");
  const [{ solicitud }, carreras] = await Promise.all([
    searchParams,
    getCarreras(),
  ]);
  // shortcut: sin datos hasta conectar la base
  const titulos: Titulo[] = [];
  const mios: Prestamo[] = [];
  const solicitado = titulos.find((t) => t.id === solicitud);
  const vivo = mios.find((p) => ESTADOS_VIVOS.includes(p.estado));

  return (
    <main className="contenedor flex-1 py-8 space-y-8">
      <Encabezado
        titulo="Mi cuenta"
        descripcion="Tus datos y el seguimiento de tus préstamos."
        accion={<BotonCerrarSesion />}
      />

      {solicitado && (
        <Alerta tono="success">
          Solicitud registrada: «{solicitado.titulo}». Recógelo en el mostrador
          con tu credencial.
        </Alerta>
      )}

      <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-start">
        <Tarjeta elemento="aside" className="p-6">
          <p className="text-lg font-semibold">{u.nombre}</p>
          <Insignia color="secondary" className="mt-1">
            {u.rol}
          </Insignia>
          <dl className="space-y-3 mt-6">
            <Dato etiqueta="Matrícula" mono>
              {u.matricula}
            </Dato>
            <Dato etiqueta="Correo">
              <span className="break-all">{u.correo}</span>
            </Dato>
            <Dato etiqueta="Carrera">
              {carreras[u.carrera]?.etiqueta ?? u.carrera}
            </Dato>
            <Dato etiqueta="Semestre">{u.semestre}</Dato>
          </dl>
        </Tarjeta>

        <div className="space-y-8 min-w-0">
          <Seccion titulo="Préstamo vigente">
            {vivo ? (
              <Tarjeta acento="primary" className="max-w-xl p-6">
                <Papeleta prestamo={vivo} />
                {/* shortcut: los botones no hacen nada en el prototipo; conectar a server actions. */}
                <Boton className="mt-5">
                  {vivo.estado === "pre_prestamo"
                    ? "Cancelar solicitud"
                    : "Renovar préstamo"}
                </Boton>
              </Tarjeta>
            ) : (
              <Vacio>
                No tienes préstamos vigentes. Busca material en el{" "}
                <Link href="/catalogo" className="link">
                  catálogo
                </Link>
                .
              </Vacio>
            )}
          </Seccion>
          <Seccion titulo="Historial">
            <TablaPrestamos prestamos={mios.filter((p) => p !== vivo)} />
          </Seccion>
        </div>
      </div>
    </main>
  );
}
