import type { Categoria } from "@/lib/datos/tipos";

export type EstadoReserva = "pendiente_verificacion" | "confirmada" | "rechazada" | "cancelada";

export const ESTADOS: Record<EstadoReserva, { etiqueta: string; clase: string }> = {
  pendiente_verificacion: { etiqueta: "Pendiente de verificación", clase: "bg-amber-100 text-amber-800" },
  confirmada: { etiqueta: "Confirmada", clase: "bg-emerald-100 text-emerald-800" },
  rechazada: { etiqueta: "Rechazada", clase: "bg-rose-100 text-rose-800" },
  cancelada: { etiqueta: "Cancelada", clase: "bg-stone-200 text-stone-700" },
};

export const NOMBRE_CATEGORIA: Record<Categoria, string> = {
  manicuria: "Manicuría",
  rostro: "Rostro",
  astrologia: "Astrología",
};

export const DIAS_SEMANA = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

/**
 * Convierte "2026-10-10T10:00" (input datetime-local, hora de Buenos Aires) a ISO.
 * Argentina usa UTC-3 todo el año (sin horario de verano desde 2009).
 */
export function horaLocalBAaISO(valor: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(valor)) return null;
  const fecha = new Date(`${valor}:00-03:00`);
  return Number.isNaN(fecha.getTime()) ? null : fecha.toISOString();
}
