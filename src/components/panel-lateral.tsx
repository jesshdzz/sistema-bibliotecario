"use client";

import { usePathname } from "next/navigation";

export function PanelLateral({
  id,
  etiqueta,
  lateral,
  children,
}: {
  id: string;
  etiqueta: string;
  lateral: React.ReactNode;
  children: React.ReactNode;
}) {
  const ruta = usePathname();
  return (
    <div className="drawer lg:drawer-open">
      <input key={ruta} id={id} type="checkbox" className="drawer-toggle" />
      <div className="drawer-content min-w-0 lg:pl-6">
        <label htmlFor={id} className="btn btn-outline btn-sm mb-4 lg:hidden">
          {etiqueta}
        </label>
        {children}
      </div>
      <div className="drawer-side z-20 lg:h-auto">
        <label
          htmlFor={id}
          aria-label="Cerrar panel"
          className="drawer-overlay"
        />
        <aside className="tarjeta w-70 min-h-full p-4 max-lg:rounded-none lg:min-h-0">
          {lateral}
        </aside>
      </div>
    </div>
  );
}
