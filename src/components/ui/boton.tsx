import Link from "next/link";
import type { ComponentProps } from "react";

type Variante = "solido" | "contorno" | "texto";
type Color = "primary" | "secondary" | "accent" | "error" | "neutral";
type Tamano = "xs" | "sm" | "md" | "lg";

type Estilo = {
  variante?: Variante;
  color?: Color;
  tamano?: Tamano;
  anchoCompleto?: boolean;
  /** Sólo layout: márgenes, `join-item`, visibilidad responsive. */
  className?: string;
};

// Clases completas y literales: Tailwind las detecta al escanear el código.
const SOLIDO: Record<Color, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  accent: "btn-accent",
  error: "btn-error",
  neutral: "btn-neutral",
};
const CONTORNO: Record<Color, string> = {
  primary: "btn-outline btn-primary",
  secondary: "btn-outline btn-secondary",
  accent: "btn-outline btn-accent",
  error: "btn-outline btn-error",
  neutral: "btn-outline btn-neutral",
};
const TAMANOS: Record<Tamano, string> = {
  xs: "btn-xs whitespace-nowrap",
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

/** Clases de botón, para controles que no son `<button>` ni `Link` (p. ej. un `<label>`). */
export function clasesBoton({
  variante = "solido",
  color = "primary",
  tamano = "md",
  anchoCompleto = false,
  className = "",
}: Estilo) {
  const aspecto =
    variante === "solido"
      ? SOLIDO[color]
      : variante === "contorno"
        ? CONTORNO[color]
        : color === "error"
          ? "btn-ghost text-error"
          : "btn-ghost";
  return `btn ${aspecto} ${TAMANOS[tamano]} ${anchoCompleto ? "w-full" : ""} ${className}`
    .replace(/\s+/g, " ")
    .trim();
}

export type PropsBoton = Estilo &
  (
    | (Omit<ComponentProps<"button">, "className"> & { href?: undefined })
    | (Omit<ComponentProps<typeof Link>, "className" | "href"> & {
        href: string;
      })
  );

/** Con `href` navega (Link); sin él es un `<button>` (`type="button"` salvo que se indique). */
export function Boton({
  variante,
  color,
  tamano,
  anchoCompleto,
  className,
  ...props
}: PropsBoton) {
  const clases = clasesBoton({
    variante,
    color,
    tamano,
    anchoCompleto,
    className,
  });
  if (props.href !== undefined) return <Link {...props} className={clases} />;
  const { type = "button", ...resto } = props;
  return <button type={type} {...resto} className={clases} />;
}
