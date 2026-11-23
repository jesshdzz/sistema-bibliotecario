"use client";

import { useState } from "react";
import { Campo } from "@/components/campo";
import type { Carreras, Dominios } from "@/lib/registro";

const TIPOS = [
  ["alumno", "Alumno"],
  ["trabajador", "Trabajador"],
  ["publico", "Externo"],
] as const;

export function CamposRegistro({
  dominios,
  carreras,
}: {
  dominios: Dominios;
  carreras: Carreras;
}) {
  const [tipo, setTipo] = useState<(typeof TIPOS)[number][0]>("publico");
  const [carrera, setCarrera] = useState("");
  const [semestre, setSemestre] = useState("");
  const semestreMax = carreras[carrera]?.semestreMax ?? 0;

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
        <p className="my-2 text-sm text-base-content/70">
          Tus datos se validan en ventanilla, mientras tanto tu cuenta es de
          tipo público (No puedes pedir préstamos para domicilio).
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
            <select
              name="carrera"
              required
              value={carrera}
              onChange={(e) => {
                setCarrera(e.target.value);
                if (Number(semestre) > carreras[e.target.value].semestreMax)
                  setSemestre("");
              }}
              className="select w-full"
            >
              <option value="" disabled>
                Elige tu carrera
              </option>
              {Object.entries(carreras).map(([codigo, { etiqueta }]) => (
                <option key={codigo} value={codigo}>
                  {etiqueta}
                </option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="Semestre">
            <select
              name="semestre"
              required
              disabled={!carrera}
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
              className="select w-full"
            >
              <option value="" disabled>
                Elige tu semestre
              </option>
              {Array.from({ length: semestreMax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
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
        <p className="my-2 text-sm text-base-content/70">
          Usa tu correo institucional (
          {dominios[tipo].map((d) => `@${d}`).join(" o ")}).
        </p>
      )}
    </>
  );
}
