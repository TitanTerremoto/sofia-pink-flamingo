import { precios, type PrecioKey } from "@/config/precios";
import { sitio } from "@/config/sitio";

const formato = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function precioDe(key: PrecioKey): number | null {
  return precios[key];
}

/** "$ 25.000" o "$ X" si el precio todavía no se cargó. */
export function formatPrecio(valor: number | null): string {
  return valor == null ? "$ X" : `$ ${formato.format(valor)}`;
}

/** Monto de la seña según el porcentaje configurado, o null si no hay precio. */
export function montoSena(valor: number | null): number | null {
  return valor == null ? null : Math.round((valor * sitio.reservas.senaPorcentaje) / 100);
}
