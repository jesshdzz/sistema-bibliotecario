import { expect, test } from "vitest";
import { datosRegistro } from "./registro";

const dominios = {
  alumno: ["gs.utm.mx"],
  trabajador: ["gs.utm.mx", "mixteco.utm.mx"],
};
const email = "a@gs.utm.mx";

const alumno = {
  email,
  tipoSolicitado: "alumno",
  matricula: " 2021001101 ",
  carrera: "Computación",
  semestre: 5,
};

test("alumno completo: recorta espacios", () => {
  expect(datosRegistro(alumno, dominios)).toEqual({
    datos: {
      tipoSolicitado: "alumno",
      matricula: "2021001101",
      carrera: "Computación",
      semestre: 5,
      numeroTrabajador: null,
    },
  });
});

test("alumno sin matrícula falla", () => {
  expect(
    datosRegistro({ ...alumno, matricula: "  " }, dominios),
  ).toHaveProperty("error");
});

test("semestre 0 falla", () => {
  expect(datosRegistro({ ...alumno, semestre: 0 }, dominios)).toHaveProperty(
    "error",
  );
});

test("trabajador sin número falla; con número descarta datos de alumno", () => {
  expect(
    datosRegistro({ tipoSolicitado: "trabajador", email }, dominios),
  ).toHaveProperty("error");
  expect(
    datosRegistro(
      {
        ...alumno,
        tipoSolicitado: "trabajador",
        numeroTrabajador: "T-9",
      },
      dominios,
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
  expect(
    datosRegistro({ ...alumno, tipoSolicitado: "publico" }, dominios),
  ).toEqual({
    datos: { tipoSolicitado: "publico", ...vacio },
  });
  expect(datosRegistro({ matricula: "x" }, dominios)).toEqual({
    datos: { tipoSolicitado: "publico", ...vacio },
  });
});

const ok = (tipoSolicitado: string, email: string, extra = {}) =>
  datosRegistro(
    { ...alumno, tipoSolicitado, numeroTrabajador: "T-9", email, ...extra },
    dominios,
  );

test("correo institucional según tipo", () => {
  expect(ok("alumno", "a@gs.utm.mx")).toHaveProperty("datos");
  expect(ok("alumno", "a@mixteco.utm.mx")).toHaveProperty("error");
  expect(ok("trabajador", "a@mixteco.utm.mx")).toHaveProperty("datos");
  expect(ok("publico", "a@gmail.com")).toHaveProperty("datos");
  expect(ok("alumno", "x@evilgs.utm.mx")).toHaveProperty("error");
  expect(ok("alumno", "X@GS.UTM.MX")).toHaveProperty("datos");
});
