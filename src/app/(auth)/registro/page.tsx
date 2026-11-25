import { CamposRegistro } from "@/components/campos-registro";
import { FormularioAuth } from "@/components/formulario-auth";
import { Campo, Entrada } from "@/components/ui/campo";
import { Encabezado } from "@/components/ui/pagina";
import { getCarreras } from "@/lib/carreras";
import { getParametro } from "@/lib/parametros";
import Link from "next/link";
import { connection } from "next/server";

export default async function Registro() {
  await connection();
  const dominios = {
    alumno: await getParametro("registro.dominios_alumno"),
    trabajador: await getParametro("registro.dominios_trabajador"),
  };
  return (
    <>
      <div className="mb-6">
        <Encabezado
          titulo="Crear cuenta"
          descripcion="Crea tu cuenta para solicitar libros."
        />
      </div>
      <FormularioAuth modo="registro" boton="Crear cuenta">
        <Campo etiqueta="Nombre completo">
          <Entrada type="text" name="name" required autoComplete="name" />
        </Campo>

        <CamposRegistro dominios={dominios} carreras={await getCarreras()} />

        <Campo etiqueta="Contraseña">
          <Entrada
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Campo>
        <Campo etiqueta="Confirmar contraseña">
          <Entrada
            type="password"
            name="confirmar"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </Campo>
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
