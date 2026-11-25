import Link from "next/link";

const ACENTOS = {
  primary: "border-t-4 border-t-primary",
  secondary: "border-t-4 border-t-secondary",
} as const;

export function Tarjeta({
  acento,
  elemento: Elemento = "div",
  className = "",
  children,
}: {
  acento?: keyof typeof ACENTOS;
  elemento?: "div" | "article" | "aside" | "section" | "dl";
  /** Sólo layout: relleno, ancho máximo, grid/flex. */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Elemento
      className={`tarjeta ${acento ? ACENTOS[acento] : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
    >
      {children}
    </Elemento>
  );
}

/** Estado vacío: el mensaje va como `children`. */
export function Vacio({ children }: { children: React.ReactNode }) {
  return <p className="tarjeta p-6 text-base-content/70">{children}</p>;
}

/** Tarjeta de métrica. Con `href` es un enlace y `nota` se subraya como llamada a la acción. */
export function Cifra({
  etiqueta,
  valor,
  nota,
  href,
}: {
  etiqueta: string;
  valor: number | string;
  nota?: string;
  href?: string;
}) {
  const contenido = (
    <>
      <span className="block text-sm text-base-content/70">{etiqueta}</span>
      <span className="mt-1 block text-2xl font-semibold">{valor}</span>
      {nota && (
        <span
          className={`mt-2 block text-sm ${href ? "underline" : "text-base-content/70"}`}
        >
          {nota}
        </span>
      )}
    </>
  );
  return href ? (
    <Link href={href} className="tarjeta block h-full p-4 hover:border-primary">
      {contenido}
    </Link>
  ) : (
    <div className="tarjeta h-full p-4">{contenido}</div>
  );
}
