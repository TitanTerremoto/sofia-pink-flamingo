/**
 * ============================================================
 *  CONFIGURACIÓN GENERAL — Sofía Pink Flamingo
 * ============================================================
 *
 *  Este es EL lugar para cambiar datos de contacto, dirección,
 *  horarios, redes y datos bancarios. Todo el sitio lee de acá.
 *
 *  Regla de los placeholders:
 *  - Cualquier valor que empiece con "[" (por ejemplo "[COMPLETAR]")
 *    se considera "todavía no cargado". El sitio lo detecta y oculta
 *    o desactiva el botón correspondiente en lugar de mostrar un dato falso.
 *
 *  Precios     → src/config/precios.ts
 *  Fotos/logo  → src/config/imagenes.ts
 *  Textos      → src/content/textos.ts y src/content/servicios.ts
 * ============================================================
 */

export const sitio = {
  marca: "Sofía Pink Flamingo",
  /** Frase breve que aparece debajo del logo en el inicio. */
  frase: "Belleza delicada, rituales de cuidado y lecturas del cielo.",

  /** URL pública del sitio. Se configura en la variable de entorno NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  ubicacion: {
    /** Dirección exacta, tal como se busca en Google Maps. Ej: "Av. Triunvirato 1234, Parque Chas, CABA". */
    direccion: "[COMPLETAR DIRECCIÓN]",
    barrio: "Parque Chas",
    ciudad: "CABA",
    pais: "Argentina",
    /** Indicaciones para llegar (se usan en la página de contacto y, más adelante, en el email de confirmación). */
    indicaciones: "[COMPLETAR: timbre, piso, colectivos/subte cercanos, estacionamiento]",
  },

  contacto: {
    /** WhatsApp en formato internacional SIN "+", espacios ni guiones. Ej Argentina: "5491112345678". */
    whatsapp: "[COMPLETAR WHATSAPP]",
    /** Cómo se muestra el número en pantalla. Ej: "+54 9 11 1234-5678". */
    whatsappVisible: "[COMPLETAR WHATSAPP]",
    email: "[COMPLETAR EMAIL]",
    /** Usuario de Instagram SIN "@". Ej: "sofiapinkflamingo". */
    instagram: "[COMPLETAR INSTAGRAM]",
  },

  /** Horarios de atención que se muestran al público. (La disponibilidad real de turnos llega en la Fase 2.) */
  horarios: [
    { dias: "Lunes a viernes", horas: "[COMPLETAR]" },
    { dias: "Sábados", horas: "[COMPLETAR]" },
    { dias: "Domingos", horas: "[COMPLETAR]" },
  ],

  /**
   * Datos bancarios para la seña. Son placeholders.
   * Nota de seguridad: el alias/CBU para RECIBIR transferencias es un dato que se
   * muestra públicamente a quien reserva, no es un secreto. Nunca pongas acá claves,
   * contraseñas ni tokens.
   */
  banco: {
    alias: "[ALIAS]",
    cbu: "[CBU]",
    titular: "[TITULAR]",
    cuit: "[CUIT]",
  },

  reservas: {
    /** Porcentaje de seña requerido para confirmar un turno. */
    senaPorcentaje: 50,
    /**
     * "whatsapp": el botón RESERVAR abre WhatsApp con un mensaje armado (Fase 1, funciona hoy).
     * "online":   el botón RESERVAR abre el sistema de reservas propio (Fase 2).
     */
    modo: "whatsapp" as "whatsapp" | "online",
    condicionesCancelacion:
      "[COMPLETAR: con cuánta anticipación se puede reprogramar/cancelar y qué pasa con la seña]",
  },

  astrologia: {
    /** Días aproximados entre la reserva y la sesión de Carta Natal. */
    diasHastaSesionCartaNatal: 7,
    /** Cantidad de preguntas incluidas en el Tarot Astrológico. */
    preguntasTarot: 3,
    avisoPostReserva:
      "Una vez confirmada tu reserva recibirás información sobre los tiempos necesarios para preparar y analizar tu carta.",
  },

  google: {
    /** Link a tus reseñas en Google (botón "Ver reseñas en Google"). Lo copiás desde tu Perfil de Empresa. */
    linkResenas: "[COMPLETAR LINK RESEÑAS GOOGLE]",
    /** Link "Escribir una reseña" de tu Perfil de Empresa de Google. */
    linkEscribirResena: "[COMPLETAR LINK ESCRIBIR RESEÑA]",
    // La API key y el Place ID para traer reseñas automáticamente van en variables
    // de entorno (GOOGLE_PLACES_API_KEY y GOOGLE_PLACE_ID), nunca acá.
  },
} as const;

export type Sitio = typeof sitio;
