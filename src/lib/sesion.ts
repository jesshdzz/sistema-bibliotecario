import type { Usuario } from "./biblioteca";

// shortcut: sin autenticación hasta conectar better-auth (src/lib/auth.ts)
export async function usuarioSesion(): Promise<Usuario | undefined> {
  return undefined;
}

// shortcut: nadie es personal hasta que existan roles en la BD
export const esPersonal = (_usuario?: Usuario) => false;
