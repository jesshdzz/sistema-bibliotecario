import { expect, test } from "vitest";
import { datosRegistro } from "./registro";

const dominios = {
  alumno: ["gs.utm.mx"],
  trabajador: ["gs.utm.mx", "mixteco.utm.mx"],
};
const carreras = {
  ICO: { etiqueta: "Ingeniería en Computación", semestreMax: 10 },
  POS: { etiqueta: "Posgrado", semestreMax: 4 },
};
const ctx = { dominios, carreras };
const email = "a@gs.utm.mx";

const alumno = {
  email,
  tipoSolicitado: "alumno",
  matricula: " 2021001101 ",
  carrera: "ICO",
  semestre: 5,
};

test("alumno completo: recorta espacios", () => {
  expect(datosRegistro(alumno, ctx)).toEqual({
    datos: {
      tipoSolicitado: "alumno",
      matricula: "2021001101",
      carrera: "ICO",
      semestre: 5,
      numeroTrabajador: null,
    },
  });
});

test("alumno sin matrícula falla", () => {
  expect(datosRegistro({ ...alumno, matricula: "  " }, ctx)).toHaveProperty(
    "error",
  );
});

test("semestre 0 falla", () => {
  expect(datosRegistro({ ...alumno, semestre: 0 }, ctx)).toHaveProperty(
    "error",
  );
});

test("carrera y semestre contra el catálogo", () => {
  const con = (carrera: string, semestre: number) =>
    datosRegistro({ ...alumno, carrera, semestre }, ctx);
  expect(con("XXX", 1)).toEqual({ error: "Elige una carrera válida." });
  expect(con("toString", 1)).toHaveProperty("error");
  expect(con("POS", 5)).toEqual({
    error: "El semestre debe estar entre 1 y 4.",
  });
  expect(con("POS", 4)).toHaveProperty("datos");
  expect(con("ICO", 10)).toHaveProperty("datos");
  expect(con("ICO", 11)).toHaveProperty("error");
});

test("trabajador sin número falla; con número descarta datos de alumno", () => {
  expect(
    datosRegistro({ tipoSolicitado: "trabajador", email }, ctx),
  ).toHaveProperty("error");
  expect(
    datosRegistro(
      {
        ...alumno,
        tipoSolicitado: "trabajador",
        numeroTrabajador: "T-9",
      },
      ctx,
    ),
  ).toEqual({
    datos: {
      tipoSolicitado: "trabajador",
      matricula: null,
      carrera: null,
      semestre: null,
      numeroTrabajador: "T-9",
    },
  });
});

test("público (o ausente) descarta campos extra", () => {
  const vacio = {
    matricula: null,
    carrera: null,
    semestre: null,
    numeroTrabajador: null,
  };
  expect(datosRegistro({ ...alumno, tipoSolicitado: "publico" }, ctx)).toEqual({
    datos: { tipoSolicitado: "publico", ...vacio },
  });
  expect(datosRegistro({ matricula: "x" }, ctx)).toEqual({
    datos: { tipoSolicitado: "publico", ...vacio },
  });
});

const ok = (tipoSolicitado: string, email: string, extra = {}) =>
  datosRegistro(
    { ...alumno, tipoSolicitado, numeroTrabajador: "T-9", email, ...extra },
    ctx,
  );

test("correo institucional según tipo", () => {
  expect(ok("alumno", "a@gs.utm.mx")).toHaveProperty("datos");
  expect(ok("alumno", "a@mixteco.utm.mx")).toHaveProperty("error");
  expect(ok("trabajador", "a@mixteco.utm.mx")).toHaveProperty("datos");
  expect(ok("publico", "a@gmail.com")).toHaveProperty("datos");
  expect(ok("alumno", "x@evilgs.utm.mx")).toHaveProperty("error");
  expect(ok("alumno", "X@GS.UTM.MX")).toHaveProperty("datos");
});
