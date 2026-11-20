import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-6 border-t-2 border-secondary bg-neutral text-neutral-content">
      <div className="contenedor grid gap-8 py-10 text-sm sm:grid-cols-2">
        <div>
          <p className="text-base font-semibold">Biblioteca</p>
          <p className="mt-1 text-neutral-content/70">
            Universidad Tecnológica de la Mixteca
            <br />
            Huajuapan de León, Oaxaca
          </p>
        </div>
        <nav aria-label="Pie de página">
          <p className="font-semibold">Servicios</p>
          <ul className="mt-1 space-y-1 text-neutral-content/70">
            <li>
              <Link href="/catalogo" className="link link-hover">
                Catálogo en línea
              </Link>
            </li>
            <li>
              <Link href="/perfil" className="link link-hover">
                Mis préstamos
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-neutral-content/15 py-4 text-center text-xs text-neutral-content/60">
        Sistema de Gestión Bibliotecaria, 2026
      </p>
    </footer>
  );
}
