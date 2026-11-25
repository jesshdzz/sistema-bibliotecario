import Image from "next/image";
import Link from "next/link";
import { Boton } from "@/components/ui/boton";
import { Desplegable } from "@/components/ui/desplegable";
import { esPersonal, usuarioSesion } from "@/lib/sesion";
import { BotonCerrarSesion } from "./boton-cerrar-sesion";
import { BotonTema } from "./boton-tema";
import { EnlaceNav } from "./enlace-nav";

export const ACTIVO_MENU =
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
          {/*<svg
            viewBox="0 0 48 48"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-12 shrink-0"
            aria-hidden="true"
          >
            <g className="stroke-secondary" strokeWidth="2.5">
              <path d="M5 24a19 17 0 0 1 38 0" />
              <path d="M11.5 24a12.5 11 0 0 1 25 0" />
            </g>
            <path
              d="M24 18.5l2.5 3.5-2.5 3.5-2.5-3.5z"
              className="fill-secondary"
            />
            <path
              d="M24 30c-4.5-2.5-10-3.2-16-3v12c6-.2 11.5.5 16 3 4.5-2.5 10-3.2 16-3V27c-6-.2-11.5.5-16 3zm0 0v12"
              stroke="currentColor"
              strokeWidth="2.5"
            />
          </svg> */}
          <Image src="/master-1024.png" alt="" width={40} height={40} />
          <span className="leading-tight">
            <span className="block text-xl font-semibold ">
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
            <Boton
              href="/iniciar-sesion"
              color="secondary"
              className="hidden md:inline-flex"
            >
              Iniciar sesión
            </Boton>
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
