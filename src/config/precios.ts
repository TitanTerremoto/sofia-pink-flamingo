/**
 * ============================================================
 *  PRECIOS INICIALES
 * ============================================================
 *  - Con la base de datos conectada: los precios se cambian desde
 *    /admin → Servicios. Estos valores sólo cargan la base la primera vez.
 *  - Sin base de datos: se cambian acá y se actualizan en toda la web.
 *
 *  Número sin "$" ni puntos (ej. 25000). `null` muestra "$ X".
 *  La seña se calcula sola a partir de estos valores.
 * ============================================================
 */

export const precios = {
  // Manicuría
  precio_semipermanente: null,
  precio_kapping: null,
  precio_esculpidas: null,

  // Rostro
  precio_lifting: null,
  precio_laminado: null,
  precio_diseno: null,
  precio_sombreado: null,

  // Astrología
  precio_carta_natal: null,
  precio_revolucion_solar: null,
  precio_tarot_astrologico: null,
} satisfies Record<string, number | null>;

export type PrecioKey = keyof typeof precios;
