import { redirect } from "next/navigation";
import { EnlaceNav } from "@/components/enlace-nav";
import { Footer } from "@/components/footer";
import { ACTIVO_MENU, Navbar } from "@/components/navbar";
import { PanelLateral } from "@/components/panel-lateral";
import { esPersonal, usuarioSesion } from "@/lib/sesion";

const GRUPOS = [
  {
    titulo: "Circulación",
    enlaces: [
      { href: "/admin", texto: "Resumen", exacto: true },
      { href: "/admin/prestamos", texto: "Préstamos" },
      { href: "/admin/devoluciones", texto: "Devoluciones" },
      { href: "/admin/multas", texto: "Retardos y multas" },
    ],
  },
  {
    titulo: "Acervo y usuarios",
    enlaces: [
      { href: "/admin/catalogo", texto: "Libros" },
      { href: "/admin/usuarios", texto: "Usuarios" },
    ],
  },
  {
    titulo: "Sistema",
    enlaces: [
      { href: "/admin/estadisticas", texto: "Estadísticas" },
      { href: "/admin/configuracion", texto: "Configuración" },
    ],
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El panel es sólo para el personal de la biblioteca.
  const usuario = await usuarioSesion();
  if (!esPersonal(usuario)) redirect("/iniciar-sesion");

  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <div className="contenedor flex-1 py-8">
        <PanelLateral
          id="menu-admin"
          etiqueta="Secciones del panel"
          lateral={
            <nav aria-label="Administración">
              <p className="px-3 text-sm text-base-content/70">
                Panel del personal
              </p>
              <p className="px-3 font-semibold">{usuario?.nombre}</p>
              <ul className="menu mt-2 w-full gap-0.5 p-0">
                {GRUPOS.map((grupo) => (
                  <li key={grupo.titulo}>
                    <p className="menu-title">{grupo.titulo}</p>
                    <ul>
                      {grupo.enlaces.map(({ texto, ...enlace }) => (
                        <li key={enlace.href}>
                          <EnlaceNav {...enlace} className={ACTIVO_MENU}>
                            {texto}
                          </EnlaceNav>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </nav>
          }
        >
          <main className="space-y-8">{children}</main>
        </PanelLateral>
      </div>
      <Footer />
    </div>
  );
}
