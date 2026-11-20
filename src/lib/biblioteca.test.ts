import { expect, test } from "vitest";
import { diasRetraso, fecha, normalizar } from "./biblioteca";

test("normaliza acentos, mayúsculas y espacios", () => {
  expect(normalizar("  MARÍA López ")).toBe("maria lopez");
});

test("el retraso cuenta días completos desde el vencimiento", () => {
  expect(diasRetraso("2026-11-08T12:00:00Z", "2026-11-15T12:00:00Z")).toBe(7);
  expect(diasRetraso("2026-11-17T12:00:00Z", "2026-11-15T12:00:00Z")).toBe(0);
  expect(diasRetraso(undefined)).toBe(0);
});

test("la fecha se muestra en la zona de México", () => {
  // 03:00 UTC del 15 es todavía el día 14 en la Ciudad de México (UTC-6).
  expect(fecha("2026-11-15T03:00:00Z")).toContain("14");
  expect(fecha()).toBe("—");
});
