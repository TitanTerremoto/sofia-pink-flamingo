import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { baseConfigurada, supabaseAnonKey, supabaseUrl } from "@/lib/supabase/entorno";

/**
 * Panel /admin: refresca la sesión (cookies) y manda a /admin/ingresar si no hay sesión.
 * Es sólo la primera barrera: cada página y cada acción del panel vuelve a
 * verificar que la persona sea admin (requerirAdmin) y la base lo verifica otra vez (RLS).
 */
export async function proxy(request: NextRequest) {
  let respuesta = NextResponse.next({ request });
  if (!baseConfigurada()) return respuesta;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (lista, encabezados) => {
        for (const { name, value } of lista) request.cookies.set(name, value);
        respuesta = NextResponse.next({ request });
        for (const { name, value, options } of lista) respuesta.cookies.set(name, value, options);
        for (const [clave, valor] of Object.entries(encabezados ?? {})) respuesta.headers.set(clave, valor);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const enLogin = request.nextUrl.pathname.startsWith("/admin/ingresar");
  if (!data?.claims && !enLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/ingresar";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return respuesta;
}

export const config = {
  matcher: ["/admin/:path*"],
};
