/**
 * Variables públicas de Supabase (URL y clave "publishable"/anon). Son públicas
 * por diseño: la seguridad la dan las políticas RLS de supabase/migrations.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** ¿Está conectada la base de datos? Sin ella, el sitio usa los archivos de src/config y src/content. */
export function baseConfigurada(): boolean {
  return supabaseUrl !== "" && supabaseAnonKey !== "";
}
