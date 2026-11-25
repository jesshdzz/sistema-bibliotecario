"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";
import { Alerta } from "@/components/ui/alerta";
import { Boton } from "@/components/ui/boton";
import { authClient, mensajeError } from "@/lib/auth-client";

export function FormularioAuth({
  modo,
  boton,
  children,
}: {
  modo: "entrar" | "registro";
  boton: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [enviando, setEnviando] = useState(false);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setError(undefined);
    const d = new FormData(e.currentTarget);
    const email = String(d.get("email"));
    const password = String(d.get("password"));
    if (modo === "registro" && password !== d.get("confirmar")) {
      setError("Las contraseñas no coinciden.");
      setEnviando(false);
      return;
    }
    const tipo = String(d.get("tipoSolicitado")) as
      | "alumno"
      | "trabajador"
      | "publico";
    const texto = (campo: string) =>
      d.has(campo) ? String(d.get(campo)) : undefined;
    const { error } =
      modo === "entrar"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({
            name: String(d.get("name")),
            email,
            password,
            tipoSolicitado: tipo,
            matricula: texto("matricula"),
            carrera: texto("carrera"),
            semestre: d.has("semestre") ? Number(d.get("semestre")) : undefined,
            numeroTrabajador: texto("numeroTrabajador"),
          });
    if (error) {
      setError(mensajeError(error));
      setEnviando(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={enviar} onChange={() => setError(undefined)}>
      {children}
      {error && (
        <Alerta tono="error" className="mt-4">
          {error}
        </Alerta>
      )}
      <Boton type="submit" disabled={enviando} anchoCompleto className="mt-4">
        {boton}
      </Boton>
    </form>
  );
}
