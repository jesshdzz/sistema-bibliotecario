import Link from "next/link";
import { disponibles, TIPOS, type Titulo } from "@/lib/biblioteca";
import { EtiquetaLomo } from "./etiqueta-lomo";

/** Punto de color + texto; el texto basta para entender el estado sin el color. */
export function Disponibilidad({ titulo: t }: { titulo: Titulo }) {
  const libres = disponibles(t);
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className={`size-2 rounded-full ${libres ? "bg-accent" : "bg-error"}`}
      />
      {libres
        ? `${libres} ${libres === 1 ? "disponible" : "disponibles"} de ${t.ejemplares.length}`
        : "Sin ejemplares disponibles"}
    </span>
  );
}

/** Registro de catálogo: etiqueta de lomo a la izquierda y cita bibliográfica a la derecha. */
export function TarjetaTitulo({ titulo: t }: { titulo: Titulo }) {
  return (
    <article className="tarjeta flex gap-4 p-4">
      <EtiquetaLomo signatura={t.clasificacion} />
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-lg font-semibold leading-snug">
          <Link href={`/catalogo/${t.id}`} className="link link-hover">
            {t.titulo}
          </Link>
        </h3>
        <p className="text-sm text-base-content/70">
          {t.autores}. {t.editorial}, {t.anio}.
        </p>
        <p className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-2 text-sm">
          <Disponibilidad titulo={t} />
          <span className="text-base-content/70">{TIPOS[t.tipo]}</span>
        </p>
      </div>
    </article>
  );
}
