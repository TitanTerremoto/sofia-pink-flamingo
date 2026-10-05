/**
 * ============================================================
 *  SERVICIOS
 * ============================================================
 *  Acá se editan nombres, descripciones, qué incluye, duración, etc.
 *  - Los PRECIOS no se escriben acá: van en src/config/precios.ts.
 *  - Las FOTOS no se escriben acá: van en src/config/imagenes.ts.
 *  - Las duraciones son estimadas: revisalas y ajustalas a tu ritmo real.
 *  - `slug` es el identificador de la URL (#kapping). No lo cambies sin motivo.
 * ============================================================
 */

import { sitio } from "@/config/sitio";
import type { PrecioKey } from "@/config/precios";
import type { imagenes } from "@/config/imagenes";

export type Categoria = "manicuria" | "rostro" | "astrologia";

export type Servicio = {
  slug: keyof typeof imagenes.servicios;
  categoria: Categoria;
  nombre: string;
  /** Título del bloque descriptivo: "Descripción" o "¿Qué es?". */
  tituloDescripcion: string;
  descripcion: string;
  incluye: string[];
  duracion: string;
  /** Bloques extra según la categoría: mantenimiento, cuidados, modalidad, etc. */
  detalles: { titulo: string; texto: string }[];
  /** Mensaje destacado junto al precio (ej. "El precio incluye hasta 3 preguntas."). */
  destacado?: string;
  precioKey: PrecioKey;
  /** Duración en minutos para el sistema de reservas (Fase 2). */
  duracionMinutos: number;
};

const { diasHastaSesionCartaNatal, preguntasTarot } = sitio.astrologia;

export const servicios: Servicio[] = [
  // ───────────── MANICURÍA ─────────────
  {
    slug: "semipermanente",
    categoria: "manicuria",
    nombre: "Semipermanente manos y pies",
    tituloDescripcion: "Descripción",
    descripcion:
      "Esmaltado de larga duración que mantiene el brillo y el color intactos durante semanas, sin descascararse. Ideal para uñas naturales que buscan un acabado prolijo y luminoso.",
    incluye: [
      "Limado y forma",
      "Trabajo de cutículas",
      "Esmaltado semipermanente en el color que elijas",
      "Hidratación final",
    ],
    duracion: "1 h 30 min aprox.",
    detalles: [
      {
        titulo: "Mantenimiento / frecuencia",
        texto: "Se recomienda renovar cada 2 a 3 semanas para mantener las uñas sanas y prolijas.",
      },
    ],
    precioKey: "precio_semipermanente",
    duracionMinutos: 90,
  },
  {
    slug: "kapping",
    categoria: "manicuria",
    nombre: "Kapping",
    tituloDescripcion: "Descripción",
    descripcion:
      "Una capa protectora (gel o polygel) sobre la uña natural que la fortalece y ayuda a que crezca sin quebrarse. Perfecto si querés lucir tus propias uñas, más resistentes.",
    incluye: [
      "Preparación de la uña natural",
      "Aplicación de capa protectora",
      "Esmaltado semipermanente",
      "Hidratación final",
    ],
    duracion: "1 h 45 min aprox.",
    detalles: [
      {
        titulo: "Mantenimiento / frecuencia",
        texto: "Service cada 3 semanas aproximadamente, según el crecimiento de tus uñas.",
      },
    ],
    precioKey: "precio_kapping",
    duracionMinutos: 105,
  },
  {
    slug: "esculpidas",
    categoria: "manicuria",
    nombre: "Esculpidas",
    tituloDescripcion: "Descripción",
    descripcion:
      "Extensión de uñas modelada a mano para lograr el largo y la forma que soñás, con un acabado natural, elegante y resistente.",
    incluye: [
      "Preparación de la uña natural",
      "Esculpido con el largo y la forma elegidos",
      "Esmaltado semipermanente",
      "Hidratación final",
    ],
    duracion: "2 h 30 min aprox.",
    detalles: [
      {
        titulo: "Mantenimiento / frecuencia",
        texto: "Service cada 3 semanas para mantener la estructura y la estética de la uña.",
      },
    ],
    precioKey: "precio_esculpidas",
    duracionMinutos: 150,
  },

  // ───────────── ROSTRO ─────────────
  {
    slug: "lifting",
    categoria: "rostro",
    nombre: "Lifting de pestañas",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "Un tratamiento que eleva y curva tus pestañas naturales desde la raíz, abriendo la mirada sin necesidad de extensiones ni arqueador.",
    incluye: ["Limpieza de la zona", "Lifting con productos específicos", "Tinte de pestañas", "Nutrición final"],
    duracion: "1 h aprox.",
    detalles: [
      {
        titulo: "Cuidados",
        texto: "No mojar las pestañas durante las primeras 24 horas y evitar productos oleosos en la zona.",
      },
    ],
    precioKey: "precio_lifting",
    duracionMinutos: 60,
  },
  {
    slug: "laminado",
    categoria: "rostro",
    nombre: "Laminado de cejas",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "Alisa y peina los vellos de las cejas en la dirección deseada para lograr un efecto más tupido, prolijo y definido durante semanas.",
    incluye: ["Diagnóstico de la ceja", "Laminado", "Perfilado", "Nutrición final"],
    duracion: "1 h aprox.",
    detalles: [
      {
        titulo: "Cuidados",
        texto: "No mojar las cejas durante las primeras 24 horas y peinarlas a diario para mantener la forma.",
      },
    ],
    precioKey: "precio_laminado",
    duracionMinutos: 60,
  },
  {
    slug: "diseno",
    categoria: "rostro",
    nombre: "Diseño y perfilado",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "Un diseño de cejas pensado para tu rostro: se estudian tus proporciones para definir una forma armónica y natural.",
    incluye: ["Visagismo / estudio de proporciones", "Diseño personalizado", "Perfilado"],
    duracion: "45 min aprox.",
    detalles: [
      {
        titulo: "Cuidados",
        texto: "Evitar exposición solar directa y maquillaje en la zona durante algunas horas.",
      },
    ],
    precioKey: "precio_diseno",
    duracionMinutos: 45,
  },
  {
    slug: "sombreado",
    categoria: "rostro",
    nombre: "Sombreado",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "Un tinte suave que rellena y da profundidad a las cejas, logrando un efecto de maquillaje natural.",
    incluye: ["Diseño previo", "Aplicación de sombreado", "Perfilado final"],
    duracion: "45 min aprox.",
    detalles: [
      {
        titulo: "Cuidados",
        texto: "No mojar la zona durante las primeras horas y evitar exfoliantes sobre las cejas.",
      },
    ],
    precioKey: "precio_sombreado",
    duracionMinutos: 45,
  },

  // ───────────── ASTROLOGÍA ─────────────
  {
    slug: "carta-natal",
    categoria: "astrologia",
    nombre: "Carta natal",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "Una lectura y consultoría de tu carta natal: el mapa del cielo en el momento exacto de tu nacimiento. Un espacio para conocer tus potenciales, tus desafíos y tus ciclos con una mirada amorosa y consciente.",
    incluye: [
      "Análisis previo y personalizado de tu carta",
      "Sesión de lectura y consultoría",
      "Espacio para tus preguntas",
    ],
    duracion: "1 h 30 min de sesión aprox.",
    detalles: [
      {
        titulo: "Modalidad",
        texto: "[COMPLETAR: presencial / online por videollamada]",
      },
      {
        titulo: "Tiempos",
        texto: `Una vez realizada la reserva, la sesión se pacta aproximadamente ${diasHastaSesionCartaNatal} días después. Ese tiempo es necesario para analizar tu carta en profundidad antes del encuentro. Para armarla vas a necesitar tu fecha, hora exacta y lugar de nacimiento.`,
      },
    ],
    precioKey: "precio_carta_natal",
    duracionMinutos: 90,
  },
  {
    slug: "revolucion-solar",
    categoria: "astrologia",
    nombre: "Revolución solar",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "La carta que se levanta cada año alrededor de tu cumpleaños, cuando el Sol vuelve a la posición exacta en la que estaba al nacer. Muestra los temas, oportunidades y aprendizajes de tu nuevo ciclo anual.",
    incluye: [
      "Análisis personalizado de tu revolución solar",
      "Relación con tu carta natal",
      "Sesión de lectura y espacio para preguntas",
    ],
    duracion: "1 h 15 min de sesión aprox.",
    detalles: [
      {
        titulo: "Modalidad",
        texto: "[COMPLETAR: presencial / online por videollamada]",
      },
      {
        titulo: "Análisis personalizado",
        texto: "Cada revolución solar se prepara de manera individual, a partir de tus datos de nacimiento y del lugar donde vas a pasar tu cumpleaños.",
      },
    ],
    precioKey: "precio_revolucion_solar",
    duracionMinutos: 75,
  },
  {
    slug: "tarot-astrologico",
    categoria: "astrologia",
    nombre: "Tarot astrológico",
    tituloDescripcion: "¿Qué es?",
    descripcion:
      "Una lectura de tarot que integra el simbolismo de los planetas y los signos para responder tus preguntas con mayor profundidad y claridad.",
    incluye: [`Hasta ${preguntasTarot} preguntas`, "Tirada y lectura astrológica", "Orientación sobre cada respuesta"],
    duracion: "45 min aprox.",
    detalles: [
      {
        titulo: "Modalidad",
        texto: "[COMPLETAR: presencial / online por videollamada]",
      },
    ],
    destacado: `El precio incluye hasta ${preguntasTarot} preguntas.`,
    precioKey: "precio_tarot_astrologico",
    duracionMinutos: 45,
  },
];

export function serviciosDe(categoria: Categoria) {
  return servicios.filter((s) => s.categoria === categoria);
}
