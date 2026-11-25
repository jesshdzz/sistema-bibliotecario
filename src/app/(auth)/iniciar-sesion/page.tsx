import Link from "next/link";
import { FormularioAuth } from "@/components/formulario-auth";
import { Campo, Entrada } from "@/components/ui/campo";
import { Encabezado } from "@/components/ui/pagina";

export default function IniciarSesion() {
  return (
    <>
      <div className="mb-6">
        <Encabezado
          titulo="Iniciar sesión"
          descripcion="Accede con tu cuenta."
        />
      </div>
      <FormularioAuth modo="entrar" boton="Entrar">
        <Campo etiqueta="Correo electrónico">
          <Entrada
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="nombre@utm.mx"
          />
        </Campo>
        <Campo etiqueta="Contraseña">
          <Entrada
            type="password"
            name="password"
            required
            autoComplete="current-password"
          />
        </Campo>
      </FormularioAuth>
      <p className="mt-6 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="link">
          Crear cuenta
        </Link>
      </p>
    </>
  );
}
