"use client";

import { useState } from "react";
import { Campo } from "@/components/campo";
import type { Dominios } from "@/lib/registro";

const TIPOS = [
  ["alumno", "Alumno"],
  ["trabajador", "Trabajador"],
  ["publico", "Externo"],
] as const;

export function CamposRegistro({ dominios }: { dominios: Dominios }) {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number][0]>("publico");

  return (
    <>
      <Campo etiqueta="Tipo de cuenta">
        <div className="join w-full">
          {TIPOS.map(([valor, etiqueta]) => (
            <input
              key={valor}
              type="radio"
              name="tipoSolicitado"
              value={valor}
              aria-label={etiqueta}
              checked={tipo === valor}
              onChange={() => setTipo(valor)}
              className="join-item btn flex-1"
            />
          ))}
        </div>
      </Campo>
      {tipo !== "publico" && (
        <p className="mt-2 text-sm text-base-content/70">
          Tus datos se validan en ventanilla, mientras tanto tu cuenta es de
          tipo público (No puedes pedir préstamos para domicilo).
        </p>
      )}
      {tipo === "alumno" && (
        <>
          <Campo etiqueta="Matrícula">
            <input
              type="text"
              name="matricula"
              required
              className="input w-full font-mono"
            />
          </Campo>
          <Campo etiqueta="Carrera">
            <input
              type="text"
              name="carrera"
              required
              className="input w-full"
            />
          </Campo>
          <Campo etiqueta="Semestre">
            <input
              type="number"
              name="semestre"
              required
              min={1}
              step={1}
              className="input w-full"
            />
          </Campo>
        </>
      )}
      {tipo === "trabajador" && (
        <Campo etiqueta="Número de trabajador">
          <input
            type="text"
            name="numeroTrabajador"
            required
            className="input w-full font-mono"
          />
        </Campo>
      )}
      <Campo etiqueta="Correo electrónico">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={
            tipo !== "publico" ? "nombre@gs.utm.mx" : "correo@email.com"
          }
          className="input w-full"
        />
      </Campo>

      {tipo !== "publico" && (
        <p className="mt-2 text-sm text-base-content/70">
          Usa tu correo institucional (
          {dominios[tipo].map((d) => `@${d}`).join(" o ")}).
        </p>
      )}
    </>
  );
}
