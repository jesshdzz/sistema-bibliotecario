import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db, schema } from "@/db";
import { getCarreras } from "./carreras";
import { getParametro } from "./parametros";
import { datosRegistro } from "./registro";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema, transaction: true }),
  // Sin verificación de correo: no hay SMTP (spec Q23).
  emailAndPassword: { enabled: true },
  rateLimit: {
    // shortcut: rate limit en memoria, por instancia; pasar a storage "database" si se escala a varias réplicas
    customRules: {
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 60, max: 5 },
    },
  },
  user: {
    // Rol y tipo los asigna el personal (spec RF-57); lo declarado queda en tipoSolicitado.
    additionalFields: {
      rol: {
        type: ["usuario", "bibliotecario", "administrador", "consulta"],
        input: false,
      },
      tipoUsuario: { type: ["alumno", "trabajador", "publico"], input: false },
      estatus: { type: ["activo", "baja"], required: false, input: false },
      tipoSolicitado: {
        type: ["alumno", "trabajador", "publico"],
        required: false,
        input: true,
      },
      matricula: { type: "string", required: false, input: true },
      carrera: { type: "string", required: false, input: true },
      semestre: { type: "number", required: false, input: true },
      numeroTrabajador: { type: "string", required: false, input: true },
    },
  },
  // No hay UI para editar el perfil; así nadie cambia lo declarado ni el tipo.
  disabledPaths: ["/update-user"],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const r = datosRegistro(user, {
            dominios: {
              alumno: await getParametro("registro.dominios_alumno"),
              trabajador: await getParametro("registro.dominios_trabajador"),
            },
            carreras: await getCarreras(),
          });
          if ("error" in r)
            throw new APIError("BAD_REQUEST", {
              message: r.error,
              code: "REGISTRO_INVALIDO",
            });
          return {
            data: {
              ...user,
              ...r.datos,
              rol: "usuario",
              tipoUsuario: "publico",
            },
          };
        },
      },
    },
  },
  plugins: [nextCookies()],
});
