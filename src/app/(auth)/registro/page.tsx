import Link from "next/link";
import { Campo } from "@/components/campo";

export default function Registro() {
  return (
    <>
      <h1 className="text-3xl font-bold">Crear cuenta</h1>
      <p className="mt-1 mb-4 text-base-content/70">
        Regístrate con tus datos de la universidad.
      </p>
      <form>
        <Campo etiqueta="Nombre completo">
          <input
            type="text"
            required
            autoComplete="name"
            className="input w-full"
          />
        </Campo>
        <Campo etiqueta="Matrícula">
          <input
            type="text"
            required
            placeholder="2022020145"
            className="input w-full font-mono"
          />
        </Campo>
        <Campo etiqueta="Correo institucional">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="nombre@utm.mx"
            className="input w-full"
          />
        </Campo>
        <Campo etiqueta="Contraseña">
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="input w-full"
          />
        </Campo>
        <button type="button" className="btn btn-primary w-full mt-4">
          Crear cuenta
        </button>
      </form>
      <p className="text-sm text-center mt-6">
        ¿Ya tienes cuenta?{" "}
        <Link href="/iniciar-sesion" className="link">
          Inicia sesión
        </Link>
      </p>
    </>
  );
}
