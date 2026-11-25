"use client";

import { usePathname } from "next/navigation";

export function Desplegable({
  etiqueta,
  className = "",
  children,
}: {
  etiqueta: string;
  className?: string;
  children: React.ReactNode;
}) {
  const ruta = usePathname();
  return (
    <details key={ruta} className={`dropdown dropdown-end ${className}`}>
      <summary className="flex h-10 cursor-pointer list-none items-center rounded-field border border-current/40 px-3 text-sm font-medium">
        {etiqueta}
      </summary>
      <div className="dropdown-content tarjeta z-30 mt-2 w-60 p-2 text-base-content shadow-lg">
        {children}
      </div>
    </details>
  );
}
