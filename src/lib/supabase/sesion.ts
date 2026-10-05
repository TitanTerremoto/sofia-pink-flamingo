import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { supabaseAnonKey, supabaseUrl } from "./entorno";

/**
 * Cliente con la sesión de la persona que navega (cookies). Lo usa el panel:
 * todo lo que hace pasa por las políticas RLS y por es_admin() en la base.
 */
export async function clienteConSesion() {
  const almacen = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => almacen.getAll(),
      setAll: (lista) => {
        try {
          for (const { name, value, options } of lista) almacen.set(name, value, options);
        } catch {
          // Llamado desde un Server Component: no puede escribir cookies.
          // El refresco de sesión lo hace proxy.ts en cada request al panel.
        }
      },
    },
  });
}
