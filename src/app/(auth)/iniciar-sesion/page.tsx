import Link from "next/link";
import { Campo } from "@/components/campo";
import { FormularioAuth } from "@/components/formulario-auth";

export default function IniciarSesion() {
  return (
    <>
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <p className="mt-1 mb-4 text-base-content/70">Accede con tu cuenta.</p>
      <FormularioAuth modo="entrar" boton="Entrar">
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
            autoComplete="current-password"
            className="input w-full"
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
