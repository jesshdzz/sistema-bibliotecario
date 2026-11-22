"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function BotonCerrarSesion({ className }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        await authClient.signOut();
        router.push("/");
        router.refresh();
      }}
    >
      Cerrar sesión
    </button>
  );
}
