/**
 * ============================================================
 *  CONFIGURACIÓN GENERAL — Sofía Pink Flamingo
 * ============================================================
 *
 *  ¿Dónde se edita?
 *  - Con la base de datos conectada (Fase 2): desde el panel
 *    /admin → Configuración. Estos valores sólo se usan para
 *    cargar la base la primera vez.
 *  - Sin base de datos: acá mismo.
 *
 *  Regla de los placeholders:
 *  - Cualquier valor que empiece con "[" (por ejemplo "[COMPLETAR]")
 *    se considera "todavía no cargado". El sitio lo oculta o desactiva
 *    el botón correspondiente en lugar de mostrar un dato falso.
 * ============================================================
 */

import type { ConfigSitio, ReglasReservas } from "@/lib/datos/tipos";

export const marca = "Sofía Pink Flamingo";

/** URL pública del sitio. Se configura con la variable de entorno NEXT_PUBLIC_SITE_URL. */
export const urlSitio = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Zona horaria de la agenda. */
export const zonaHoraria = "America/Argentina/Buenos_Aires";

export const sitioInicial: ConfigSitio = {
  /** Frase breve que aparece debajo del logo en el inicio. */
  frase: "Belleza delicada, rituales de cuidado y lecturas del cielo.",

  ubicacion: {
    /** Dirección exacta, tal como se busca en Google Maps. Ej: "Av. Triunvirato 1234". */
    direccion: "[COMPLETAR DIRECCIÓN]",
    barrio: "Parque Chas",
    ciudad: "CABA",
    /** Indicaciones para llegar (página de contacto y email de confirmación). */
    indicaciones: "[COMPLETAR: timbre, piso, colectivos/subte cercanos, estacionamiento]",
  },

  contacto: {
    /** WhatsApp en formato internacional SIN "+", espacios ni guiones. Ej: "5491112345678". */
    whatsapp: "[COMPLETAR WHATSAPP]",
    /** Cómo se muestra el número en pantalla. Ej: "+54 9 11 1234-5678". */
    whatsappVisible: "[COMPLETAR WHATSAPP]",
    email: "[COMPLETAR EMAIL]",
    /** Usuario de Instagram SIN "@". */
    instagram: "[COMPLETAR INSTAGRAM]",
  },

  /** Horarios de atención que se muestran al público. Los turnos reales salen de "Horarios disponibles" del panel. */
  horarios: [
    { dias: "Lunes a viernes", horas: "[COMPLETAR]" },
    { dias: "Sábados", horas: "[COMPLETAR]" },
    { dias: "Domingos", horas: "[COMPLETAR]" },
  ],

  /**
   * Datos para la transferencia de la seña. Se muestran a quien reserva:
   * no son secretos. Nunca pongas acá claves, contraseñas ni tokens.
   */
  banco: {
    alias: "[ALIAS]",
    cbu: "[CBU]",
    titular: "[TITULAR]",
    cuit: "[CUIT]",
  },

  condicionesCancelacion:
    "[COMPLETAR: con cuánta anticipación se puede reprogramar/cancelar y qué pasa con la seña]",

  avisoAstrologia:
    "Una vez confirmada tu reserva recibirás información sobre los tiempos necesarios para preparar y analizar tu carta.",

  google: {
    /** Link a tus reseñas en Google (botón "Ver reseñas en Google"). */
    linkResenas: "[COMPLETAR LINK RESEÑAS GOOGLE]",
    /** Link "Escribir una reseña" de tu Perfil de Empresa de Google. */
    linkEscribirResena: "[COMPLETAR LINK ESCRIBIR RESEÑA]",
  },
};

export const reglasIniciales: ReglasReservas = {
  senaPorcentaje: 50,
  intervaloMinutos: 30,
  anticipacionMinimaHoras: 12,
  horizonteDias: 60,
  maxReservasPorHora: 3,
};
