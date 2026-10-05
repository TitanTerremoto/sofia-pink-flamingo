import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./entorno";

/** Etiqueta de caché del contenido público; el panel la invalida al guardar cambios. */
export const TAG_CONTENIDO = "contenido";

/**
 * Cliente anónimo para leer contenido público (servicios, configuración).
 * Las respuestas se cachean y se invalidan desde el panel con updateTag(TAG_CONTENIDO).
 */
export function clientePublico() {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, next: { revalidate: 3600, tags: [TAG_CONTENIDO] } }),
    },
  });
}
