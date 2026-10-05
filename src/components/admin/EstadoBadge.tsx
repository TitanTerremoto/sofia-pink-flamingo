import { ESTADOS, type EstadoReserva } from "@/lib/admin/formato";

export function EstadoBadge({ estado }: { estado: EstadoReserva }) {
  const e = ESTADOS[estado];
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ${e.clase}`}>{e.etiqueta}</span>;
}
