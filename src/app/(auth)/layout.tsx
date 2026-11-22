import Link from "next/link";
import { BotonTema } from "@/components/boton-tema";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid flex-1 grid-rows-[auto_1fr] lg:grid-cols-[2fr_3fr] lg:grid-rows-1">
      <header className="flex flex-col justify-between gap-6 border-b-2 border-secondary bg-primary p-6 text-primary-content lg:border-r-2 lg:border-b-0 lg:p-12">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="leading-tight">
            <span className="block text-lg font-semibold">Biblioteca</span>
            <span className="block text-xs text-primary-content/80">
              Universidad Tecnológica de la Mixteca
            </span>
          </Link>
          <BotonTema />
        </div>
        <p className="hidden max-w-[16ch] font-serif text-4xl font-bold leading-tight lg:block">
          Consulta el acervo y gestiona tus préstamos
        </p>
        <p className="hidden text-sm text-primary-content/80 lg:block">
          Usa tu cuenta institucional para solicitar, renovar y dar seguimiento
          a tus préstamos.
        </p>
      </header>
      <main className="grid place-items-center px-4 py-10">
        <div className="tarjeta w-full max-w-md p-6 sm:p-8">{children}</div>
      </main>
    </div>
  );
}
