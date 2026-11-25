import type { ComponentProps } from "react";

export function Campo({
  etiqueta,
  ayuda,
  error,
  children,
}: {
  etiqueta: string;
  ayuda?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: viene del children
    <label className="fieldset">
      <span className="fieldset-legend">{etiqueta}</span>
      {children}
      {ayuda && <span className="text-sm text-base-content/70">{ayuda}</span>}
      {error && <span className="text-sm text-error">{error}</span>}
    </label>
  );
}

const TAMANOS_ENTRADA = { sm: "input-sm", md: "", lg: "input-lg" } as const;
const TAMANOS_SELECTOR = { sm: "select-sm", md: "", lg: "select-lg" } as const;
const MONO = "font-mono text-[13px] font-medium";

type Comun = { tamano?: "sm" | "md" | "lg"; mono?: boolean };

// Sin `className` ocupan todo el ancho; con `className` el ancho lo decide quien llama.
export function Entrada({
  tamano = "md",
  mono = false,
  className = "w-full",
  ...props
}: Comun & ComponentProps<"input">) {
  return (
    <input
      {...props}
      className={`input ${TAMANOS_ENTRADA[tamano]} ${mono ? MONO : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
    />
  );
}

export function Selector({
  tamano = "md",
  mono = false,
  className = "w-full",
  ...props
}: Comun & ComponentProps<"select">) {
  return (
    <select
      {...props}
      className={`select ${TAMANOS_SELECTOR[tamano]} ${mono ? MONO : ""} ${className}`
        .replace(/\s+/g, " ")
        .trim()}
    />
  );
}

export function AreaTexto(props: ComponentProps<"textarea">) {
  return <textarea {...props} className="textarea w-full" />;
}

/** Conjunto de radios o checkboxes con título. */
export function Grupo({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend">{etiqueta}</legend>
      {children}
    </fieldset>
  );
}

export function Opcion({
  tipo,
  etiqueta,
  ...props
}: { tipo: "radio" | "checkbox"; etiqueta: string } & Omit<
  ComponentProps<"input">,
  "type" | "className"
>) {
  return (
    <label className="flex items-center gap-2 py-1 text-sm">
      <input
        {...props}
        type={tipo}
        className={
          tipo === "radio"
            ? "radio radio-primary radio-sm"
            : "checkbox checkbox-primary checkbox-sm"
        }
      />
      {etiqueta}
    </label>
  );
}

/** Radios con aspecto de botones unidos. `valor` lo vuelve controlado; `tema` los hace cambiar el tema (DaisyUI). */
export function Segmentado({
  name,
  opciones,
  valor,
  onChange,
  tema = false,
}: {
  name: string;
  opciones: readonly (readonly [string, string])[];
  valor?: string;
  onChange?: (valor: string) => void;
  tema?: boolean;
}) {
  return (
    <div className="join w-full">
      {opciones.map(([v, etiqueta]) => (
        <input
          key={v}
          type="radio"
          name={name}
          value={v}
          aria-label={etiqueta}
          checked={valor === undefined ? undefined : valor === v}
          onChange={onChange && (() => onChange(v))}
          className={`join-item btn flex-1 ${tema ? "theme-controller" : ""}`.trim()}
        />
      ))}
    </div>
  );
}
