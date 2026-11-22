import Link from "next/link";
import { Campo } from "@/components/campo";
import { CamposRegistro } from "@/components/campos-registro";
import { FormularioAuth } from "@/components/formulario-auth";
import { getParametro } from "@/lib/parametros";

export default async function Registro() {
  const dominios = {
    alumno: await getParametro("registro.dominios_alumno"),
    trabajador: await getParametro("registro.dominios_trabajador"),
  };
  return (
    <>
      <h1 className="text-3xl font-bold">Crear cuenta</h1>
      <p className="mt-1 mb-4 text-base-content/70">
        Crea tu cuenta para solicitar libros.
      </p>
      <FormularioAuth modo="registro" boton="Crear cuenta">
        <Campo etiqueta="Nombre completo">
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className="input w-full"
          />
        </Campo>
        <Campo etiqueta="Correo electrónico">
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="nombre@utm.mx"
            className="input w-full"
          />
        </Campo>
        <Campo etiqueta="Contraseña">
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input w-full"
          />
        </Campo>
        <Campo etiqueta="Confirmar contraseña">
          <input
            type="password"
            name="confirmar"
            required
            minLength={8}
            autoComplete="new-password"
            className="input w-full"
          />
        </Campo>
        <CamposRegistro dominios={dominios} />
      </FormularioAuth>
      <p className="text-sm text-center mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/iniciar-sesion" className="link">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
