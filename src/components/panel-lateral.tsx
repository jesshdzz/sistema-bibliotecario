"use client";

import { usePathname } from "next/navigation";
import { clasesBoton } from "@/components/ui/boton";
import { Tarjeta } from "@/components/ui/tarjeta";

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
        <label
          htmlFor={id}
          className={clasesBoton({
            variante: "contorno",
            color: "neutral",
            tamano: "sm",
            className: "mb-4 lg:hidden",
          })}
        >
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
        <Tarjeta
          elemento="aside"
          className="w-70 min-h-full p-4 max-lg:rounded-none lg:min-h-0"
        >
          {lateral}
        </Tarjeta>
      </div>
    </div>
  );
}
