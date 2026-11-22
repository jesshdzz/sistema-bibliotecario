import Link from "next/link";
import { redirect } from "next/navigation";
import { Dato, Encabezado, Seccion } from "@/components/pagina";
import { Papeleta } from "@/components/papeleta";
import { TablaPrestamos } from "@/components/tabla-prestamos";
import { ESTADOS_VIVOS, type Prestamo, type Titulo } from "@/lib/biblioteca";
import { usuarioSesion } from "@/lib/sesion";

export default async function Perfil({ searchParams }: PageProps<"/perfil">) {
  const u = await usuarioSesion();
  if (!u) redirect("/iniciar-sesion");
  const { solicitud } = await searchParams;
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
        accion={
          <button type="button" className="btn btn-outline btn-sm">
            Cerrar sesión
          </button>
        }
      />

      {solicitado && (
        <div role="alert" className="alert alert-success">
          <span>
            Solicitud registrada: «{solicitado.titulo}». Recógelo en el
            mostrador con tu credencial.
          </span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[320px_1fr] items-start">
        <aside className="tarjeta p-6">
          <p className="text-lg font-semibold">{u.nombre}</p>
          <span className="badge badge-secondary badge-sm mt-1">{u.rol}</span>
          <dl className="space-y-3 mt-6">
            <Dato etiqueta="Matrícula" mono>
              {u.matricula}
            </Dato>
            <Dato etiqueta="Correo">
              <span className="break-all">{u.correo}</span>
            </Dato>
            <Dato etiqueta="Carrera">{u.carrera}</Dato>
          </dl>
        </aside>

        <div className="space-y-8 min-w-0">
          <Seccion titulo="Préstamo vigente">
            {vivo ? (
              <div className="tarjeta max-w-xl border-t-4 border-t-primary p-6">
                <Papeleta prestamo={vivo} />
                {/* shortcut: los botones no hacen nada en el prototipo; conectar a server actions. */}
                <button type="button" className="btn btn-primary mt-5">
                  {vivo.estado === "pre_prestamo"
                    ? "Cancelar solicitud"
                    : "Renovar préstamo"}
                </button>
              </div>
            ) : (
              <p className="tarjeta p-6 text-base-content/70">
                No tienes préstamos vigentes. Busca material en el{" "}
                <Link href="/catalogo" className="link">
                  catálogo
                </Link>
                .
              </p>
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
