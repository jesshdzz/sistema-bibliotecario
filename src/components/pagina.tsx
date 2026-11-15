export function Encabezado({
  titulo,
  descripcion,
  accion,
}: {
  titulo: string;
  descripcion?: string;
  accion?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold sm:text-4xl">{titulo}</h1>
        <div className="mt-3 h-1 w-16 bg-primary" />
        {descripcion && (
          <p className="mt-3 max-w-[68ch] text-base-content/70">
            {descripcion}
          </p>
        )}
      </div>
      {accion}
    </header>
  );
}

export function Seccion({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold">{titulo}</h2>
      <div className="mt-2 mb-5 h-0.5 w-12 bg-primary" />
      {children}
    </section>
  );
}

export function Dato({
  etiqueta,
  mono = false,
  children,
}: {
  etiqueta: string;
  mono?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-sm text-base-content/70">{etiqueta}</dt>
      <dd className={mono ? "font-mono text-[13px] font-medium" : ""}>
        {children}
      </dd>
    </div>
  );
}
