/**
 * ============================================================
 *  LOGO Y FOTOGRAFÍAS
 * ============================================================
 *
 *  Cómo reemplazar una foto:
 *   1. Copiá tu archivo dentro de /public/images/... (por ejemplo
 *      /public/images/sofia/sobre-mi.jpg).
 *   2. Cambiá la ruta acá (sin "/public"): "/images/sofia/sobre-mi.jpg".
 *  Listo: se actualiza en todos los lugares donde se usa.
 *
 *  Tamaños recomendados (JPG o WEBP, menos de ~400 KB):
 *   - Fotos circulares de servicios: cuadradas, 1000 x 1000 px.
 *   - Foto "Sobre mí" y "Contacto": verticales, 1000 x 1300 px.
 *
 *  LOGO:
 *   - `logo: null` usa el logo tipográfico incluido en el sitio.
 *   - Para usar tu archivo: guardalo en /public/images/marca/ y poné la ruta,
 *     por ejemplo logo: "/images/marca/logo.png" (PNG con fondo transparente
 *     o SVG, ideal 1200 px de ancho).
 */

import { fotosEjemplo, modoEjemplo } from "./ejemplo";

const imagenesPropias = {
  logo: null as string | null,

  sofia: {
    sobreMi: "/images/sofia/sobre-mi.svg",
    contacto: "/images/sofia/contacto.svg",
  },

  /** Fotos circulares de la sección SERVICIOS del inicio. */
  categorias: {
    manicuria: "/images/manicuria/portada.svg",
    rostro: "/images/rostro/portada.svg",
    astrologia: "/images/astrologia/portada.svg",
  },

  servicios: {
    semipermanente: "/images/manicuria/semipermanente.svg",
    kapping: "/images/manicuria/kapping.svg",
    esculpidas: "/images/manicuria/esculpidas.svg",

    lifting: "/images/rostro/lifting.svg",
    laminado: "/images/rostro/laminado.svg",
    diseno: "/images/rostro/diseno.svg",
    sombreado: "/images/rostro/sombreado.svg",

    "carta-natal": "/images/astrologia/carta-natal.svg",
    "revolucion-solar": "/images/astrologia/revolucion-solar.svg",
    "tarot-astrologico": "/images/astrologia/tarot-astrologico.svg",
  },
};

/** En la vista previa (modo ejemplo) se usan fotos de muestra; en el sitio real, las de arriba. */
export const imagenes: typeof imagenesPropias = modoEjemplo
  ? { logo: imagenesPropias.logo, ...fotosEjemplo }
  : imagenesPropias;

/** Foto de un servicio por su slug; si no hay una propia, usa la portada de su categoría. */
export function imagenServicio(slug: string, categoria: keyof typeof imagenes.categorias): string {
  return (imagenes.servicios as Record<string, string>)[slug] ?? imagenes.categorias[categoria];
}
