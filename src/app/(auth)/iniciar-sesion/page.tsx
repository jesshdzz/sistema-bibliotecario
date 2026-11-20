import Link from "next/link";
import { Campo } from "@/components/campo";

export default function IniciarSesion() {
  return (
    <>
      <h1 className="text-3xl font-bold">Iniciar sesión</h1>
      <p className="mt-1 mb-4 text-base-content/70">
        Accede con tu cuenta institucional.
      </p>
      <form>
        <Campo etiqueta="Correo institucional">
          <input
            type="email"
            autoComplete="email"
            placeholder="nombre@utm.mx"
            className="input w-full"
          />
        </Campo>
        <Campo etiqueta="Contraseña">
          <input
            type="password"
            autoComplete="current-password"
            className="input w-full"
          />
        </Campo>
        <button type="button" className="btn btn-primary mt-4 w-full">
          Entrar
        </button>
      </form>
      <p className="mt-6 text-center text-sm">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="link">
          Crear cuenta
        </Link>
      </p>
    </>
  );
}
