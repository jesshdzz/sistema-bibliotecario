"use client";

import { useRouter } from "next/navigation";
import { Boton } from "@/components/ui/boton";
import { authClient } from "@/lib/auth-client";

/** Con `className` es un botón a medida (navbar, sobre superficie primary); sin él, un `Boton` de contorno. */
export function BotonCerrarSesion({ className }: { className?: string }) {
  const router = useRouter();
  async function salir() {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  }
  return className ? (
    <button type="button" className={className} onClick={salir}>
      Cerrar sesión
    </button>
  ) : (
    <Boton variante="contorno" color="neutral" tamano="sm" onClick={salir}>
      Cerrar sesión
    </Boton>
  );
}
