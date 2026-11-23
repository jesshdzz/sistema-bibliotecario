import Link from "next/link";
import { EtiquetaLomo } from "@/components/etiqueta-lomo";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function NoEncontrado() {
  return (
    <div className="flex flex-1 flex-col">
      <Navbar />
      <main className="contenedor flex flex-1 items-center justify-center py-16">
        <div className="flex max-w-xl flex-col items-center gap-6 rounded-box border border-base-300 bg-base-100 p-8 text-center sm:p-12">
          <div>
            <EtiquetaLomo signatura="Z404 .N6 E5" />
          </div>
          <h1 className="text-3xl font-bold sm:text-4xl">
            Esta página no está en el estante
          </h1>
          <div className="h-1 w-16 bg-primary" />
          <p className="max-w-[68ch] text-base-content/70">
            Buscamos en todas las secciones y no encontramos lo que pediste.
            Quizá la dirección cambió o se escribió mal.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/catalogo" className="btn btn-primary">
              Buscar en el catálogo
            </Link>
            <Link href="/" className="btn btn-ghost">
              Ir al inicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
