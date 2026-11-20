import { Children } from "react";

export function Tabla({
  columnas,
  children,
}: {
  columnas: string[];
  children: React.ReactNode;
}) {
  if (Children.count(children) === 0) {
    return (
      <p className="tarjeta p-6 text-base-content/70">
        No hay registros que mostrar.
      </p>
    );
  }
  return (
    <div className="tarjeta overflow-x-auto">
      <table className="table">
        <thead className="bg-base-300">
          <tr>
            {columnas.map((columna) => (
              <th key={columna}>{columna}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Mono({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[13px] font-medium whitespace-nowrap">
      {children}
    </span>
  );
}
