import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { detectarTipoComprobante, validarDatos, validarFecha } from "../../src/lib/reservas/validacion";
import { fechaLocal, formatearHora } from "../../src/lib/reservas/fechas";

const base = {
  servicio: "kapping",
  inicio: "2026-10-10T13:30:00.000Z",
  nombre: "Ana Pérez",
  email: "ana@example.com",
  telefono: "+54 9 11 5555-5555",
  comentarios: "",
};

describe("comprobante", () => {
  test("reconoce JPG, PNG y PDF por sus bytes", () => {
    assert.equal(detectarTipoComprobante(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))?.extension, "jpg");
    assert.equal(detectarTipoComprobante(new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))?.extension, "png");
    assert.equal(detectarTipoComprobante(new TextEncoder().encode("%PDF-1.7"))?.extension, "pdf");
  });

  test("rechaza un ejecutable o HTML renombrado", () => {
    assert.equal(detectarTipoComprobante(new Uint8Array([0x4d, 0x5a, 0x90, 0x00])), null); // "MZ" .exe
    assert.equal(detectarTipoComprobante(new TextEncoder().encode("<svg onload=alert(1)>")), null);
    assert.equal(detectarTipoComprobante(new Uint8Array([])), null);
  });
});

describe("datos", () => {
  test("acepta datos válidos", () => assert.equal(validarDatos(base), null));
  test("rechaza email inválido", () => assert.equal(validarDatos({ ...base, email: "ana@" })?.campo, "email"));
  test("rechaza teléfono corto", () => assert.equal(validarDatos({ ...base, telefono: "123" })?.campo, "telefono"));
  test("rechaza slug con caracteres raros", () => assert.equal(validarDatos({ ...base, servicio: "../x" })?.campo, "servicio"));
  test("rechaza horario vacío", () => assert.equal(validarDatos({ ...base, inicio: "" })?.campo, "inicio"));
  test("fechas", () => {
    assert.ok(validarFecha("2026-10-10"));
    assert.ok(!validarFecha("10/10/2026"));
  });
});

describe("zona horaria", () => {
  test("muestra la hora de Buenos Aires", () => {
    assert.equal(formatearHora("2026-10-10T13:30:00Z"), "10:30");
    assert.equal(fechaLocal("2026-10-11T02:00:00Z"), "2026-10-10");
  });
});
