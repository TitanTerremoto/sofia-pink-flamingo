/**
 * ============================================================
 *  DATOS DE EJEMPLO — sólo para la VISTA PREVIA
 * ============================================================
 *  Se activan con NEXT_PUBLIC_DEMO=true (lo hace el workflow de
 *  GitHub Pages). NUNCA en el sitio real: ahí se usan los precios
 *  y fotos de Sofi (src/config/precios.ts, src/config/imagenes.ts
 *  o el panel /admin).
 *
 *  Fotos: Unsplash (licencia Unsplash, uso gratuito), enlazadas
 *  desde images.unsplash.com; no se guardan en el repositorio.
 *  Precios: inventados, sólo para mostrar cómo se ve la web.
 * ============================================================
 */

export const modoEjemplo = process.env.NEXT_PUBLIC_DEMO === "true";

/** Foto de Unsplash recortada al tamaño justo (servida por su CDN). */
const unsplash = (id: string, ancho = 900, alto = 900) =>
  `https://images.unsplash.com/photo-${id}?w=${ancho}&h=${alto}&fit=crop&crop=entropy&auto=format&q=72`;

export const fotosEjemplo = {
  sofia: {
    // Sin rostros: no se muestra a otra persona como si fuera Sofi.
    sobreMi: unsplash("1562048048-86d659689440", 900, 1125),
    contacto: unsplash("1504358031587-0c7faf5b8364", 900, 1125),
  },
  categorias: {
    manicuria: unsplash("1522337660859-02fbefca4702"),
    rostro: unsplash("1589710751893-f9a6770ad71b"),
    astrologia: unsplash("1624183720151-7396650072a9"),
  },
  servicios: {
    semipermanente: unsplash("1610992015762-45dca7fa3a85"),
    kapping: unsplash("1612887390768-fb02affea7a6"),
    esculpidas: unsplash("1604902396830-aca29e19b067"),
    lifting: unsplash("1639629509821-c54cdd984227"),
    laminado: unsplash("1564278692313-b2d65996fc93"),
    diseno: unsplash("1516220362602-dba5272034e7"),
    sombreado: unsplash("1519415387722-a1c3bbef716c"),
    "carta-natal": unsplash("1729335511883-29eade10006b"),
    "revolucion-solar": unsplash("1533294455009-a77b7557d2d1"),
    "tarot-astrologico": unsplash("1637757969279-c4d028905131"),
  },
};

/** Precios inventados (pesos argentinos), por slug de servicio. */
export const preciosEjemplo: Record<string, number> = {
  semipermanente: 24000,
  kapping: 30000,
  esculpidas: 42000,
  lifting: 28000,
  laminado: 26000,
  diseno: 15000,
  sombreado: 18000,
  "carta-natal": 45000,
  "revolucion-solar": 40000,
  "tarot-astrologico": 25000,
};
