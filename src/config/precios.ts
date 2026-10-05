/**
 * ============================================================
 *  PRECIOS — se cambian SOLO acá y se actualizan en toda la web.
 * ============================================================
 *
 *  - Escribí el número sin "$" ni puntos. Ej: 25000
 *  - Si dejás `null`, el sitio muestra "$ X".
 *  - La seña (50%) se calcula sola a partir de estos valores.
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
