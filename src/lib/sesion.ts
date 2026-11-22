import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import type { Usuario } from "./biblioteca";

export const usuarioSesion = cache(async (): Promise<Usuario | undefined> => {
  const sesion = await auth.api.getSession({ headers: await headers() });
  if (!sesion) return undefined;
  const { user } = sesion;
  return {
    id: user.id,
    nombre: user.name,
    correo: user.email,
    matricula: user.matricula ?? "",
    carrera: user.carrera ?? "",
    rol: user.rol,
  };
});

export const esPersonal = (usuario?: Usuario) =>
  !!usuario && usuario.rol !== "usuario";
