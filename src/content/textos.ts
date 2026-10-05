/**
 * ============================================================
 *  TEXTOS DEL SITIO
 * ============================================================
 *  Todo lo que está entre [corchetes] es un dato personal que
 *  sólo vos podés completar. El resto es un borrador que podés
 *  reescribir libremente con tu voz.
 *  Con la base de datos conectada se editan desde /admin → Textos;
 *  estos valores sólo cargan la base la primera vez.
 * ============================================================
 */

import type { Textos } from "@/lib/datos/tipos";

export const textosIniciales: Textos = {
  sobreMi: {
    titulo: "Sobre mí",
    saludo: "Hola, soy Sofi.",
    /** Cada string es un párrafo. Podés agregar o quitar párrafos. */
    parrafos: [
      "[COMPLETAR: quién sos, en primera persona y con tus palabras. Por ejemplo, desde cuándo trabajás en esto y qué te llevó a empezar.]",
      "Manicuría — [COMPLETAR: tu recorrido y experiencia con las uñas: técnicas que dominás, años de práctica, lo que más disfrutás.]",
      "Rostro — [COMPLETAR: tu trabajo con pestañas y cejas: formación, enfoque, cómo cuidás la naturalidad de cada rostro.]",
      "Astrología — [COMPLETAR: tu formación y recorrido en astrología: dónde estudiaste, desde cuándo, cómo la vivís.]",
      "[COMPLETAR: tu manera de trabajar y tu filosofía. Qué querés que sienta cada persona que pasa por tu espacio.]",
    ],
    firma: "Sofi",
  },

  servicios: {
    titulo: "Servicios",
    bajada: "Tres maneras de cuidarte, un mismo espacio.",
  },

  categorias: {
    manicuria: {
      titulo: "Manicuría",
      bajada: "Uñas prolijas, delicadas y duraderas, hechas con tiempo y detalle.",
    },
    rostro: {
      titulo: "Rostro",
      bajada: "Miradas que se iluminan con naturalidad: pestañas y cejas a tu medida.",
    },
    astrologia: {
      titulo: "Astrología",
      bajada: "Un encuentro con tu cielo para mirarte con más claridad.",
    },
  },

  contacto: {
    titulo: "Contacto",
    bajada:
      "¿Tenés dudas sobre algún servicio o querés coordinar un turno? Escribime, me encanta conversar.",
  },

  resenas: {
    titulo: "Reseñas",
    bajada: "Lo que cuentan quienes ya pasaron por el espacio.",
  },
};
