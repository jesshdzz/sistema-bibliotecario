"use client";

import { useState } from "react";
import { Campo, Entrada, Segmentado, Selector } from "@/components/ui/campo";
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
        <Segmentado
          name="tipoSolicitado"
          opciones={TIPOS}
          valor={tipo}
          onChange={(v) => setTipo(v as typeof tipo)}
        />
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
            <Entrada type="text" name="matricula" required mono />
          </Campo>
          <Campo etiqueta="Carrera">
            <Selector
              name="carrera"
              required
              value={carrera}
              onChange={(e) => {
                setCarrera(e.target.value);
                if (Number(semestre) > carreras[e.target.value].semestreMax)
                  setSemestre("");
              }}
            >
              <option value="" disabled>
                Elige tu carrera
              </option>
              {Object.entries(carreras).map(([codigo, { etiqueta }]) => (
                <option key={codigo} value={codigo}>
                  {etiqueta}
                </option>
              ))}
            </Selector>
          </Campo>
          <Campo etiqueta="Semestre">
            <Selector
              name="semestre"
              required
              disabled={!carrera}
              value={semestre}
              onChange={(e) => setSemestre(e.target.value)}
            >
              <option value="" disabled>
                Elige tu semestre
              </option>
              {Array.from({ length: semestreMax }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Selector>
          </Campo>
        </>
      )}
      {tipo === "trabajador" && (
        <Campo etiqueta="Número de trabajador">
          <Entrada type="text" name="numeroTrabajador" required mono />
        </Campo>
      )}
      <Campo
        etiqueta="Correo electrónico"
        ayuda={
          tipo !== "publico"
            ? `Usa tu correo institucional (${dominios[tipo].map((d) => `@${d}`).join(" o ")}).`
            : undefined
        }
      >
        <Entrada
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder={
            tipo !== "publico" ? "nombre@gs.utm.mx" : "correo@email.com"
          }
        />
      </Campo>
    </>
  );
}
