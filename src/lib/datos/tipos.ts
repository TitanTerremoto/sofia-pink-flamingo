/**
 * Formato del contenido editable. Es el mismo en los archivos de
 * src/config y src/content (valores iniciales) y en la tabla
 * `configuracion` de la base (claves 'sitio', 'textos', 'reservas').
 */

export type Categoria = "manicuria" | "rostro" | "astrologia";

export type ConfigSitio = {
  frase: string;
  ubicacion: { direccion: string; barrio: string; ciudad: string; indicaciones: string };
  contacto: { whatsapp: string; whatsappVisible: string; email: string; instagram: string };
  horarios: { dias: string; horas: string }[];
  banco: { alias: string; cbu: string; titular: string; cuit: string };
  condicionesCancelacion: string;
  avisoAstrologia: string;
  google: { linkResenas: string; linkEscribirResena: string };
};

export type ReglasReservas = {
  /** % de seña sobre el precio del servicio. */
  senaPorcentaje: number;
  /** Cada cuántos minutos se ofrece un horario de inicio. */
  intervaloMinutos: number;
  /** No se puede reservar con menos de estas horas de anticipación. */
  anticipacionMinimaHoras: number;
  /** Hasta cuántos días hacia adelante se puede reservar. */
  horizonteDias: number;
  /** Anti-spam: reservas máximas por email por hora. */
  maxReservasPorHora: number;
};

export type Textos = {
  sobreMi: { titulo: string; saludo: string; parrafos: string[]; firma: string };
  servicios: { titulo: string; bajada: string };
  categorias: Record<Categoria, { titulo: string; bajada: string }>;
  contacto: { titulo: string; bajada: string };
  resenas: { titulo: string; bajada: string };
};

export type Servicio = {
  slug: string;
  categoria: Categoria;
  nombre: string;
  /** Título del bloque descriptivo: "Descripción" o "¿Qué es?". */
  tituloDescripcion: string;
  descripcion: string;
  incluye: string[];
  duracion: string;
  /** Duración real en minutos: define cuánto ocupa la agenda. */
  duracionMinutos: number;
  /** Bloques extra: mantenimiento, cuidados, modalidad, tiempos… */
  detalles: { titulo: string; texto: string }[];
  /** Mensaje destacado junto al precio (ej. "El precio incluye hasta 3 preguntas."). */
  destacado?: string | null;
  /** null = todavía sin precio: se muestra "$ X". */
  precio: number | null;
};
