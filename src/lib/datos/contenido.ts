import "server-only";
import { cache } from "react";
import { reglasIniciales, sitioInicial } from "@/config/sitio";
import { serviciosIniciales } from "@/content/servicios";
import { textosIniciales } from "@/content/textos";
import { modoEjemplo, preciosEjemplo } from "@/config/ejemplo";
import { baseConfigurada } from "@/lib/supabase/entorno";
import { clientePublico } from "@/lib/supabase/publico";
import type { Categoria, ConfigSitio, ReglasReservas, Servicio, Textos } from "./tipos";

/**
 * Única puerta de entrada al contenido editable.
 *
 * - Con base de datos: la base es la fuente de verdad (lo que se edita en /admin).
 *   Los valores iniciales sólo completan claves que falten (por ejemplo, un campo
 *   agregado en una versión nueva del sitio).
 * - Sin base de datos: se usan los archivos de src/config y src/content.
 */

type Fila = { clave: string; valor: unknown };

const leerConfiguracion = cache(async (): Promise<Record<string, unknown>> => {
  if (!baseConfigurada()) return {};
  const { data, error } = await clientePublico().from("configuracion").select("clave, valor");
  if (error) throw new Error(`No se pudo leer la configuración: ${error.message}`);
  return Object.fromEntries((data as Fila[]).map((f) => [f.clave, f.valor]));
});

/** Combina objetos: lo guardado gana; los arrays se reemplazan completos. */
function fusionar<T>(inicial: T, guardado: unknown): T {
  if (!esObjeto(inicial) || !esObjeto(guardado)) return (guardado ?? inicial) as T;
  const salida: Record<string, unknown> = { ...inicial };
  for (const [clave, valor] of Object.entries(guardado)) {
    salida[clave] = clave in inicial ? fusionar((inicial as Record<string, unknown>)[clave], valor) : valor;
  }
  return salida as T;
}

function esObjeto(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export const obtenerSitio = cache(async (): Promise<ConfigSitio> => {
  return fusionar(sitioInicial, (await leerConfiguracion()).sitio);
});

export const obtenerTextos = cache(async (): Promise<Textos> => {
  return fusionar(textosIniciales, (await leerConfiguracion()).textos);
});

export const obtenerReglas = cache(async (): Promise<ReglasReservas> => {
  return fusionar(reglasIniciales, (await leerConfiguracion()).reservas);
});

type FilaServicio = {
  slug: string;
  categoria: Categoria;
  nombre: string;
  titulo_descripcion: string;
  descripcion: string;
  incluye: string[];
  duracion_texto: string;
  duracion_minutos: number;
  detalles: { titulo: string; texto: string }[];
  destacado: string | null;
  precio: number | null;
};

export function filaAServicio(f: FilaServicio): Servicio {
  return {
    slug: f.slug,
    categoria: f.categoria,
    nombre: f.nombre,
    tituloDescripcion: f.titulo_descripcion,
    descripcion: f.descripcion,
    incluye: f.incluye,
    duracion: f.duracion_texto,
    duracionMinutos: f.duracion_minutos,
    detalles: f.detalles,
    destacado: f.destacado,
    precio: f.precio,
  };
}

/** Servicios activos, en el orden definido. */
export const obtenerServicios = cache(async (): Promise<Servicio[]> => {
  // Vista previa: precios inventados para mostrar cómo se ve (nunca en el sitio real).
  if (modoEjemplo) return serviciosIniciales.map((s) => ({ ...s, precio: s.precio ?? preciosEjemplo[s.slug] ?? null }));
  if (!baseConfigurada()) return serviciosIniciales;
  const { data, error } = await clientePublico()
    .from("servicios")
    .select("slug, categoria, nombre, titulo_descripcion, descripcion, incluye, duracion_texto, duracion_minutos, detalles, destacado, precio")
    .eq("activo", true)
    .order("orden");
  if (error) throw new Error(`No se pudieron leer los servicios: ${error.message}`);
  return (data as FilaServicio[]).map(filaAServicio);
});

export async function obtenerServiciosDe(categoria: Categoria) {
  return (await obtenerServicios()).filter((s) => s.categoria === categoria);
}

/** Las reservas online funcionan sólo con la base conectada; si no, RESERVAR va a WhatsApp. */
export function reservasOnline(): boolean {
  return baseConfigurada() && !!process.env.SUPABASE_SERVICE_ROLE_KEY;
}
