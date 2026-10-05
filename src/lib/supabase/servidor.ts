import "server-only";
import { createClient } from "@supabase/supabase-js";
import { supabaseUrl } from "./entorno";

/**
 * Cliente con la clave secreta (service_role). Saltea RLS: usarlo SÓLO en el
 * servidor y sólo para operaciones acotadas (subir comprobantes y llamar a
 * crear_reserva). Nunca para acciones de la admin: esas usan su sesión.
 */
export function clienteServidor() {
  const clave = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!clave) throw new Error("Falta la variable de entorno SUPABASE_SERVICE_ROLE_KEY");
  return createClient(supabaseUrl, clave, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
