import Link from "next/link";
import { esPersonal, usuarioSesion } from "@/lib/sesion";
import { BotonCerrarSesion } from "./boton-cerrar-sesion";
import { BotonTema } from "./boton-tema";
import { Desplegable } from "./desplegable";
import { EnlaceNav } from "./enlace-nav";

const ACTIVO_MENU =
  "aria-[current=page]:bg-primary aria-[current=page]:text-primary-content";

export async function Navbar() {
  const usuario = await usuarioSesion();
  const enlaces = [
    ["/catalogo", "Catálogo"],
    ...(usuario ? [["/perfil", "Mis préstamos"]] : []),
    ...(esPersonal(usuario) ? [["/admin", "Administración"]] : []),
  ];

  return (
    <header className="border-b-2 border-secondary bg-primary text-primary-content">
      <div className="contenedor flex min-h-18 items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-field border border-primary-content/40">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
              className="size-6"
              aria-hidden="true"
            >
              <path d="M12 6.5c-2-1.3-4.5-2-7.5-2v13c3 0 5.5.7 7.5 2m0-13c2-1.3 4.5-2 7.5-2v13c-3 0-5.5.7-7.5 2m0-13v13" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-semibold">
              Biblioteca<span className="sm:hidden"> UTM</span>
            </span>
            <span className="hidden text-xs text-primary-content/80 sm:block">
              Universidad Tecnológica de la Mixteca
            </span>
          </span>
        </Link>

        <nav aria-label="Principal" className="ml-auto hidden gap-1 md:flex">
          {enlaces.map(([href, texto]) => (
            <EnlaceNav
              key={href}
              href={href}
              className="border-b-2 border-transparent px-3 py-2 text-sm font-medium hover:border-primary-content/50 aria-[current=page]:border-secondary"
            >
              {texto}
            </EnlaceNav>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-2">
          <BotonTema />
          {usuario ? (
            <div className="hidden md:block">
              <BotonCerrarSesion className="h-10 cursor-pointer rounded-field border border-primary-content/40 px-3 text-sm font-medium hover:bg-primary-content/15" />
            </div>
          ) : (
            <Link
              href="/iniciar-sesion"
              className="btn btn-secondary hidden md:inline-flex"
            >
              Iniciar sesión
            </Link>
          )}

          <Desplegable etiqueta="Menú" className="md:hidden">
            <ul className="menu w-full p-0">
              {enlaces.map(([href, texto]) => (
                <li key={href}>
                  <EnlaceNav href={href} className={ACTIVO_MENU}>
                    {texto}
                  </EnlaceNav>
                </li>
              ))}
              <li className="mt-1 border-t border-base-300 pt-1">
                {usuario ? (
                  <div className="grid">
                    <BotonCerrarSesion className="cursor-pointer text-left" />
                  </div>
                ) : (
                  <Link href="/iniciar-sesion">Iniciar sesión</Link>
                )}
              </li>
            </ul>
          </Desplegable>
        </div>
      </div>
    </header>
  );
}
