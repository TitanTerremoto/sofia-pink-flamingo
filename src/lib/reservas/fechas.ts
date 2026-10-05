import { zonaHoraria } from "@/config/sitio";

/** "sábado 10 de octubre" en hora de Buenos Aires. */
export function formatearDia(iso: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", { timeZone: zonaHoraria, weekday: "long", day: "numeric", month: "long" }).format(
    new Date(iso),
  );
}

/** "10:30" en hora de Buenos Aires. */
export function formatearHora(iso: string | Date): string {
  return new Intl.DateTimeFormat("es-AR", { timeZone: zonaHoraria, hour: "2-digit", minute: "2-digit", hour12: false }).format(
    new Date(iso),
  );
}

/** "sábado 10 de octubre, 10:30 h". */
export function formatearTurno(iso: string | Date): string {
  return `${formatearDia(iso)}, ${formatearHora(iso)} h`;
}

/** Fecha YYYY-MM-DD de un instante, en hora de Buenos Aires. */
export function fechaLocal(iso: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: zonaHoraria, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(iso),
  );
}
