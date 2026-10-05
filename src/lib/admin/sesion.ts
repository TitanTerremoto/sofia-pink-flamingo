import "server-only";
import { redirect } from "next/navigation";
import { clienteConSesion } from "@/lib/supabase/sesion";

/**
 * Exige una sesión de administradora. Se llama al principio de CADA página
 * y CADA acción del panel (las Server Actions son endpoints públicos).
 * Devuelve el cliente con la sesión: todo lo que haga pasa por RLS.
 */
export async function requerirAdmin() {
  const db = await clienteConSesion();
  const { data } = await db.auth.getClaims();
  if (!data?.claims) redirect("/admin/ingresar");

  const { data: esAdmin, error } = await db.rpc("es_admin");
  if (error) throw new Error(`No se pudo verificar el acceso: ${error.message}`);
  if (!esAdmin) redirect("/admin/ingresar?error=sin-acceso");

  return { db, email: (data.claims.email as string | undefined) ?? "" };
}
