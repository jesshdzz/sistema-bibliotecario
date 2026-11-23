import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
});

type ErrorAuth = { code?: string; message?: string; status: number };

const MENSAJES: Record<string, string> = {
  INVALID_EMAIL_OR_PASSWORD: "Correo o contraseña incorrectos.",
  USER_ALREADY_EXISTS: "Ya existe una cuenta con ese correo.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Ya existe una cuenta con ese correo.",
  INVALID_EMAIL: "El correo no es válido.",
  PASSWORD_TOO_SHORT: "La contraseña debe tener al menos 8 caracteres.",
};

export function mensajeError(error: ErrorAuth) {
  if (error.status === 429)
    return "Demasiados intentos. Espera un minuto e inténtalo de nuevo.";
  if (error.code === "REGISTRO_INVALIDO" && error.message) return error.message;
  return (
    MENSAJES[error.code ?? ""] ??
    "No se pudo completar la operación. Inténtalo de nuevo."
  );
}
