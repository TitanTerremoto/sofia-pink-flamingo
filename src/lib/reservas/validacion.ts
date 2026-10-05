/**
 * Validaciones de la reserva que corren en el SERVIDOR (la interfaz repite
 * algunas sólo para avisar antes; nunca se confía en ella).
 * La base vuelve a validar todo en crear_reserva().
 */

export const TAMANO_MAXIMO_COMPROBANTE = 4 * 1024 * 1024; // 4 MB (Vercel limita los pedidos a 4,5 MB)

export type TipoComprobante = { extension: "jpg" | "png" | "pdf"; mime: string };

/** Detecta el tipo real del archivo por sus primeros bytes (no por la extensión ni por lo que diga el navegador). */
export function detectarTipoComprobante(bytes: Uint8Array): TipoComprobante | null {
  const empieza = (...firma: number[]) => firma.every((b, i) => bytes[i] === b);
  if (empieza(0xff, 0xd8, 0xff)) return { extension: "jpg", mime: "image/jpeg" };
  if (empieza(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return { extension: "png", mime: "image/png" };
  if (empieza(0x25, 0x50, 0x44, 0x46, 0x2d)) return { extension: "pdf", mime: "application/pdf" }; // "%PDF-"
  return null;
}

export type DatosReserva = {
  servicio: string;
  inicio: string;
  nombre: string;
  email: string;
  telefono: string;
  comentarios: string;
};

export type ErrorValidacion = { campo: keyof DatosReserva | "comprobante"; mensaje: string };

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function validarDatos(d: DatosReserva): ErrorValidacion | null {
  if (!/^[a-z0-9-]{1,60}$/.test(d.servicio)) return { campo: "servicio", mensaje: "Elegí un servicio." };
  if (Number.isNaN(Date.parse(d.inicio)) || !/^\d{4}-\d{2}-\d{2}T/.test(d.inicio))
    return { campo: "inicio", mensaje: "Elegí una fecha y un horario." };
  const nombre = d.nombre.trim();
  if (nombre.length < 2 || nombre.length > 120) return { campo: "nombre", mensaje: "Escribí tu nombre completo." };
  const email = d.email.trim();
  if (email.length > 254 || !EMAIL.test(email)) return { campo: "email", mensaje: "Revisá tu email." };
  const digitos = d.telefono.replace(/\D/g, "");
  if (d.telefono.trim().length > 30 || digitos.length < 6 || digitos.length > 15)
    return { campo: "telefono", mensaje: "Revisá tu teléfono (con código de área)." };
  if (d.comentarios.length > 1000) return { campo: "comentarios", mensaje: "El comentario es demasiado largo (máx. 1000 caracteres)." };
  return null;
}

export function validarFecha(fecha: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(fecha) && !Number.isNaN(Date.parse(`${fecha}T12:00:00Z`));
}
