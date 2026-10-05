const formato = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

/** "$ 25.000" o "$ X" si el precio todavía no se cargó. */
export function formatPrecio(valor: number | null | undefined): string {
  return valor == null ? "$ X" : `$ ${formato.format(valor)}`;
}

/** Monto de la seña, o null si el servicio todavía no tiene precio. Mismo redondeo que crear_reserva(). */
export function montoSena(valor: number | null, porcentaje: number): number | null {
  return valor == null ? null : Math.round((valor * porcentaje) / 100);
}
